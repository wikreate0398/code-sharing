import { Box,  FormLabel, Stack, Typography } from '@mui/material'
import useStyles from './styles'
import { Form, Formik } from 'formik'
import Input from '#root/src/components/ui/form/input'
import {
    useCheckUserMutation,
    useLoginMutation,
    useSendEmailCodeMutation
} from '#root/src/redux/api/auth.api'
import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react'
import { flexEndProps } from '#root/src/helpers/functions'
import * as Yup from 'yup'
import { emailValidation, requiredMessage } from '#root/src/config/validation-messages'
import Icon from '#root/src/components/ui/icon'
import {
    AUTH_STEP_CODE,
    AUTH_STEP_FORGOT,
    AuthContextProvider
} from '../../context'
import FormControl from '#root/src/components/ui/form/form-control'
import { requestHandler } from '#root/src/redux/api-service'
import CustomButton from '#root/src/components/ui/button/custom-button'
import useAuthWithSocials from '#root/src/components/screens/home/_hooks/useAuthWithSocials.jsx'

const validationSchema = Yup.object().shape({
    email: Yup.string().email(emailValidation).required(requiredMessage)
})

const StepSignin = () => {
    const classList = useStyles()
    const formRef = useRef()
    const { form, setStep, setForm, resetForm, saveAuthCred } =
        useContext(AuthContextProvider)

    useEffect(() => {
        // if you navigate throughout the form we should reset it once you are back to signin

        resetForm()
    }, [])

    const [showPassword, setShowPassword] = useState(false)

    const [checkUser] = useCheckUserMutation()
    const [login] = useLoginMutation()
    const [sendEmailCode] = useSendEmailCodeMutation()

    const handleSubmit = (data) => {
        if (!showPassword) {
            return handleExistsEmail(data)
        }

        return handleLogin(data)
    }

    const handleExistsEmail = useCallback(
        (data) => {
            checkUser({ email: data.email }).then((result) =>
                requestHandler({
                    result,
                    on200Http: ({ exists }) => {
                        setForm({
                            ...(!exists ? form : {}),
                            email: data.email
                        })
                        if (!exists) {
                            sendEmailCode({ email: data.email })
                            return setStep(AUTH_STEP_CODE)
                        }
                        setShowPassword(true)
                    }
                })
            )
        },
        [form, setForm, setStep]
    )

    const handleLogin = (data) => {
        login(data).then((result) =>
            requestHandler({
                result,
                on200Http: ({ token, user }) => {
                    saveAuthCred(user, token)
                }
            })
        )
    }

    const handleForgot = () => {
        setStep(AUTH_STEP_FORGOT)
    }

    return (
        <Box>
            <Box className={classList.root}>
                <Typography
                    variant="title-38"
                    align="center"
                    className={classList.title}
                >
                    Введите почту
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
                {({ submitForm, values, handleChange, errors }) => (
                    <Form>
                        <FormControl>
                            <Input
                                label="Почта"
                                name="email"
                                type="email"
                                size="big"
                                labelInside
                                placeholder="itway@mail.com"
                                autoComplete="off"
                                value={values.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                        </FormControl>

                        {showPassword && (
                            <FormControl>
                                <Box {...flexEndProps()}>
                                    <FormLabel
                                        onClick={handleForgot}
                                        className={`${classList.formLabel} ${classList.forgotLabel}`}
                                    >
                                        Забыли пароль?
                                    </FormLabel>
                                </Box>
                                <Input
                                    label="Пароль"
                                    name="password"
                                    type="password"
                                    size="big"
                                    labelInside
                                    placeholder="•••••••••••••"
                                    autoComplete="off"
                                    value={values.password}
                                    onChange={handleChange}
                                    className={classList.input}
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
                            label="Войти"
                            className={classList.btn}
                            onClick={submitForm}
                        />

                        <LoginWithSocials />
                    </Form>
                )}
            </Formik>
        </Box>
    )
}

const LoginWithSocials = () => {
    const classList = useStyles()

    const { signInWithGoogle, signInWithYandex } = useAuthWithSocials()

    return (
        <>
            <Stack
                className={classList.divider}
                flexDirection="row"
                flexWrap="nowrap"
                alignItems="center"
            >
                <div />
                <Typography>Или</Typography>
                <div />
            </Stack>

            <Stack gap="15px">
                <CustomButton
                    variant="outlined"
                    icon={<Icon name="google_icon" width={24} height={24} />}
                    label="Google"
                    className={classList.socialAuthBtns}
                    onClick={signInWithGoogle}
                />

                <CustomButton
                    variant="outlined"
                    icon={<Icon name="yandex_icon" width={24} height={24} />}
                    label="Yandex"
                    className={classList.socialAuthBtns}
                    onClick={signInWithYandex}
                />
            </Stack>

        </>
    )
}

export default StepSignin
