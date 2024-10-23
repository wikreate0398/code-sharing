import { createContext } from 'react'
import { tz } from '#root/src/helpers/functions'

export const AUTH_STEP_SIGNIN = 1
export const AUTH_STEP_CODE = 2
export const AUTH_STEP_SIGNUP = 3
export const AUTH_STEP_FORGOT = 4
export const AUTH_STEP_PASSWORD = 5

export const initialState = {
    email: null,
    name: null,
    login: null,
    avatar: null,
    password: null,
    skills: [],
    code: null,
    social_token: null,
    network_provider: null,
    tz: tz()
}

export const AuthContextProvider = createContext({
    form: { ...initialState },
    step: AUTH_STEP_SIGNIN,
    prevStep: null,
    isForgot: false,
    setStep: () => {},
    setPrevStep: () => {},
    setForm: () => {},
    setIsForgot: () => {},
    saveAuthCred: (user, token) => {},
    resetForm: () => {}
})
