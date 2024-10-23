import http from '#root/src/services/rest/rest'
import {createApi, retry} from "@reduxjs/toolkit/query/react";
import { snackActions } from '#root/src/config/snack-actions.jsx'
import {
    getLocalStorage,
    handleEnqueueSnackbar,
    isFnc,
    trimRight
} from '#root/src/helpers/functions'
import { ClientError, GraphQLClient } from 'graphql-request'

const handlerError = (url, error) => {
    const httpStatus = error?.response?.status
    const props = error?.response?.data

    if (httpStatus === 400) {
        if (props.message) {
            handleEnqueueSnackbar(
                snackActions.notify,
                props.message,
                props.status
            )
        }
    }

    if (httpStatus === 401 && !url.includes('logout')) {
        window.location.href = '/auth/logout'
        return
    }

    if (httpStatus === 500) {
        alert('Server Error.. Try again')
    }

    const result = { data: props, status: httpStatus }

    if ([401, 500, 400, 422].includes(httpStatus)) {
        retry.fail(result)
    }

    return { error: result }
}

const axiosBaseQuery = async ({ url, method, data, params }) => {
    try {
        const result = await http({ url: url, method, data, params })
        return { data: result?.data }
    } catch (error) {
        return handlerError(url, error)
    }
}

const wait = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms)
    })
}

const dynamicBaseQuery = retry(
    async (params) => {
        if (params?.transition) {
            await wait(params.transition)
        }

        if (params?.body) {
            try {
                const { variables, body } = params

                const headers = {}
                const token = getLocalStorage('token')
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`
                }

                headers['X-Socket-ID'] = window.Echo.socketId()

                const graphQLClient = new GraphQLClient(
                    `${trimRight(import.meta.env.VITE_API_BASE, '/')}/gql`,
                    {
                        headers
                    }
                )

                const result = await graphQLClient.request(body, variables)
                return { data: result }
            } catch (error) {
                if (error instanceof ClientError) {
                    return {
                        error: { status: error.response.status, data: error }
                    }
                }
                return { error: { status: 500, data: error } }
            }
        }
        return axiosBaseQuery(params)
    },
    {
        maxRetries: 1
    }
)

export const rtkQueryTags =  [
    'Project',
    'Projects',
    'UserProjects',

    'GuestProject',
    'ProjectParticipants',
    'Participant',

    'KanbanBoards',
    'Boards',
    'FormBoards',
    'Board',
    'Column',
    'Task',
    'TaskComment',
    'TaskTags',
    'User',
    'Timer',

    // Cashbox
    'Transactions',
    'Currencies',
    'Wallets',
    'UserTags'
]

export const apiService = createApi({
    baseQuery: dynamicBaseQuery,
    keepUnusedDataFor: import.meta.env.VITE_APP_ENV === 'local' ? 9999999 : 60, // cache life (sec)
    refetchOnReconnect: true,
    tagTypes: rtkQueryTags,

    //refetchOnFocus: true,
    endpoints: () => ({})
})

// then handler
export const requestHandler = ({
    result,
    onFinishRequest = null,
    on200Http = null,
    on422Error = null,
    onError = null,
    timeout = 400
}) => {
    const { data, error } = result

    setTimeout(() => {
        if (isFnc(onFinishRequest)) onFinishRequest(result)

        if (error) {
            if (error.status === 422) {
                if (isFnc(on422Error)) on422Error(error.data.errors)
            } else {
                if (isFnc(onError)) onError(error.data.errors)
            }
            return
        }

        if (isFnc(on200Http)) on200Http(data)
    }, timeout)
}

const { usePrefetch } = apiService

export { usePrefetch }
