import { apiService } from '@/redux/api-service'
import { updateArray } from '@/helpers/functions'
import websocket from '@/config/laravel-echo'
import {
    createTaskInCache,
    deleteTaskFromCache,
    moveTasksInCache,
    updateTaskInCache
} from '@/redux/api/task.api'

export const kanbanColumnService = apiService.injectEndpoints({
    endpoints: (build) => ({
        fetchColumns: build.query({
            query: (id_board) => ({
                url: `kanban/columns/fetch-columns/${id_board}`,
                method: 'get'
            }),
            providesTags: ['Column'],
            async onCacheEntryAdded(
                id_board,
                {
                    dispatch,
                    cacheDataLoaded,
                    cacheEntryRemoved,
                    updateCachedData
                }
            ) {
                websocket()
                    .channel(`tasks.${id_board}`)
                    .listen('.create', (data) => {
                        createTaskInCache(id_board, data, dispatch)
                    })
                    .listen('.update', (data) => {
                        updateTaskInCache(data, dispatch)
                    })
                    .listen('.delete', (data) => {
                        deleteTaskFromCache(id_board, data.id, dispatch)
                    })
                    .listen('.move', (data) => {
                        moveTasksInCache(id_board, data, dispatch)
                    })

                websocket()
                    .channel(`columns.${id_board}`)
                    .listen('.create', (data) => {
                        createColumnInCache(data, id_board, dispatch)
                    })
                    .listen('.update', (data) => {
                        updateColumnInCache(data, id_board, dispatch)
                    })
                    .listen('.delete', (data) => {
                        deleteColumnInCache(data.id, id_board, dispatch)
                    })
                    .listen('.move', (data) => {
                        moveColumnsInCache(data, id_board, dispatch)
                    })
            }
        }),

        createColumn: build.mutation({
            query: (data) => ({
                url: `kanban/columns/create`,
                method: 'POST',
                data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data: resp } = await queryFulfilled
                    createColumnInCache(resp.column, args.id_board, dispatch)
                } catch (e) {}
            }
        }),

        updateColumn: build.mutation({
            query: (data) => ({
                url: `kanban/columns/update`,
                method: 'POST',
                data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data: resp } = await queryFulfilled
                    const { column } = resp
                    updateColumnInCache(column, args.id_board, dispatch)
                } catch (e) {}
            }
        }),

        moveColumns: build.mutation({
            query: (data) => ({
                url: `kanban/columns/move`,
                method: 'POST',
                data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                const patchRes = moveColumnsInCache(
                    args.ids,
                    args.id_board,
                    dispatch
                )
                try {
                    await queryFulfilled
                } catch {
                    patchRes.undo()
                }
            }
        }),

        deleteColumn: build.mutation({
            query: (data) => ({
                url: `kanban/columns/delete`,
                method: 'POST',
                data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                const patchRes = deleteColumnInCache(
                    args.id,
                    args.id_board,
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

const createColumnInCache = (column, id_board, dispatch) => {
    dispatch(
        apiService.util.updateQueryData(
            'fetchColumns',
            parseInt(id_board),
            (immer) => {
                immer?.push({ ...column, tasks: [] })
                return immer
            }
        )
    )
}

const updateColumnInCache = (column, id_board, dispatch) => {
    dispatch(
        apiService.util.updateQueryData(
            'fetchColumns',
            parseInt(id_board),
            (immer) => {
                return updateArray(immer, {
                    where: { id: parseInt(column.id) },
                    update: column
                })
            }
        )
    )
}

const moveColumnsInCache = (ids, id_board, dispatch) => {
    return dispatch(
        apiService.util.updateQueryData(
            'fetchColumns',
            parseInt(id_board),
            (immer) => {
                const data = {}
                ids.forEach((id, index) => {
                    data[id] = index + 1
                })

                return immer.map((column) => ({
                    ...column,
                    position: data[column.id]
                }))
            }
        )
    )
}

const deleteColumnInCache = (id, id_board, dispatch) => {
    return dispatch(
        apiService.util.updateQueryData(
            'fetchColumns',
            parseInt(id_board),
            (immer) => {
                return immer.filter((column) => column.id !== parseInt(id))
            }
        )
    )
}

export const {
    useFetchColumnsQuery,
    useCreateColumnMutation,
    useUpdateColumnMutation,
    useMoveColumnsMutation,
    useDeleteColumnMutation
} = kanbanColumnService
