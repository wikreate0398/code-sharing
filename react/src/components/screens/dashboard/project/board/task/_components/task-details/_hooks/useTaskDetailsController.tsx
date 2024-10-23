import { useMemo, useCallback } from 'react'
import { pluck } from '#root/src/helpers/functions'
import { useParams } from '#root/renderer/hooks'
import {
    useGetTaskId,
    useUpdateTask
} from '#root/src/components/screens/dashboard/project/board/task/hooks'
import { useGetBoardParticipantsQuery } from '#root/src/redux/api/participant.api'
import { useFetchBoardsForTaskQuery } from '#root/src/redux/api/board.api'
import { useGetTaskQueryState } from '#root/src/redux/api/task/task.api'
import {
    useAttachTaskTagMutation,
    useCreateTaskTagMutation, useMoveTaskTagMutation,
} from '#root/src/redux/api/task/task.tags.api'
import { useProjectContext } from '#root/src/providers/project-provider'

const useTaskDetailsController = () => {
    const { id_board, id_project } = useParams()
    const updateTask = useUpdateTask()
    const idTask = useGetTaskId()

    const { data: allParticipants, isLoading: isLoadingParticipants } =
        useGetBoardParticipantsQuery(id_board, {
            refetchOnMountOrArgChange: true
        })
    const { data: allBoards, isLoading: isLoadingBoards } =
        useFetchBoardsForTaskQuery(id_project, {
            refetchOnMountOrArgChange: true
        })

    const { data: taskInfo } = useGetTaskQueryState(idTask)
    const [createTaskTag] = useCreateTaskTagMutation()
    const [attachTaskTag] = useAttachTaskTagMutation()
    const [moveTag] = useMoveTaskTagMutation()

    const { project } = useProjectContext()
    const { taskTags: allTags } = project || {}
    const { id, columns_relations = [], tags = [] } = taskInfo || {}

    const participantsList =
        allParticipants?.map(({ name, avatar, id, login }) => ({
            id: String(id),
            name: name || login,
            avatar // must a value to display avatar component
        })) || []

    const savedColumns = pluck(columns_relations, 'id_column')
    const currentColumn = columns_relations?.find(
        (i) => i.id_board === Number(id_board)
    ) || {}
    let currentColId = Number(currentColumn?.id_column)

    const columnsList = useMemo(() => {
        return allBoards?.reduce((acc, board) => {
                let { columns, id: boardId, name: board_name } = board
                let isSameBoard = Number(boardId) === Number(id_board)

                let col =
                    columns
                        .filter(
                            (i) =>
                                (isSameBoard && Number(i.id) === Number(currentColId)) ||
                                !isSameBoard
                        )
                        .map(({ id: id_column, name: column_name }) => {
                            return {
                                id: id_column,
                                id_board: boardId,
                                name: board_name + ': ' + column_name,
                                color: '#E41805',
                                color_selected: '#006AFF',
                                persistent: Number(id_column) === Number(currentColId)
                            }
                        }) || []

                return [...acc, ...col]
            }, [])
    }, [currentColId, allBoards, id_board, columns_relations])

    const handleCreateTag = useCallback((name, e) => {
        e.stopPropagation() // to not close menu on delete of tag

        createTaskTag({ id_task: Number(id), name, color: '#E41805' })
    }, [id])

    const onDragEndTags = useCallback(
        ({ from, to }) => {
            const position = allTags.findIndex(
                ({ id }) => parseInt(id) === parseInt(to)
            )

            moveTag({
                id_project,
                from,
                to
            })
        }, [id_project, allTags])

    const selectedTagsIds = pluck(tags, 'id')?.map(String)

    const handleAddTag = useCallback((ids, reason) => {
        const isAdd = reason === 'selectOption'
        const id_tag = isAdd
            ? ids.find(i => !selectedTagsIds.includes(i))
            : selectedTagsIds.find(i => !ids.includes(i))

        attachTaskTag({ id_tag: Number(id_tag), id_task: Number(id), reason, id_project })
    }, [selectedTagsIds, id])

    return {
        updateTask,
        participantsList,
        savedColumns,
        columns_relations,
        columnsList,

        handleCreateTag,
        onDragEndTags,
        selectedTagsIds,
        handleAddTag,
        allTags
    }
}

export default useTaskDetailsController
