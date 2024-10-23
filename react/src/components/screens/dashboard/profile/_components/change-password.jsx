import React from 'react'
import useStyles from '#root/src/components/screens/dashboard/profile/styles'
import { useNotify } from '#root/src/helpers/hooks'
import { useChangePasswordMutation } from '#root/src/redux/api/user.api'
import { requestHandler } from '#root/src/redux/api-service'
import { Form, Formik } from 'formik'
import FormControl from '#root/src/components/ui/form/form-control'
import Input from '#root/src/components/ui/form/input'
import * as Yup from 'yup'
import {
    mustContainDigitLetter,
    passLengthMax,
    passLengthMin,
    requiredMessage
} from '#root/src/config/validation-messages'
import Group from '#root/src/components/screens/dashboard/profile/_components/group'
import { useSelector } from 'react-redux'
import { selectAuthUser } from '#root/src/redux/slices/meta.slice'
import CustomButton from '#root/src/components/ui/button/custom-button'

const ValidationSchemaPassword = Yup.object().shape({
    has_pass: Yup.boolean(),
    old_password: Yup.string()
        .nullable(true)
        .required(requiredMessage)
        .when('has_pass', {
            is: (val) => !val,
            then: (schema) => schema.notRequired()
        }),

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
    const user = useSelector(selectAuthUser)

    const [changePassword] = useChangePasswordMutation()

    const initialValues = {
        old_password: null,
        new_password: null
    }

    const handleSubmit = async (
        values,
        { setSubmitting, setErrors, resetForm }
    ) => {
        setSubmitting(true)
        await changePassword(values).then((result) =>
            requestHandler({
                result,
                on200Http: () => {
                    notify('Пароль успешно изменен!', 'success')
                    resetForm()
                },
                on422Error: (errors) => {
                    setErrors(errors)
                },
                onFinishRequest: () => {
                    setSubmitting(false)
                }
            })
        )
    }

    const showOldPass = user.has_pass

    return (
        <Formik
            validationSchema={ValidationSchemaPassword}
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={{ ...initialValues, has_pass: user.has_pass }}
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
                const isDisabled =
                    (showOldPass && !old_password) || !new_password

                return (
                    <Form>
                        <Group title="ИЗМЕНИТЬ ПАРОЛЬ">
                            {showOldPass && (
                                <FormControl marginBottom={0}>
                                    <Input
                                        type="password"
                                        name="old_password"
                                        label="Старый пароль"
                                        placeholder="Старый пароль"
                                        value={old_password}
                                        onChange={handleChange}
                                        error={errors.old_password}
                                    />
                                </FormControl>
                            )}

                            <FormControl marginBottom={0}>
                                <Input
                                    type="password"
                                    name="new_password"
                                    label="Новый пароль"
                                    placeholder="Новый пароль"
                                    value={new_password}
                                    onChange={handleChange}
                                    error={errors.new_password}
                                />
                            </FormControl>

                            <CustomButton
                                onClick={submitForm}
                                className={classes.button}
                                disabled={isDisabled}
                                loading={isSubmitting}
                                label="Изменить"
                            />
                        </Group>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default ChangePassword
