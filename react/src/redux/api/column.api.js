import { apiService } from '#root/src/redux/api-service'
import websocket from '#root/src/config/laravel-echo'
import {
    createTaskInCache,
    deleteTaskFromCache,
    moveTasksInCache,
    updateTaskInCache
} from '#root/src/redux/api/task/task.api.js'
import {
    CREATE_BOARD_COLUMN,
    DELETE_BOARD_COLUMN,
    UPDATE_BOARD_COLUMN_MUTATION,
    CREATE_COLUMN_RESPONSIBLE,
    DELETE_COLUMN_RESPONSIBLE
} from '#root/src/graphql/mutations/column-mutation'
import { GET_COLUMNS } from '#root/src/graphql/queries/column-query'
import {reorder} from '#root/src/helpers/functions.js'

export const kanbanColumnService = apiService.injectEndpoints({
    endpoints: (build) => ({
        fetchColumns: build.query({
            query: (id_board) => ({
                body: GET_COLUMNS,
                variables: { id_board }
            }),
            providesTags: ['Column'],
            transformResponse(baseQueryReturnValue, meta, arg) {
                return baseQueryReturnValue?.columns ?? []
            },
            async onCacheEntryAdded(id_board, { dispatch }) {
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
                    .listen('.move', ({ from, to }) => {
                        moveColumnsInCache(from, to, id_board, dispatch)
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
                    args.from,
                    args.to,
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
        }),

        // GQL

        addBoardColumnGql: build.mutation({
            query: ({ id_board, name }) => ({
                body: CREATE_BOARD_COLUMN,
                variables: { id_board, name }
            }),
            invalidatesTags: ['Board']
        }),

        deleteBoardColumnGql: build.mutation({
            query: (id) => ({
                body: DELETE_BOARD_COLUMN,
                variables: { id }
            }),
            invalidatesTags: ['Board']
        }),

        updateBoardColumnGql: build.mutation({
            query: ({ id, name, emoji }) => ({
                body: UPDATE_BOARD_COLUMN_MUTATION,
                variables: { id, name, emoji }
            }),
            async onQueryStarted(
                { id, id_board, ...props },
                { dispatch, queryFulfilled }
            ) {
                const patchBoardItself = dispatch(
                    apiService.util.updateQueryData(
                        'getFormBoardGql',
                        id_board,
                        (draftBoard) => {
                            Object.assign(
                                draftBoard.board.columns.find(
                                    (i) => i.id === id
                                ),
                                props
                            )
                        }
                    )
                )

                try {
                    await queryFulfilled
                } catch {
                    patchBoardItself.undo()
                }
            }
        }),

        addColumnResponsibleGql: build.mutation({
            query: ({ id_column, id_responsible }) => ({
                body: CREATE_COLUMN_RESPONSIBLE,
                variables: { id_column, id_responsible }
            }),
            invalidatesTags: ['Board']
        }),

        deleteColumnResponsibleGql: build.mutation({
            query: ({ id_column, id_responsible }) => ({
                body: DELETE_COLUMN_RESPONSIBLE,
                variables: { id_column, id_responsible }
            }),
            invalidatesTags: ['Board']
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
                Object.assign(
                    immer.find(
                        ({ id }) => parseInt(id) === parseInt(column.id)
                    ),
                    column
                )
            }
        )
    )
}

const moveColumnsInCache = (from, to, id_board, dispatch) => {
    return dispatch(
        apiService.util.updateQueryData(
            'fetchColumns',
            parseInt(id_board),
            (immer) => {
                const data = reorder(immer, from, to).map((column, k) => ({
                    ...column,
                    position: k + 1
                }))

                return data
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
                return immer.filter(
                    (column) => parseInt(column.id) !== parseInt(id)
                )
            }
        )
    )
}

export const {
    useFetchColumnsQuery,
    useCreateColumnMutation,
    useUpdateColumnMutation,
    useMoveColumnsMutation,
    useDeleteColumnMutation,

    // gql
    useAddBoardColumnGqlMutation,
    useDeleteBoardColumnGqlMutation,
    useUpdateBoardColumnGqlMutation,
    useAddColumnResponsibleGqlMutation,
    useDeleteColumnResponsibleGqlMutation
} = kanbanColumnService
