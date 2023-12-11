import { apiUrl, isClient } from '@/helpers/functions'
import { getLocalStorage } from '@/helpers/functions'
import axios from 'axios'
import { notFound, useRouter } from 'next/navigation'

const http = axios.create({
    baseURL: process.env.API_URL
})

http.defaults.headers.common['Content-Type'] = 'application/json'
http.defaults.headers.common['Content-Type'] = 'multipart/form-data'
http.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

http.interceptors.request.use(
    (config) => {
        const token = getLocalStorage('token')

        if (config.headers && token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

async function postRequest(url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
        return http.post(apiUrl(url), data, config).then((result) => {
            if (result?.response) {
                reject(result?.response)
            }
            resolve(result?.data)
        })
    })
}

async function getRequest(url, params = {}) {
    return new Promise((resolve, reject) => {
        return http
            .get(apiUrl(url), { params, responseType: 'json' })
            .then((result) => {
                if (result?.response) {
                    reject(result?.response)
                }
                resolve(result?.data)
            })
    })
}

const handleCatch = (response, reject, push) => {
    if (response.status === 401 && !response.config.url.includes('logout')) {
        push('/auth/logout')
    } else if (response.status === 404) {
        notFound()
    }
    reject(response)
}

export const useGetRequest = () => {
    const router = useRouter()

    return (url, params = {}) =>
        new Promise((resolve, reject) => {
            getRequest(url, params)
                .then(resolve)
                .catch((response) => handleCatch(response, reject, router.push))
        })
}

export const usePostRequest = () => {
    const router = useRouter()

    return (url, params = {}, config = {}) =>
        new Promise((resolve, reject) => {
            postRequest(url, params, config)
                .then(resolve)
                .catch((response) => handleCatch(response, reject, router.push))
        })
}

export default http
