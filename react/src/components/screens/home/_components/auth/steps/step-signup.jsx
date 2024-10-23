import * as Yup from 'yup'
import {
    Box,
    Button,
    FormHelperText,
    FormLabel,
    Typography
} from '@mui/material'
import { Form, Formik } from 'formik'
import {
    loginValidation,
    minimumSymbols,
    mustContainDigitLetter,
    passLengthMax,
    passLengthMin,
    passMustntMatchLogin,
    requiredMessage
} from '#root/src/config/validation-messages'
import { useFetch } from '#root/src/helpers/hooks'
import { useSignupMutation } from '#root/src/redux/api/auth.api'
import { convertToBase64, tz } from '#root/src/helpers/functions'
import { AUTH_STEP_SIGNIN, AuthContextProvider } from '../../context'
import Input from '#root/src/components/ui/form/input'
import Icon from '#root/src/components/ui/icon'
import UploadAvatar from '#root/src/components/ui/form/upload-avatar'
import React, { useContext, useRef } from 'react'
import Multiselect from '#root/src/components/ui/form/multi-select'
import useStyles from './styles'
import FormControl from '#root/src/components/ui/form/form-control'
import CustomButton from '#root/src/components/ui/button/custom-button'

const validationSchema = Yup.object().shape({
    avatar: Yup.string().notRequired(),
    name: Yup.string().notRequired().min(3, minimumSymbols(2)),
    login: Yup.string()
        .min(2, minimumSymbols(2))
        .matches(/^(?!_)(?=[a-zA-Z])([a-zA-Z0-9_])*$/, loginValidation)
        .required(requiredMessage),
    password: Yup.string()
        .min(6, passLengthMin)
        .max(32, passLengthMax)
        .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d!@#$%^&*()\-_+=`~‘“/?\\|<>]+$/,
            mustContainDigitLetter('Пароль')
        )
        .test('unique', passMustntMatchLogin, (value, { parent }) => {
            return value !== parent.login
        })
        .required(requiredMessage)
        .when('social_token', {
            is: (val) => Boolean(val),
            then: (schema) => schema.notRequired()
        }),
    skills: Yup.array().min(1, requiredMessage).required(requiredMessage)
})

const StepSignup = () => {
    const classList = useStyles()

    const { data: skills } = useFetch('meta/fetch-skills')
    const { form, setPrevStep, saveAuthCred } = useContext(AuthContextProvider)

    const [signup] = useSignupMutation()

    const formRef = useRef()

    setPrevStep(AUTH_STEP_SIGNIN)

    const handleSubmit = async (values) => {
        const req_fields = ['name', 'login', 'avatar', 'skills', 'tz']
        const variants = values?.social_token
            ? ['social_token', 'network_provider']
            : ['code', 'email', 'password']

        let fields = Object.entries(values)
            .filter(([k]) => {
                let fields = [...req_fields, ...variants]
                return fields.includes(k)
            })
            .map((item) => {
                let [k, v] = item
                if (k === 'skills') {
                    return [k, v.map(({ id, name }) => ({ id, name }))]
                }

                return item
            })

        const data = Object.fromEntries(fields)

        await signup(data).then((resp) => {
            if ('error' in resp) return
            const { token, user } = resp.data
            saveAuthCred(user, token)
        })
    }

    return (
        <>
            <Box className={classList.root}>
                <Typography
                    variant="title-38"
                    align="center"
                    className={classList.title}
                >
                    Расскажите немного о себе
                </Typography>
            </Box>
            <Formik
                innerRef={formRef}
                initialValues={form}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
                validateOnBlur={false}
                validateOnChange={false}
            >
                {({
                    submitForm,
                    values,
                    handleChange,
                    errors,
                    setFieldValue
                }) => {
                    const isSocialAuth = values?.social_token

                    return (
                        <Form>
                            <FormControl>
                                <UploadAvatar
                                    mb="24px"
                                    fileSize={2}
                                    name="avatar"
                                    onChange={async (e) => {
                                        const file = e.target.files[0]
                                        const base64 =
                                            await convertToBase64(file)

                                        formRef.current.setFieldValue(
                                            'avatar',
                                            base64
                                        )
                                    }}
                                    accept=".jpg,.jpeg,.png,.webp"
                                    value={values.avatar}
                                />
                            </FormControl>

                            {isSocialAuth && (
                                <FormControl>
                                    <Input
                                        label="Имя *"
                                        name="name"
                                        size="big"
                                        labelInside
                                        value={values.name}
                                        onChange={handleChange}
                                        className={classList.input}
                                        error={errors.name}
                                    />
                                </FormControl>
                            )}

                            <FormControl>
                                <Input
                                    label="Логин *"
                                    name="login"
                                    labelInside
                                    autoComplete="off"
                                    size="big"
                                    value={values.login}
                                    onChange={handleChange}
                                    className={classList.input}
                                    error={errors.login}
                                />
                            </FormControl>

                            <FormControl>
                                <Multiselect
                                    initialItems={skills}
                                    values={values.skills}
                                    label="Навыки *"
                                    placeholder={
                                        values.skills.length > 0
                                            ? 'Добавить'
                                            : 'Выбрать'
                                    }
                                    onSelect={(option) => {
                                        setFieldValue('skills', [
                                            ...values.skills,
                                            option
                                        ])
                                    }}
                                    onCancel={(option) => {
                                        const filtered = values.skills.filter(
                                            (i) => i.id !== option.id
                                        )
                                        setFieldValue('skills', filtered)
                                    }}
                                    onCreate={(query) => {
                                        setFieldValue('skills', [
                                            ...values.skills,
                                            { name: query }
                                        ])
                                    }}
                                    error={errors.skills}
                                />
                            </FormControl>

                            {!isSocialAuth && (
                                <FormControl>
                                    <Input
                                        label="Пароль *"
                                        name="password"
                                        type="password"
                                        labelInside
                                        size="big"
                                        placeholder="•••••••••••••"
                                        value={values.password}
                                        onChange={handleChange}
                                        className={classList.input}
                                        error={errors.password}
                                    />
                                </FormControl>
                            )}

                            <CustomButton
                                endIcon={
                                    <Icon
                                        name="arrow-right"
                                        width={16}
                                        height={16}
                                    />
                                }
                                label="Сохранить"
                                className={classList.btn}
                                onClick={submitForm}
                            />
                        </Form>
                    )
                }}
            </Formik>
        </>
    )
}

export default StepSignup
