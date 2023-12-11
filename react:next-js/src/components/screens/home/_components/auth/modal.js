import { useCallback, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { Modal } from '@/components/ui/modal'
import {
    AUTH_STEP_CODE,
    AUTH_STEP_FORGOT,
    AUTH_STEP_PASSWORD,
    AUTH_STEP_SIGNIN,
    AUTH_STEP_SIGNUP,
    AuthContextProvider,
    initialState
} from '../context'
import Icon from '@/components/ui/icon'
import useStyles from './styles'
import StepSignin from './steps/step-signin'
import AuthWrapper from './wrapper'
import StepSignup from './steps/step-signup'
import StepConfirmCode from './steps/step-confirm-code'
import StepForgot from './steps/step-forgot'
import StepChangePassword from './steps/step-password'
import { saveInLocalStorage } from '@/helpers/functions'
import { setCookies } from '@/helpers/cookies'
import { projectsRoute } from '@/config/routes'
import { useRouter } from 'next/navigation'
import { useActions } from '@/helpers/hooks'

const AuthModal = ({ isShow }) => {
    const classList = useStyles()
    const router = useRouter()
    const { setUserAction } = useActions()

    const [form, setForm] = useState(initialState)
    const [step, setStep] = useState(AUTH_STEP_SIGNIN)
    const [isOpen, setIsOpen] = useState(false)
    const [isForgot, setIsForgot] = useState(false)
    const [prevStep, setPrevStep] = useState(null)

    useEffect(() => {
        setIsOpen(isShow)
    }, [isShow])

    useEffect(() => {
        return () => {
            setForm({ ...initialState, skills: [] })
            setStep(AUTH_STEP_SIGNIN)
            setIsForgot(false)
        }
    }, [isOpen])

    const saveAuthCred = (user, token) => {
        saveInLocalStorage('token', token)
        setCookies('token', token)
        setUserAction(user)

        if (user.admin) {
            setCookies('admin', user.admin)
            return router.push('/cp')
        }

        router.push(projectsRoute())
    }

    const toggleModal = useCallback(() => setIsOpen(!isOpen), [isOpen])

    const renderSteps = (step) => {
        switch (step) {
            case AUTH_STEP_SIGNIN:
                return <StepSignin />
            case AUTH_STEP_SIGNUP:
                return <StepSignup />
            case AUTH_STEP_CODE:
                return <StepConfirmCode />
            case AUTH_STEP_FORGOT:
                return <StepForgot />
            case AUTH_STEP_PASSWORD:
                return <StepChangePassword />
        }
    }

    return (
        <AuthContextProvider.Provider
            value={{
                form,
                prevStep,
                setPrevStep,
                step,
                setForm,
                setStep,
                isForgot,
                setIsForgot,
                saveAuthCred
            }}
        >
            <Box className={classList.link} onClick={toggleModal}>
                Войти
                <Icon name="arrow-right" width={16} height={16} />
            </Box>

            <Modal
                width={500}
                open={isOpen}
                hideCloseIcon
                onClose={toggleModal}
            >
                <AuthWrapper onClose={toggleModal}>
                    {renderSteps(step)}
                </AuthWrapper>
            </Modal>
        </AuthContextProvider.Provider>
    )
}

export default AuthModal
