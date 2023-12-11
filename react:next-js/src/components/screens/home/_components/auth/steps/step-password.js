import * as Yup from 'yup'
import { Box, Button, FormLabel, Typography } from '@mui/material'
import useStyles from './styles'
import {
    mustContainDigitLetter,
    passLengthMax,
    passLengthMin,
    passNotMatch,
    requiredMessage
} from '@/config/validation-messages'
import { Form, Formik } from 'formik'
import Icon from '@/components/ui/icon'
import Input from '@/components/ui/form/input'
import { useChangePasswordMutation } from '@/redux/api/auth.api'
import { useCallback, useContext } from 'react'
import { AUTH_STEP_FORGOT, AuthContextProvider } from '../../context'
import FormControl from '@/components/ui/form/form-control'
import { requestHandler } from '@/redux/api-service'

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
    const [changePassword] = useChangePasswordMutation()
    const { form, setPrevStep, saveAuthCred } = useContext(AuthContextProvider)

    setPrevStep(AUTH_STEP_FORGOT)

    const handleSubmit = useCallback(
        (data) => {
            changePassword({
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
                    Enter new password
                </Typography>
                <Typography mt="10px" variant="help-text-17" align="center">
                    Enter your new password
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
                            <FormLabel className={classList.formLabel}>
                                Password*
                            </FormLabel>
                            <Input
                                name="password"
                                type="password"
                                placeholder="•••••••••••••"
                                value={values.password}
                                onChange={handleChange}
                                className={classList.input}
                                error={errors.password}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel className={classList.formLabel}>
                                Verify Password*
                            </FormLabel>
                            <Input
                                name="confirmPassword"
                                type="password"
                                placeholder="•••••••••••••"
                                value={values.confirmPassword}
                                onChange={handleChange}
                                className={classList.input}
                                error={errors.confirmPassword}
                            />
                        </FormControl>
                        <Button
                            className={classList.btn}
                            onClick={submitForm}
                            fullWidth
                            variant="black"
                        >
                            Continue
                            <Icon name="arrow-right" width={16} height={16} />
                        </Button>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}

export default StepChangePassword
