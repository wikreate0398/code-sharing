import {Box} from '@mui/material'
import { useFetchColumnsQuery } from '#root/src/redux/api/column.api'
import { notFound, useParams } from "#root/renderer/hooks"
import React, { useEffect } from 'react'
import Task from '#root/src/components/screens/dashboard/project/board/task'
import Kanban from '#root/src/components/screens/dashboard/project/board/kanban'
import { useGetKanbanBoardGqlQuery } from '#root/src/redux/api/board.api.js'
import ContainerLoader from '#root/src/components/ui/loader/container-loader'
import { useDispatch } from 'react-redux'
import { useActions } from '#root/src/helpers/hooks.js'
import { useGetTaskId } from '#root/src/components/screens/dashboard/project/board/task/hooks.jsx'

const Board = () => {
    const taskQueryId = useGetTaskId()
    const { id_board, id_project } = useParams()
    const {data: board, isSuccess: isLoadedBoard, isLoading: isLoadingBoard, isFetching} = useGetKanbanBoardGqlQuery(id_board)

    const dispatch = useDispatch()
    const { setOpenTask } = useActions()

    const { columns, tasks, isLoading: isLoadingKanban, isSuccess: isLoadedKanban, isError, status } = useFetchColumnsQuery(
        parseInt(id_board),
        {
            selectFromResult: ({ data, ...props }) => {

                const columns = []
                const tasks = {}

                data?.forEach((column) => {
                    const kanbanColumnId = `column${column.id}`

                    if (!(kanbanColumnId in tasks)) {
                        tasks[kanbanColumnId] = []
                    }

                    column.tasks.forEach(
                        ({
                            id,
                            name,
                            participants,
                            urgent,
                            estimate_time,
                            comments_count,
                            tags
                        }) => {
                            tasks[kanbanColumnId].push({
                                name,
                                participants,
                                urgent,
                                estimate_time,
                                comments_count,
                                id_board: parseInt(id_board),
                                id_project,
                                id: `item${id}`,
                                uid: id,
                                column_kanban_id: kanbanColumnId,
                                tags
                            })
                        }
                    )

                    const { id, name, position } = column
                    columns.push({
                        id: kanbanColumnId,
                        name,
                        uid: id,
                        id_board: parseInt(id_board),
                        position
                    })
                })

                return {
                    columns,
                    tasks,
                    ...props
                }
            }
        }
    )

    useEffect(() => {
        if (!Boolean(taskQueryId)) dispatch(setOpenTask(false))
    }, [id_board, taskQueryId])

    if (isError) {
        notFound()
        return
    }

    if (isLoadedBoard && board === null) {
        notFound()
        return
    }

    if (isLoadingBoard || isLoadingKanban || isFetching) return <ContainerLoader />

    if (status !== 'fulfilled' || !isLoadedKanban || !isLoadedBoard) return null

    return (
        <Box position="relative" flexGrow={1}>
            <Task />
            <Kanban columns={columns} tasks={tasks} id_board={id_board}/>
        </Box>
    )
}

export default Board
