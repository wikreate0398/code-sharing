import Input from '@/components/ui/form/input'
import { Box, Button, Typography } from '@mui/material'
import { createRef, useCallback, useContext, useState } from 'react'
import useStyles from './styles'
import Icon from '@/components/ui/icon'
import { useNotify } from '@/helpers/hooks'
import { useCheckCodeMutation, useSignupMutation } from '@/redux/api/auth.api'
import { pluck } from '@/helpers/functions'
import {
    AUTH_STEP_FORGOT,
    AUTH_STEP_PASSWORD,
    AUTH_STEP_SIGNUP,
    AuthContextProvider
} from '../../context'

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
    const [signup] = useSignupMutation()
    const [checkCode] = useCheckCodeMutation()

    const { form, isForgot, setStep, setPrevStep, saveAuthCred } =
        useContext(AuthContextProvider)

    setPrevStep(isForgot ? AUTH_STEP_FORGOT : AUTH_STEP_SIGNUP)

    const verify = async () => {
        if (code.length !== 4) {
            return notify('Заполните код', 'error')
        }

        !isForgot ? await callSignup(code) : await callForgot(code)
    }

    const callSignup = useCallback(
        async (code) => {
            await signup({
                ...form,
                code: code,
                skills: pluck(form.skills, 'name')
            }).then((resp) => {
                if ('error' in resp) return
                const { token, user } = resp.data
                saveAuthCred(user, token)
            })
        },
        [saveAuthCred]
    )

    const callForgot = async (code) => {
        await checkCode({
            email: form.email,
            code: code
        }).then((resp) => {
            if ('error' in resp) return
            setStep(AUTH_STEP_PASSWORD)
        })
    }

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
                    Verify your email
                </Typography>
                <Typography mt="10px" variant="help-text-17" align="center">
                    Enter code from email to
                </Typography>
            </Box>

            <SmsCodeInput onChange={handleChange} />

            <Button
                className={classList.btn}
                onClick={verify}
                fullWidth
                variant="black"
            >
                Verify <Icon name="arrow-right" width={16} height={16} />
            </Button>
        </>
    )
}

export default StepConfirmCode
