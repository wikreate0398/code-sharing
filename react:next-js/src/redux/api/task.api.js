import { apiService } from '@/redux/api-service'
import { pluck } from '@/helpers/functions'
import websocket from '@/config/laravel-echo'
import { addTaskCommentInCache } from '@/redux/api/task.comment.api'
import { bindActionCreators } from '@reduxjs/toolkit'
import actions from '@/redux/actions'
import {
    createChecklistInCache,
    deleteChecklistFromCache,
    updateChecklistInCache,
    moveChecklistInCache
} from '@/redux/api/task.checklist.api'
import { arrayMove } from '@dnd-kit/sortable'

export const taskService = apiService.injectEndpoints({
    endpoints: (build) => ({
        getTask: build.query({
            query: (id) => ({
                url: `kanban/tasks/fetch-task/${id}`,
                method: 'get'
            }),
            providesTags: ['Task'],
            async onCacheEntryAdded(id, { dispatch }) {
                websocket()
                    .channel(`task.${id}`)
                    .listen('.comment', (data) => {
                        addTaskCommentInCache(data, id, dispatch)
                    })
                    .listen('.create-list', (data) => {
                        createChecklistInCache(data, id, dispatch)
                    })
                    .listen('.update-list', (data) => {
                        updateChecklistInCache(data, id, dispatch)
                    })
                    .listen('.delete-list', (data) => {
                        deleteChecklistFromCache(data.id, id, dispatch)
                    })
                    .listen('.move-list', (data) => {
                        moveChecklistInCache(data.from, data.to, id, dispatch)
                    })
            }
        }),

        createTask: build.mutation({
            query: (data) => ({
                url: `kanban/tasks/create`,
                method: 'POST',
                data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                const { data: resp } = await queryFulfilled
                createTaskInCache(args.id_board, resp.task, dispatch)
            }
        }),

        deleteTask: build.mutation({
            query: (data) => ({
                url: `kanban/tasks/delete`,
                method: 'POST',
                data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                const patchRes = deleteTaskFromCache(
                    args.id_board,
                    args.id,
                    dispatch
                )
                try {
                    await queryFulfilled
                } catch {
                    patchRes.undo()
                }
            }
        }),

        updateTask: build.mutation({
            query: (data) => ({
                url: `kanban/tasks/update`,
                method: 'POST',
                data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                const { data: resp } = await queryFulfilled
                updateTaskInCache(resp.task, dispatch)
            }
        }),

        moveTasks: build.mutation({
            query: (data) => ({
                url: `kanban/tasks/move`,
                method: 'POST',
                data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                const patchRes = moveTasksInCache(
                    args.id_board,
                    args.data,
                    dispatch
                )

                try {
                    await queryFulfilled
                } catch {
                    patchRes.undo()
                }
            }
        })
    }),
    overrideExisting: true
})

export const deleteTaskFromCache = (id_board, id_task, dispatch) => {
    const { setOpenTask } = bindActionCreators(actions, dispatch)
    dispatch(setOpenTask(false))

    return dispatch(
        apiService.util.updateQueryData(
            'fetchColumns',
            parseInt(id_board),
            (immer) => {
                return immer.map((column) => ({
                    ...column,
                    tasks: column.tasks.filter(
                        (v) => v.id !== parseInt(id_task)
                    )
                }))
            }
        )
    )
}

export const moveTasksInCache = (id_board, payload, dispatch) => {
    return dispatch(
        apiService.util.updateQueryData(
            'fetchColumns',
            parseInt(id_board),
            (immer) => {
                const tasks = []
                const columns = []
                immer.forEach((column) => {
                    tasks.push(...column.tasks)
                    columns.push({ ...column, tasks: [] })
                })

                const payloadTask = parseInt(payload.id)
                const payloadColumn = parseInt(payload.id_column)
                const payloadPosition = parseInt(payload.position)

                const prevTask = tasks.find((v) => v.id === payloadTask)

                if (prevTask.pivot.id_column === payloadColumn) {
                    return immer.map((column) => {
                        let updatedTasks = column.tasks
                        if (column.id === payloadColumn) {
                            updatedTasks = arrayMove(
                                column.tasks,
                                prevTask.pivot.position - 1,
                                payloadPosition - 1
                            ).map((task, k) => ({
                                ...task,
                                pivot: { ...task.pivot, position: k + 1 }
                            }))
                        }

                        return {
                            ...column,
                            tasks: updatedTasks
                        }
                    })
                }

                return immer.map((column) => {
                    let updatedTasks = column.tasks
                    if (column.id === prevTask.pivot.id_column) {
                        updatedTasks = column.tasks
                            .filter((task) => task.id !== payloadTask)
                            .map((task, k) => ({
                                ...task,
                                pivot: { ...task.pivot, position: k + 1 }
                            }))
                    } else if (column.id === payloadColumn) {
                        updatedTasks = [
                            ...column.tasks.slice(0, payloadPosition - 1),
                            {
                                ...prevTask,
                                pivot: {
                                    ...prevTask.pivot,
                                    position: payloadPosition,
                                    id_column: payloadColumn
                                }
                            },
                            ...column.tasks.slice(payloadPosition - 1)
                        ].map((task, k) => ({
                            ...task,
                            pivot: { ...task.pivot, position: k + 1 }
                        }))
                    }

                    return {
                        ...column,
                        tasks: updatedTasks
                    }
                })
            }
        )
    )
}

export const createTaskInCache = (id_board, payload, dispatch) => {
    dispatch(
        apiService.util.updateQueryData(
            'fetchColumns',
            parseInt(id_board),
            (immer) => {
                const idsColumns = pluck(payload.columns_relations, 'id_column')
                const columnRelation = payload.columns_relations.find(
                    (v) => v.id_board === parseInt(id_board)
                )
                console.log(
                    payload,
                    parseInt(id_board),
                    columnRelation,
                    idsColumns,
                    idsColumns.includes(225)
                )
                return immer.map((column) => ({
                    ...column,
                    tasks: idsColumns.includes(column.id)
                        ? [
                              ...column.tasks,
                              { ...payload, pivot: columnRelation }
                          ]
                        : column.tasks
                }))
            }
        )
    )
}

export const updateTaskInCache = (payload, dispatch) => {
    const idsColumns = pluck(payload.columns_relations, 'id_column')
    const idsBoards = pluck(payload.columns_relations, 'id_board')

    const { id, name, participants, columns_relations } = payload
    const newTask = { id, name, participants, columns_relations }

    idsBoards.map((id_board) => {
        const pivot = columns_relations.find(
            (v) => v.id_board === parseInt(id_board)
        )

        dispatch(
            apiService.util.updateQueryData(
                'fetchColumns',
                parseInt(id_board),
                (immer) => {
                    return immer.map((column) => {
                        const index = column.tasks.findIndex(
                            (v) => v.id === parseInt(newTask.id)
                        )

                        return {
                            ...column,
                            tasks:
                                index !== -1
                                    ? [
                                          ...column.tasks.slice(0, index),
                                          { ...newTask, pivot },
                                          ...column.tasks.slice(index + 1)
                                      ]
                                    : idsColumns.includes(column.id)
                                      ? [...column.tasks, { ...newTask, pivot }]
                                      : column.tasks
                        }
                    })
                }
            )
        )
    })

    dispatch(
        apiService.util.updateQueryData('getTask', payload.id, (immer) => {
            return { ...immer, ...payload }
        })
    )
}

export const {
    useLazyGetTaskQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useMoveTasksMutation
} = taskService
