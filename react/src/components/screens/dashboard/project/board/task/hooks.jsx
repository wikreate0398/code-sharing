import {useDispatch} from 'react-redux'
import { useActions } from '#root/src/helpers/hooks'
import {
    useLazyGetTaskQuery,
    useUpdateTaskMutation
} from '#root/src/redux/api/task/task.api.js'
import { useCallback, useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from "#root/renderer/hooks"

export const useFetchTaskInfo = () => {
    const dispatch = useDispatch()
    const { setOpenTask } = useActions()
    const [trigger, result] = useLazyGetTaskQuery({
        refetchOnMountOrArgChange: true
    })

    const idTask = useGetTaskId()

    useEffect(() => {
        if (idTask) {
            dispatch(setOpenTask(true))
            trigger(idTask)
        }
    }, [idTask])

    const isFulfilled = result?.status === 'fulfilled'

    const isError = result?.isError

    return { result, isFulfilled, isError }
}

export const useGetTaskId = () => {
    const query = useSearchParams()
    return useMemo(() => parseInt(query.get('t')), [query])
}

export const useUpdateTask = () => {
    const [updateTask] = useUpdateTaskMutation()
    const { id_board, id_column } = useParams()

    return useCallback(
        (values) => {
            updateTask({ id_column, id_board, ...values })
        },
        [id_column, id_board]
    )
}
