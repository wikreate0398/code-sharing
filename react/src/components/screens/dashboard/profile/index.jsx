import React, { memo, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
    convertToBase64,
    empty,
    firstLatterUppercase,
    isEmail
} from '#root/src/helpers/functions'
import useStyles from './styles'
import { Box, Button, Stack, Typography } from '@mui/material'
import Input from '#root/src/components/ui/form/input'
import Multiselect from '#root/src/components/ui/form/multi-select'
import FormControl from '#root/src/components/ui/form/form-control'
import Icon from '#root/src/components/ui/icon'
import EditUserAvatar from '#root/src/components/screens/dashboard/profile/_components/edit-user-avatar'
import useEditUserInfo from '#root/src/components/screens/dashboard/profile/_hooks/useEditUserInfo'
import ChangePassword from '#root/src/components/screens/dashboard/profile/_components/change-password'
import Group from '#root/src/components/screens/dashboard/profile/_components/group'
import { selectAuthUser } from '#root/src/redux/slices/meta.slice'
import { useSendEmailCodeMutation } from '#root/src/redux/api/auth.api'
import {
    useDeleteAccountMutation,
    useHandleNetworkMutation
} from '#root/src/redux/api/user.api'
import { requestHandler } from '#root/src/redux/api-service'
import { useNotify } from '#root/src/helpers/hooks'
import { useGoogleLogin } from '@react-oauth/google'
import Autocomplete from '#root/src/components/ui/form/autocomplete'
import ConfirmDeleteModal from '#root/src/components/ui/confirm-delete-modal'
import { useRouter } from '#root/renderer/hooks'
import { logoutRoute } from '#root/src/config/routes'
import CustomButton from '#root/src/components/ui/button/custom-button'
import useAuthWithSocials from '#root/src/components/screens/home/_hooks/useAuthWithSocials.jsx'

const UserSettings = () => {
    const user = useSelector(selectAuthUser)
    const classes = useStyles()
    const [confirmModalOpen, setConfirmModalOpen] = useState(false)
    const handler = () => setConfirmModalOpen((open) => !open)

    const { formik, isFormChanged, timezonesList, skillsList } =
        useEditUserInfo()

    const { push } = useRouter()
    const [deleteAccount] = useDeleteAccountMutation()

    const {
        submitForm,
        resetForm,
        isSubmitting,
        handleChange,
        setErrors,
        values: { skills, login, email, code, name, avatar, tz },
        errors,
        setFieldValue
    } = formik

    const networkProvider = user.network_provider

    if (empty(user)) return null

    return (
        <Stack className={classes.root}>
            <Stack
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ minHeight: '38px' }}
            >
                <Typography className={classes.title}>
                    Настройки профиля
                </Typography>
                {isFormChanged && (
                    <Stack flexDirection="row" gap="8px">
                        <CustomButton
                            variant="outlined"
                            label="Отмена"
                            className={classes.button}
                            onClick={resetForm}
                        />

                        <CustomButton
                            label="Сохранить"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            onClick={submitForm}
                            className={classes.button}
                        />
                    </Stack>
                )}
            </Stack>

            <div className={classes.divider} />

            <Stack className={classes.content}>
                <EditUserAvatar
                    value={avatar}
                    name="avatar"
                    fileSize={2}
                    onChange={async (e) => {
                        const file = e.target.files[0]
                        const base64 = await convertToBase64(file)
                        setFieldValue('avatar', base64)
                        e.target.value = null
                    }}
                    accept=".jpg,.jpeg,.png,.webp"
                />

                <Stack className={classes.form}>
                    <Group>
                        <FormControl marginBottom={0}>
                            <Input
                                name="name"
                                label="Имя"
                                placeholder="Имя"
                                value={name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                        </FormControl>

                        <FormControl marginBottom={0}>
                            <Input
                                name="login"
                                label="Логин"
                                placeholder="Логин"
                                value={login}
                                onChange={handleChange}
                                error={errors.login}
                            />
                        </FormControl>

                        <FormControl marginBottom={0}>
                            <Multiselect
                                initialItems={skillsList}
                                values={skills}
                                label="Навыки"
                                size="small"
                                placeholder={
                                    skills?.length > 0 ? 'Добавить' : 'Выбрать'
                                }
                                onSelect={(option) => {
                                    setFieldValue('skills', [...skills, option])
                                }}
                                onCancel={(option) => {
                                    const filtered = skills.filter(
                                        (i) => i.id !== option.id
                                    )
                                    setFieldValue('skills', filtered)
                                }}
                                onCreate={(query) => {
                                    setFieldValue('skills', [
                                        ...skills,
                                        { name: query }
                                    ])
                                }}
                                _overrideClasses={{
                                    wrapper: classes.multiselectInputWrapper
                                }}
                            />
                            {errors.skills && (
                                <Box
                                    component="span"
                                    className={classes.formError}
                                >
                                    {errors.skills}
                                </Box>
                            )}
                        </FormControl>

                        <FormControl marginBottom={0}>
                            <Autocomplete
                                label="Часовой пояс"
                                name="tz"
                                value={timezonesList?.find(
                                    (v) => v.name === tz
                                )}
                                error={errors.tz}
                                onChange={(event, option) =>
                                    setFieldValue('tz', option?.name || null)
                                }
                                options={timezonesList || []}
                                getOptionLabel={(option) =>
                                    `${option.name} ${option.utc}`
                                }
                                renderOption={({ name, utc }) => {
                                    return `${name} ${utc}`
                                }}
                            />
                        </FormControl>
                    </Group>

                    <Group title="ДАННЫЕ ДЛЯ ВХОДА">
                        <Email
                            email={email}
                            error={errors.email}
                            code={code}
                            handleChange={handleChange}
                        />

                        <Socialite
                            user={user}
                            setErrors={setErrors}
                            networkProvider={networkProvider}
                        />
                    </Group>

                    <ChangePassword />

                    <Group title="УДАЛИТЬ АККАУНТ">
                        <Button className={classes.deleteBtn} onClick={handler}>
                            <Icon name="delete" width={18} height={18} />
                            Удалите мой аккаунт
                        </Button>
                    </Group>
                </Stack>
            </Stack>

            <ConfirmDeleteModal
                open={confirmModalOpen}
                onClose={handler}
                onDelete={() => deleteAccount().then(() => push(logoutRoute()))}
                message={
                    <>
                        Вы действительно <br /> хотите удалить учетную запись
                    </>
                }
            />
        </Stack>
    )
}

const Email = memo(({ email, error, code, handleChange }) => {
    const user = useSelector(selectAuthUser)
    const [sendEmailCode] = useSendEmailCodeMutation()
    const [send, setSend] = useState(false)

    useEffect(() => {
        if (email === user.email) {
            setSend(false)
        }
    }, [email, user])

    const isChangedEmail = email !== user.email

    return (
        <>
            <FormControl marginBottom={0}>
                <Input
                    name="email"
                    label="Электронная почта"
                    placeholder="email"
                    error={error}
                    disabled={Boolean(user.network_provider)}
                    onChange={handleChange}
                    value={email}
                />
            </FormControl>

            {send && isChangedEmail && (
                <FormControl marginBottom={0}>
                    <Input
                        name="code"
                        label="Код"
                        type="number"
                        onChange={handleChange}
                        value={code}
                    />
                </FormControl>
            )}

            {isChangedEmail && isEmail(email) && !send && (
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                        sendEmailCode({ email }).then(() => setSend(true))
                    }
                >
                    Отправить код
                </Button>
            )}
        </>
    )
})

const providers = ['google', 'yandex']

const Socialite = ({ setErrors, networkProvider, user }) => {
    const classes = useStyles()
    const notify = useNotify()
    const [handleNetwork] = useHandleNetworkMutation()
    const { signInWithYandex: yandexConnection } = useAuthWithSocials()
    const isLinkedNetwork = Boolean(networkProvider)

    const googleConnection = useGoogleLogin({
        onSuccess: ({ access_token }) =>
            handleRequest({ access_token, provider: 'google' }),
        onError: (errorResponse) => {
            alert(
                'Произошли неполадки. Воспользуйтесь другим способом атворизации'
            )
        },
        ux_mode: 'popup'
    })

    const handleClick = useCallback(
        (provider, isLinked) => () => {
            if (isLinked) return handleRequest()
            if (provider === 'google') googleConnection()
            if (provider === 'yandex')
                yandexConnection({
                    onSuccess: (params) => handleRequest(params)
                })
        },
        [isLinkedNetwork, user]
    )

    const handleRequest = (values) => {
        handleNetwork(values).then((result) =>
            requestHandler({
                result,
                on200Http: () => {
                    notify('Изменения успешно сохранены!', true)
                },
                on422Error: (errors) => {
                    setErrors(errors)
                }
            })
        )
    }

    return (
        <>
            {!isLinkedNetwork && (
                <Typography className={classes.textSocialAuth}>
                    Привяжите профиль к вашему аккаунту одной из платформ,{' '}
                    <br /> для быстрого входа
                </Typography>
            )}
            <Stack flexDirection="column" gap="15px">
                {providers.map((provider, k) => {
                    const name = firstLatterUppercase(provider)
                    return (
                        <>
                            <CustomButton
                                key={k}
                                variant="outlined"
                                icon={
                                    <Icon
                                        name={`${provider}_icon`}
                                        width={24}
                                        height={24}
                                    />
                                }
                                label={
                                    provider === networkProvider
                                        ? `Отвязать ${name}`
                                        : `Привязать ${name}`
                                }
                                className={classes.socialAuthBtns}
                                onClick={handleClick(
                                    provider,
                                    provider === networkProvider
                                )}
                            />
                            {!user.has_pass && networkProvider === provider && (
                                <Typography variant="small-gray">
                                    * Что бы отвязать, необходимо ввести новый
                                    пароль для дальнейшего входа в аккаунт
                                </Typography>
                            )}
                        </>
                    )
                })}
            </Stack>
        </>
    )
}

export default UserSettings
