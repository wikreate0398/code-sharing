import { createContext } from 'react'

export const AUTH_STEP_SIGNIN = 1
export const AUTH_STEP_SIGNUP = 2
export const AUTH_STEP_CODE = 3
export const AUTH_STEP_FORGOT = 4
export const AUTH_STEP_PASSWORD = 5

export const initialState = {
    email: null,
    login: null,
    avatar: null,
    password: null,
    skills: []
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
    saveAuthCred: () => {}
})
