'use client'

import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { convertToBase64, empty } from '@/helpers/functions'
import useStyles from './styles'
import { Box, Button, MenuItem, Stack, Typography } from '@mui/material'
import Input from '@/components/ui/form/input'
import Multiselect from '@/components/ui/form/multi-select'
import FormControl from '@/components/ui/form/form-control'
import SubmitBtn from '@/components/ui/form/submit-button'
import Icon from '@/components/ui/icon'
import Select from '@/components/ui/form/select'
import ConfirmDeleteModal from '@/components/screens/dashboard/user/_components/confirm-delete-modal'
import EditUserAvatar from '@/components/screens/dashboard/user/_components/edit-user-avatar'
import useEditUserInfo from '@/components/screens/dashboard/user/_hooks/useEditUserInfo'
import ChangePassword from '@/components/screens/dashboard/user/_components/change-password'
import Group from '@/components/screens/dashboard/user/_components/group'

const UserSettings = () => {
    const user = useSelector((state) => state.meta.user)
    const classes = useStyles()
    const [confirmModalOpen, setConfirmModalOpen] = useState(false)
    const handler = () => setConfirmModalOpen((open) => !open)

    const { formik, isFormChanged, timezonesList, skillsList } =
        useEditUserInfo()

    const {
        submitForm,
        resetForm,
        isSubmitting,
        handleChange,
        values: { skills, login, email, name, avatar, tz },
        errors,
        setFieldValue
    } = formik

    if (empty(user)) return null

    return (
        <Stack className={classes.root}>
            <Stack
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ minHeight: '49px' }}
            >
                <Typography className={classes.title}>
                    Personal Settings
                </Typography>
                {isFormChanged && (
                    <Stack flexDirection="row" gap="8px">
                        <Button
                            variant="borders"
                            className={classes.button}
                            onClick={resetForm}
                        >
                            Cancel
                        </Button>

                        <SubmitBtn
                            className={classes.button}
                            isSubmitting={isSubmitting}
                            disabled={isSubmitting}
                            onClick={submitForm}
                        >
                            Save
                        </SubmitBtn>
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

                        // to reset state of input
                        e.target.value = null
                    }}
                    accept=".jpg,.jpeg,.png,.webp"
                />

                <Stack className={classes.form}>
                    <Group>
                        <FormControl marginBottom={0}>
                            <Input
                                name="name"
                                title="Name"
                                placeholder="Name"
                                value={name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                        </FormControl>

                        <FormControl marginBottom={0}>
                            <Input
                                name="login"
                                title="Username"
                                placeholder="Username"
                                value={login}
                                onChange={handleChange}
                                error={errors.login}
                            />
                        </FormControl>

                        <FormControl marginBottom={0}>
                            <Multiselect
                                initialItems={skillsList}
                                values={skills}
                                label="Skills"
                                placeholder={
                                    skills?.length > 0 ? 'Add' : 'Choose'
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

                        <FormControl>
                            <Select
                                label="Timezone *"
                                name="tz"
                                value={tz}
                                error={errors.tz}
                                onChange={handleChange}
                            >
                                {timezonesList?.map(({ name, utc }) => {
                                    return (
                                        <MenuItem key={name} value={name}>
                                            {name} {utc}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </Group>

                    <Group title="LOGIN DATA">
                        <FormControl marginBottom={0}>
                            <Input
                                name="email"
                                title="E-mail"
                                placeholder="email"
                                disabled
                                value={email}
                            />
                        </FormControl>
                        <Typography className={classes.textSocialAuth}>
                            Привяжите профиль к вашему аккаунту одной из
                            платформ, <br /> для быстрого входа
                        </Typography>
                        <Stack flexDirection="row" gap="8px">
                            <Button
                                variant="borders"
                                className={classes.socialAuthBtns}
                            >
                                <Icon
                                    name="google_icon"
                                    width={24}
                                    height={24}
                                />
                                Google
                            </Button>
                        </Stack>
                    </Group>

                    <ChangePassword />

                    <Group title="DELETE ACCOUNT">
                        <Button className={classes.deleteBtn} onClick={handler}>
                            <Icon name="delete" width={20} height={20} />
                            Delete my account
                        </Button>
                    </Group>
                </Stack>
            </Stack>

            <ConfirmDeleteModal handler={handler} open={confirmModalOpen} />
        </Stack>
    )
}

export default UserSettings
