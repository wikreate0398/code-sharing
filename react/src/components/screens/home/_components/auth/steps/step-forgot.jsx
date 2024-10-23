import * as Yup from 'yup'
import { Box, Button, FormLabel, Typography } from '@mui/material'
import useStyles from './styles'
import { emailValidation, requiredMessage } from '#root/src/config/validation-messages'
import { Form, Formik } from 'formik'
import Icon from '#root/src/components/ui/icon'
import Input from '#root/src/components/ui/form/input'
import {
    useCheckUserMutation,
    useSendEmailCodeMutation
} from '#root/src/redux/api/auth.api'
import { useNotify } from '#root/src/helpers/hooks'
import React, { useContext } from 'react'
import {
    AUTH_STEP_CODE,
    AUTH_STEP_SIGNIN,
    AuthContextProvider
} from '../../context'
import FormControl from '#root/src/components/ui/form/form-control'
import CustomButton from '#root/src/components/ui/button/custom-button'

const validationSchema = Yup.object().shape({
    email: Yup.string().email(emailValidation).required(requiredMessage)
})

const StepForgot = () => {
    const classList = useStyles()
    const notify = useNotify()

    const [useCheckUser] = useCheckUserMutation()
    const [sendEmailCode] = useSendEmailCodeMutation()

    const { form, setStep, setPrevStep, setIsForgot, setForm } =
        useContext(AuthContextProvider)

    setPrevStep(AUTH_STEP_SIGNIN)

    const handleSubmit = async (data) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const resp = await useCheckUser({ email: data.email })

        if (!resp.data.exists) {
            return notify('Неверные данные', 'error')
        }

        await sendEmailCode({ email: data.email })
        setForm({ ...form, email: data.email })
        setIsForgot(true)
        setStep(AUTH_STEP_CODE)
    }

    return (
        <Box>
            <Box className={classList.root}>
                <Typography
                    variant="title-38"
                    align="center"
                    className={classList.title}
                >
                    Восстановить пароль
                </Typography>
                <Typography mt="10px" variant="help-text-17" align="center">
                    Вначале введите свою эл. почту
                </Typography>
            </Box>
            <Formik
                initialValues={{ email: form.email }}
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
                                value={values.email}
                                onChange={handleChange}
                                className={classList.input}
                                error={errors.email}
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
                            label="Продолжить"
                            className={classList.btn}
                            onClick={submitForm}
                        />
                    </Form>
                )}
            </Formik>
        </Box>
    )
}

export default StepForgot
