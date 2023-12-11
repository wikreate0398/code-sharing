'use client'

import { Box } from '@mui/material'
import { MultipleContainers } from '@/components/screens/dashboard/project/board/kanban'
import { useFetchColumnsQuery } from '@/redux/api/column.api'
import { notFound, useParams } from 'next/navigation'
import { sortBy } from '@/helpers/functions'
import React from 'react'
import Loader from '@/components/ui/loader'
import Task from '@/components/screens/dashboard/project/board/task'

const Board = () => {
    const { id_board } = useParams()

    const { columns, tasks, isLoading, isError, status } = useFetchColumnsQuery(
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

                    column.tasks.forEach(({ id, name, participants }) => {
                        tasks[kanbanColumnId].push({
                            name,
                            participants,
                            id: `item${id}`,
                            uid: id,
                            column_kanban_id: kanbanColumnId
                        })
                    })

                    const { id, name, position } = column
                    columns.push({
                        id: kanbanColumnId,
                        name,
                        uid: id,
                        position
                    })
                })

                return {
                    columns: sortBy(columns, 'position'),
                    tasks,
                    ...props
                }
            }
        }
    )

    if (isError) notFound()
    if (status !== 'fulfilled' || isLoading) return null

    return (
        <Box position="relative" flexGrow={1}>
            <Task />
            <MultipleContainers
                containers={columns}
                items={tasks}
                id_board={id_board}
            />
        </Box>
    )
}

export default Board
