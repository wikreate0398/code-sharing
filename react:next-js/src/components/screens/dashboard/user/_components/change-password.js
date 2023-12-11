import React from 'react'
import useStyles from '@/components/screens/dashboard/user/styles'
import { useNotify } from '@/helpers/hooks'
import { useChangePasswordMutation } from '@/redux/api/auth.api'
import { requestHandler } from '@/redux/api-service'
import { Form, Formik } from 'formik'
import FormControl from '@/components/ui/form/form-control'
import Input from '@/components/ui/form/input'
import SubmitBtn from '@/components/ui/form/submit-button'
import * as Yup from 'yup'
import {
    mustContainDigitLetter,
    passLengthMax,
    passLengthMin,
    requiredMessage
} from '@/config/validation-messages'
import Group from '@/components/screens/dashboard/user/_components/group'

const ValidationSchemaPassword = Yup.object().shape({
    old_password: Yup.string().required(requiredMessage),

    new_password: Yup.string()
        .min(6, passLengthMin)
        .max(15, passLengthMax)
        .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d!@#$%^&*()\-_+=`~‘“/?\\|<>]+$/,
            mustContainDigitLetter('Пароль')
        )
        .required(requiredMessage)
})

const ChangePassword = () => {
    const classes = useStyles()
    const notify = useNotify()

    const [changePassword] = useChangePasswordMutation()

    const initialValues = {
        old_password: null,
        new_password: null
    }

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            setSubmitting(true)
            await changePassword(values).then((result) =>
                requestHandler({
                    result,
                    on200Http: () => {
                        notify('Пароль успешно изменен!', 'success')
                        setSubmitting(false)
                    },
                    on422Error: (errors) => {
                        setErrors(errors)
                    }
                })
            )
        } catch (e) {
            console.log('catch', e)
            notify('Ошибка, попробуйте позже!', 'error')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Formik
            validationSchema={ValidationSchemaPassword}
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleSubmit}
        >
            {({
                submitForm,
                isSubmitting,
                handleChange,
                values: { old_password, new_password },
                errors
            }) => {
                const isDisabled = !old_password || !new_password

                return (
                    <Form>
                        <Group title="CHANGE PASSWORD">
                            <FormControl marginBottom={0}>
                                <Input
                                    type="password"
                                    name="old_password"
                                    title="Old Password"
                                    placeholder="Old password"
                                    value={old_password}
                                    onChange={handleChange}
                                    error={errors.old_password}
                                />
                            </FormControl>

                            <FormControl marginBottom={0}>
                                <Input
                                    type="password"
                                    name="new_password"
                                    title="New Password"
                                    placeholder="New Password"
                                    value={new_password}
                                    onChange={handleChange}
                                    error={errors.new_password}
                                />
                            </FormControl>

                            <SubmitBtn
                                onClick={submitForm}
                                className={classes.button}
                                disabled={isDisabled}
                                isSubmitting={isSubmitting}
                            >
                                Change
                            </SubmitBtn>
                        </Group>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default ChangePassword
