import Cookies from 'js-cookie'

export const setCookies = (name, value) => {
    return Cookies.set(name, value)
}

export const removeCookies = (name) => {
    return Cookies.remove(name)
}

export const getCookies = (name) => {
    return Cookies.get(name)
}
