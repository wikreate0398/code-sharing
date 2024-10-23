import { useCallback } from 'react'
import { useParams} from "#root/renderer/hooks";
import { useCreateTaskMutation } from '#root/src/redux/api/task/task.api'

export const useCreateTask = (id_column) => {
    const { id_board } = useParams()
    const [createTask, state] = useCreateTaskMutation()
    const loading = state?.isLoading

    const onCreate = useCallback(
        (name: string) => {
            createTask({ name, id_column, id_board })
        },
        [id_board, id_column]
    )

    return {
        onCreate,
        loading
    }
}