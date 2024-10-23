
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from "#root/renderer/hooks"
import { removeCookies } from '#root/src/helpers/cookies'
import {
    handleEnqueueSnackbar,
    removeLocalStorageKey
} from '#root/src/helpers/functions'
import { useGetRequest } from '#root/src/services/rest/rest'
import { apiService } from '#root/src/redux/api-service'
import { useGetUserQuery } from '#root/src/redux/api/user.api'
import { bindActionCreators } from '@reduxjs/toolkit'
import actions from '#root/src/redux/actions'
import { selectOnlineStatuses } from '#root/src/redux/slices/meta.slice'
import { useRollbarPerson } from '@rollbar/react'

export const useActions = () => {
    const dispatch = useDispatch()
    return bindActionCreators(actions, dispatch)
}

export const useIsOnline = () => {
    const onlineStatus = useSelector(selectOnlineStatuses)
    return useCallback(
        (id) => Boolean(onlineStatus?.[id]?.id_working_project),
        [onlineStatus]
    )
}

export const useNotify = () => {
    const { enqueueSnackbar } = useSnackbar()

    return (message, status = 'success', options = {}) => {
        handleEnqueueSnackbar(enqueueSnackbar, message, status, options)
    }
}

export function useUser(redirectTo = false, redirectIfFound = false) {
    const { data: user, isError, error } = useGetUserQuery(undefined)

    useRollbarPerson(user);

    const { push } = useRouter()

    useEffect(() => {
        if (isError && error?.status === 401 && redirectTo) {
            push(redirectTo)
            return
        }

        if (!redirectTo || !user) return

        if (
            (redirectTo && !redirectIfFound && (!user || isError)) ||
            (redirectIfFound && user)
        ) {
            push(redirectTo)
        }
    }, [user, redirectIfFound, redirectTo, isError])

    return user
}

export const useClienSideLogout = () => {
    const { logoutAction } = useActions()
    const dispatch = useDispatch()

    return () => {
        dispatch(apiService.util.resetApiState())
        logoutAction()
        removeCookies('token')
        removeCookies('admin')
        removeLocalStorageKey('token')
    }
}

export const useFetch = (
    route,
    params,
    config = { dispatch: false, once: false }
) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const getRequest = useGetRequest()
    const actions = useActions()

    const fetchRequest = useCallback(() => {
        return new Promise((resolve) => {
            setLoading(true)
            getRequest(route, params).then((result) => {
                if (config.dispatch) {
                    dispatch(actions[config.dispatch](result))
                } else {
                    setData(result)
                    resolve(result)
                }
                setLoading(false)
            })
        })
    }, [getRequest, setLoading, actions, config, params])

    useEffect(() => {
        fetchRequest()
    }, [])

    return { data, loading, setData }
}
