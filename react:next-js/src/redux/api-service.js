import http from '@/services/rest/rest'
import { createApi, retry } from '@reduxjs/toolkit/dist/query/react'
import { snackActions } from '@/config/snack-actions'
import { handleEnqueueSnackbar, isFnc } from '@/helpers/functions'
import process from 'next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss'

const axiosBaseQuery = retry(
    async ({ url, method, data, params }) => {
        try {
            const result = await http({ url: url, method, data, params })
            return { data: result?.data }
        } catch (error) {
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
    },
    {
        maxRetries: 1
    }
)

export const apiService = createApi({
    baseQuery: axiosBaseQuery,
    keepUnusedDataFor: process.env.APP_ENV === 'local' ? 9999999 : 60, // cache life (sec)
    refetchOnReconnect: true,
    tagTypes: [
        'Project',
        'Projects',
        'GuestProject',
        'Boards',
        'Participant',
        'Column',
        'Task',
        'TaskComment',
        'User',
        'Timer',

        // Cashbox
        'Transactions',
        'Currencies',
        'Wallets',
        'UserTags'
    ],

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
