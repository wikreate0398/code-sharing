import * as Yup from 'yup'
import { Box, Button, FormLabel, Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import {
    loginValidation,
    minimumSymbols,
    mustContainDigitLetter,
    passLengthMax,
    passLengthMin,
    passMustntMatchLogin,
    requiredMessage
} from '@/config/validation-messages'
import { useFetch } from '@/helpers/hooks'
import {
    useCheckUserMutation,
    useSendEmailCodeMutation
} from '@/redux/api/auth.api'
import { convertToBase64 } from '@/helpers/functions'
import { AUTH_STEP_SIGNIN, AuthContextProvider } from '../../context'
import Input from '@/components/ui/form/input'
import Icon from '@/components/ui/icon'
import UploadAvatar from '@/components/ui/form/upload-avatar'
import React, { useContext, useRef } from 'react'
import Multiselect from '@/components/ui/form/multi-select'
import useStyles from './styles'
import FormControl from '@/components/ui/form/form-control'
import { requestHandler } from '@/redux/api-service'

const validationSchema = Yup.object().shape({
    avatar: Yup.string().notRequired(),
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
        .required(requiredMessage),
    skills: Yup.array().min(1, requiredMessage).required(requiredMessage)
})

const StepSignup = () => {
    const classList = useStyles()

    const { data: skills } = useFetch('meta/fetch-skills')
    const { step, setStep, form, setForm, setPrevStep } =
        useContext(AuthContextProvider)

    const [checkUser] = useCheckUserMutation()
    const [sendEmailCode] = useSendEmailCodeMutation()

    const formRef = useRef()

    setPrevStep(AUTH_STEP_SIGNIN)

    const handleSubmit = (values) => {
        checkUser({ login: values.login }).then((result) =>
            requestHandler({
                result,
                on200Http: (data) => {
                    if (data?.exists) {
                        return formRef.current.setFieldError(
                            'login',
                            data.message
                        )
                    }

                    setStep(step + 1)
                    setForm({ ...form, ...values })

                    sendEmailCode({ email: form.email })
                }
            })
        )
    }

    return (
        <>
            <Box className={classList.root}>
                <Typography
                    variant="title-38"
                    align="center"
                    className={classList.title}
                >
                    Tell more about you
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
                }) => (
                    <Form>
                        <FormControl>
                            <UploadAvatar
                                mb="24px"
                                fileSize={2}
                                name="avatar"
                                onChange={async (e) => {
                                    const file = e.target.files[0]
                                    const base64 = await convertToBase64(file)

                                    formRef.current.setFieldValue(
                                        'avatar',
                                        base64
                                    )
                                }}
                                accept=".jpg,.jpeg,.png,.webp"
                                value={values.avatar}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel className={classList.formLabel}>
                                Login*
                            </FormLabel>
                            <Input
                                name="login"
                                placeholder="John"
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
                                label="Skills*"
                                placeholder={
                                    values.skills.length > 0 ? 'Add' : 'Choose'
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
                            />
                            {errors.skills && (
                                <Box
                                    component="span"
                                    className={classList.formError}
                                >
                                    {errors.skills}
                                </Box>
                            )}
                        </FormControl>

                        <FormControl>
                            <FormLabel className={classList.formLabel}>
                                Password *
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

                        <Button
                            className={classList.btn}
                            onClick={submitForm}
                            fullWidth
                            variant="black"
                        >
                            Continue{' '}
                            <Icon name="arrow-right" width={16} height={16} />
                        </Button>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default StepSignup
