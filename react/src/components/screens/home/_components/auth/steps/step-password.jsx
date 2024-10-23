import * as Yup from 'yup'
import { Box, Button, FormLabel, Typography } from '@mui/material'
import useStyles from './styles'
import {
    mustContainDigitLetter,
    passLengthMax,
    passLengthMin,
    passNotMatch,
    requiredMessage
} from '#root/src/config/validation-messages'
import { Form, Formik } from 'formik'
import Icon from '#root/src/components/ui/icon'
import Input from '#root/src/components/ui/form/input'
import { useForgotPasswordMutation } from '#root/src/redux/api/auth.api'
import React, { useCallback, useContext } from 'react'
import { AUTH_STEP_FORGOT, AuthContextProvider } from '../../context'
import FormControl from '#root/src/components/ui/form/form-control'
import { requestHandler } from '#root/src/redux/api-service'
import CustomButton from '#root/src/components/ui/button/custom-button'

const validationSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, passLengthMin)
        .max(15, passLengthMax)
        .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d!@#$%^&*()\-_+=`~‘“/?\\|<>]+$/,
            mustContainDigitLetter('Пароль')
        )
        .required(requiredMessage),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], passNotMatch)
        .required(requiredMessage)
})

const StepChangePassword = () => {
    const classList = useStyles()
    const [forgotPassword] = useForgotPasswordMutation()
    const { form, setPrevStep, saveAuthCred } = useContext(AuthContextProvider)

    setPrevStep(AUTH_STEP_FORGOT)

    const handleSubmit = useCallback(
        (data) => {
            forgotPassword({
                email: form.email,
                ...data
            }).then((result) =>
                requestHandler({
                    result,
                    on200Http: ({ token, user }) => {
                        saveAuthCred(user, token)
                    }
                })
            )
        },
        [saveAuthCred, form]
    )

    return (
        <Box>
            <Box className={classList.root}>
                <Typography
                    variant="title-38"
                    align="center"
                    className={classList.title}
                >
                    Новый пароль
                </Typography>
                <Typography mt="10px" variant="help-text-17" align="center">
                    Введите надежный пароль
                </Typography>
            </Box>
            <Formik
                initialValues={{ password: '', confirmPassword: '' }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
                validateOnBlur={false}
                validateOnChange={false}
            >
                {({ submitForm, values, handleChange, errors }) => (
                    <Form>
                        <FormControl>
                            <Input
                                label="Пароль"
                                name="password"
                                type="password"
                                size="big"
                                labelInside
                                placeholder="•••••••••••••"
                                value={values.password}
                                onChange={handleChange}
                                className={classList.input}
                                error={errors.password}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                label="Повторите пароль"
                                name="confirmPassword"
                                type="password"
                                size="big"
                                labelInside
                                placeholder="•••••••••••••"
                                value={values.confirmPassword}
                                onChange={handleChange}
                                className={classList.input}
                                error={errors.confirmPassword}
                            />
                        </FormControl>

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
                )}
            </Formik>
        </Box>
    )
}

export default StepChangePassword
