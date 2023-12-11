import { Box, Button, FormLabel, Typography } from '@mui/material'
import useStyles from './styles'
import { Form, Formik } from 'formik'
import Input from '@/components/ui/form/input'
import { useCheckUserMutation, useLoginMutation } from '@/redux/api/auth.api'
import { useCallback, useContext, useRef, useState } from 'react'
import { spaceBetweenProps } from '@/helpers/functions'
import * as Yup from 'yup'
import { emailValidation, requiredMessage } from '@/config/validation-messages'
import Icon from '@/components/ui/icon'
import {
    AUTH_STEP_FORGOT,
    AUTH_STEP_SIGNUP,
    AuthContextProvider
} from '../../context'
import FormControl from '@/components/ui/form/form-control'
import { requestHandler } from '@/redux/api-service'

const validationSchema = Yup.object().shape({
    email: Yup.string().email(emailValidation).required(requiredMessage)
})

const StepSignin = () => {
    const classList = useStyles()
    const formRef = useRef()
    const { form, setStep, setForm, saveAuthCred } =
        useContext(AuthContextProvider)

    const [showPassword, setShowPassword] = useState(false)

    const [checkUser] = useCheckUserMutation()
    const [login] = useLoginMutation()

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
                        setForm({ ...(!exists ? form : {}), email: data.email })
                        if (!exists) {
                            return setStep(AUTH_STEP_SIGNUP)
                        }
                        setShowPassword(true)
                    }
                })
            )
        },
        [form, setForm, setStep]
    )

    const handleLogin = (data) => {
        if (data.password.length <= 0) {
            return formRef.current.setFieldError('password', 'Укажите пароль')
        }

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
                            <FormLabel className={classList.formLabel}>
                                Email*
                            </FormLabel>
                            <Input
                                name="email"
                                type="email"
                                placeholder="itway@mail.com"
                                value={values.email}
                                onChange={handleChange}
                                className={classList.input}
                                error={errors.email}
                            />
                        </FormControl>

                        {showPassword && (
                            <FormControl>
                                <Box {...spaceBetweenProps()}>
                                    <FormLabel className={classList.formLabel}>
                                        Password*
                                    </FormLabel>
                                    <FormLabel
                                        onClick={handleForgot}
                                        className={`${classList.formLabel} ${classList.forgotLabel}`}
                                    >
                                        Forgot Password?
                                    </FormLabel>
                                </Box>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="•••••••••••••"
                                    value={values.password}
                                    onChange={handleChange}
                                    className={classList.input}
                                />
                            </FormControl>
                        )}

                        <Button
                            className={classList.btn}
                            onClick={submitForm}
                            fullWidth
                            variant="black"
                        >
                            Log in
                            <Icon name="arrow-right" width={16} height={16} />
                        </Button>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}

export default StepSignin
