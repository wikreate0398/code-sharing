import * as Yup from 'yup'
import { Box, Button, FormLabel, Typography } from '@mui/material'
import useStyles from './styles'
import { emailValidation, requiredMessage } from '@/config/validation-messages'
import { Form, Formik } from 'formik'
import Icon from '@/components/ui/icon'
import Input from '@/components/ui/form/input'
import {
    useCheckUserMutation,
    useSendEmailCodeMutation
} from '@/redux/api/auth.api'
import { useNotify } from '@/helpers/hooks'
import { useContext } from 'react'
import {
    AUTH_STEP_CODE,
    AUTH_STEP_SIGNIN,
    AuthContextProvider
} from '../../context'
import FormControl from '@/components/ui/form/form-control'

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
                    Reset password
                </Typography>
                <Typography mt="10px" variant="help-text-17" align="center">
                    First, enter your email.{' '}
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

export default StepForgot
