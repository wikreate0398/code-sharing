import { apiService } from '#root/src/redux/api-service.js'
import { pluck } from '#root/src/helpers/functions.js'
import websocket from '#root/src/config/laravel-echo.js'
import { handleTaskCommentInCache } from '#root/src/redux/api/task/task.comment.api.js'
import { metaActions } from '#root/src/redux/slices/meta.slice.js'
import {
    createChecklistInCache,
    deleteChecklistFromCache,
    updateChecklistInCache,
    moveChecklistInCache,
    updateChecklistGroupInCache
} from '#root/src/redux/api/task/task.checklist.api.js'
import { arrayMove } from '@dnd-kit/sortable'
import {
    CREATE_TASK_MUTATION,
    UPDATE_TASK_MUTATION
} from '#root/src/graphql/mutations/task-mutation.js'
import { GET_TASK } from '#root/src/graphql/queries/task-query.js'

export const taskService = apiService.injectEndpoints({
    endpoints: (build) => ({
        getTask: build.query({
            query: (id) => ({
                body: GET_TASK,
                variables: { id }
            }),
            transformResponse(baseQueryReturnValue, meta, arg) {
                return baseQueryReturnValue.task
            },
            providesTags: ['Task'],
            async onCacheEntryAdded(id_task, { dispatch }) {
                websocket()
                    .channel(`task.${id_task}`)
                    .listen('.refresh-activity', () => {
                        invalidateTaskActivity(dispatch, id_task)
                    })
                    .listen('.create_comment', (data) => {
                        handleTaskCommentInCache(data, dispatch, 'CREATE')
                    })
                    .listen('.update_comment', (data) => {
                        handleTaskCommentInCache(data, dispatch, 'UPDATE')
                    })
                    .listen('.delete_comment', (data) => {
                        handleTaskCommentInCache(data, dispatch, 'DEL')
                    })
                    .listen('.create-list', (data) => {
                        createChecklistInCache(data, dispatch)
                    })
                    .listen('.update-list', (data) => {
                        updateChecklistInCache(data, dispatch)
                    })
                    .listen('.delete-list', (data) => {
                        deleteChecklistFromCache(
                            data.id,
                            id_task,
                            data.id_group,
                            dispatch
                        )
                    })
                    .listen('.move-list', (data) => {
                        moveChecklistInCache(
                            data.from,
                            data.to,
                            id_task,
                            data.id_group,
                            dispatch
                        )
                    })
                    .listen('.create-group-list', (data) => {
                        updateChecklistGroupInCache(data, id_task, dispatch, 'add')
                    })
                    .listen('.update-group-list', (data) => {
                        updateChecklistGroupInCache(
                            data,
                            id_task,
                            dispatch,
                            'update'
                        )
                    })
                    .listen('.delete-group-list', (data) => {
                        updateChecklistGroupInCache(
                            { id: data.id },
                            id_task,
                            dispatch,
                            'delete'
                        )
                    })
            }
        }),

        createTask: build.mutation({
            query: (data) => ({
                body: CREATE_TASK_MUTATION,
                variables: data,
                data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                const { data: resp } = await queryFulfilled

                createTaskInCache(args.id_board, resp.createTask, dispatch)
            }
        }),

        deleteTask: build.mutation({
            query: (data) => ({
                url: `kanban/tasks/delete`,
                method: 'POST',
                data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled, getState }) {
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
            query: ({ id_board, id_column, ...data }) => ({
                body: UPDATE_TASK_MUTATION,
                variables: { input: data }
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                const { data: resp } = await queryFulfilled
                updateTaskInCache(resp.updateTask, dispatch)
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

export const moveTasksInCache = (id_board, payload, dispatch) => {
    return dispatch(
        apiService.util.updateQueryData(
            'fetchColumns',
            parseInt(id_board),
            (immer) => {
                const payloadTask = parseInt(payload.id)
                const payloadColumn = parseInt(payload.id_column)
                const payloadPosition = parseInt(payload.position)

                let prevTaskIndex = -1
                let prevTask = null
                immer.forEach((column) => {
                    if (prevTaskIndex === -1) {
                        prevTaskIndex = column.tasks.findIndex(
                            (v) => parseInt(v.id) === payloadTask
                        )
                        prevTask = column.tasks[prevTaskIndex]
                    }
                })

                if (prevTask?.pivot?.id_column === payloadColumn) {
                    // move task inside one columns
                    const column = immer.find(
                        (c) => parseInt(c.id) === payloadColumn
                    )

                    if (column) {
                        column.tasks = arrayMove(
                            column.tasks,
                            prevTaskIndex,
                            payloadPosition - 1
                        ).map((task, k) => ({
                            ...task,
                            pivot: { ...task.pivot, position: k + 1 }
                        }))
                    }

                    return immer
                }

                // Move task from one columns to another
                const prevColumn = immer.find(
                    (v) => parseInt(v.id) === prevTask.pivot.id_column
                )

                const newColumn = immer.find(
                    (v) => parseInt(v.id) === payloadColumn
                )

                prevColumn.tasks = prevColumn.tasks
                    .filter((task) => parseInt(task.id) !== payloadTask)
                    .map((task, k) => ({
                        ...task,
                        pivot: { ...task.pivot, position: k + 1 }
                    }))

                prevTask.pivot = {
                    ...prevTask.pivot,
                    position: payloadPosition,
                    id_column: payloadColumn
                }

                newColumn.tasks
                    .splice(payloadPosition - 1, 0, prevTask)
                    .map((task, k) => {
                        task.pivot.position = k + 1
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
                    (v) => parseInt(v.id_board) === parseInt(id_board)
                )

                const column = immer.find((column) =>
                    idsColumns.includes(parseInt(column.id))
                )

                if (column) {
                    column.tasks.push({ ...payload, pivot: columnRelation })
                }

                return immer
            }
        )
    )
}

export const updateTaskInCache = (payload, dispatch) => {
    const idsColumns = pluck(payload.columns_relations, 'id_column')
    const idsBoards = pluck(payload.columns_relations, 'id_board')

    const {
        id,
        name,
        participants,
        columns_relations,
        urgent,
        estimate_time,
        comments_count,
        tags
    } = payload

    const newTask = {
        id,
        name,
        participants,
        urgent,
        estimate_time,
        comments_count,
        columns_relations,
        tags
    }

    idsBoards.map((id_board) => {
        const pivot = columns_relations.find(
            (v) => parseInt(v.id_board) === parseInt(id_board)
        )

        dispatch(
            apiService.util.updateQueryData(
                'fetchColumns',
                parseInt(id_board),
                (immer) => {
                    return immer.map((column) => {
                        const index = column.tasks.findIndex(
                            (v) => parseInt(v.id) === parseInt(newTask.id)
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
                                    : idsColumns.includes(parseInt(column.id))
                                      ? [...column.tasks, { ...newTask, pivot }]
                                      : column.tasks
                        }
                    })
                }
            )
        )
    })

    dispatch(
        apiService.util.updateQueryData(
            'getTask',
            parseInt(payload.id),
            (immer) => {
                return { ...immer, ...payload }
            }
        )
    )
}

export const deleteTaskFromCache = (id_board, id_task, dispatch) => {
    dispatch(metaActions.setOpenTask(false))

    return dispatch(
        apiService.util.updateQueryData(
            'fetchColumns',
            parseInt(id_board),
            (immer) => {
                return immer.map((column) => ({
                    ...column,
                    tasks: column.tasks.filter(
                        (v) => parseInt(v.id) !== parseInt(id_task)
                    )
                }))
            }
        )
    )
}

export const invalidateTaskActivity = (dispatch, id_task) => {
    dispatch(
        apiService.util.invalidateTags([{type: 'TaskActivity', id: id_task}])
    )
}

export const useGetTaskQueryState = taskService.endpoints.getTask.useQueryState

export const {
    useLazyGetTaskQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useMoveTasksMutation
} = taskService
