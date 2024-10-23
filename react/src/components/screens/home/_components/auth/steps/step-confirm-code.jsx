import Input from '#root/src/components/ui/form/input'
import { Box, Button, Stack, Typography } from '@mui/material'
import React, {
    createRef,
    memo,
    useCallback,
    useContext,
    useEffect,
    useState
} from 'react'
import useStyles from './styles'
import Icon from '#root/src/components/ui/icon'
import { useNotify } from '#root/src/helpers/hooks'
import {
    useCheckCodeMutation,
    useSendEmailCodeMutation
} from '#root/src/redux/api/auth.api'
import {
    AUTH_STEP_FORGOT,
    AUTH_STEP_PASSWORD,
    AUTH_STEP_SIGNIN,
    AUTH_STEP_SIGNUP,
    AuthContextProvider
} from '../../context'
import { isLocal } from '#root/src/helpers/functions'
import CustomButton from '#root/src/components/ui/button/custom-button'

const SmsCodeInput = ({ onChange }) => {
    const classList = useStyles()
    const [code, setCode] = useState(['', '', '', ''])
    const inputRefs = [createRef(), createRef(), createRef(), createRef()]

    const handleChange = async (e, index) => {
        const value = e.target.value
        const newCode = [...code]

        if (/^\d*$/.test(value) && value.length <= 1) {
            newCode[index] = value
            setCode(newCode)

            if (value !== '' && index < 3) {
                inputRefs[index + 1].current.focus()
            }
        }

        if (newCode.join('').length === 4) {
            return onChange(newCode.join(''))
        }
    }

    return (
        <Box className={classList.wrapperCodes}>
            {code.map((digit, index) => (
                <Input
                    key={index}
                    inputRef={inputRefs[index]}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    maxLength={1}
                    inputMode="numeric"
                    pattern="[0-9]*"
                />
            ))}
        </Box>
    )
}

const StepConfirmCode = () => {
    const classList = useStyles()
    const notify = useNotify()

    const [code, setCode] = useState('')
    const [checkCode] = useCheckCodeMutation()

    const { form, isForgot, setStep, setPrevStep, setForm } =
        useContext(AuthContextProvider)

    setPrevStep(isForgot ? AUTH_STEP_FORGOT : AUTH_STEP_SIGNIN)

    const verify = async () => {
        if (code.length !== 4) {
            return notify('Заполните код', false)
        }

        await handleCheckCode(code)
    }

    const handleCheckCode = useCallback(
        async (code) => {
            await checkCode({
                email: form.email,
                code: code
            }).then((resp) => {
                if ('error' in resp) return

                setForm({ ...form, code })

                !isForgot
                    ? setStep(AUTH_STEP_SIGNUP)
                    : setStep(AUTH_STEP_PASSWORD)
            })
        },
        [checkCode, form, isForgot, setForm, setStep]
    )

    const handleChange = (code) => {
        setCode(code)
    }

    return (
        <>
            <Box className={classList.root}>
                <Typography
                    variant="title-38"
                    align="center"
                    className={classList.title}
                >
                    Проверка почты
                </Typography>
                <Typography mt="10px" variant="help-text-17" align="center">
                    Введите код из письма
                </Typography>
            </Box>

            <SmsCodeInput onChange={handleChange} />

            <CustomButton
                endIcon={<Icon name="arrow-right" width={16} height={16} />}
                label="Далее"
                className={classList.btn}
                onClick={verify}
            />

            <Resend email={form.email} />
        </>
    )
}

const TIMEOUT_SEC = isLocal() ? 5 : 60

const Resend = memo(({ email }) => {
    const classList = useStyles()
    const [sendEmailCode] = useSendEmailCodeMutation()

    const [counter, setCounter] = useState(TIMEOUT_SEC)

    useEffect(() => {
        let c
        if (counter > 0) {
            c = setTimeout(() => setCounter(counter - 1), 1000)
        }

        return () => clearTimeout(c)
    }, [counter])

    const handleResend = useCallback(async () => {
        setCounter(TIMEOUT_SEC)
        await sendEmailCode({ email })
    }, [email])

    return (
        <Stack className={classList.resendBox}>
            <Typography className={classList.resendText}>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                Не получили код?
            </Typography>
            <Button
                disabled={counter > 0}
                onClick={handleResend}
                className={classList.resendBtn}
            >
                Отправить повторно {Boolean(counter) && `(${counter})`}
            </Button>
        </Stack>
    )
})

export default StepConfirmCode
