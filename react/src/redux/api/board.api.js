import { apiService } from '#root/src/redux/api-service'
import websocket from '#root/src/config/laravel-echo'
import {
    CREATE_BOARD_MUTATION,
    UPDATE_BOARD_MUTATION,
    SORT_BOARD_MUTATION,
    DELETE_BOARD_MUTATION
} from '#root/src/graphql/mutations/board-mutation'
import {
    GET_BOARD_QUERY,
    GET_BOARDS_QUERY, GET_KANBAN_BOARD_QUERY
} from '#root/src/graphql/queries/board-query'
import {
    CREATE_BOARD_PARTICIPANT_MUTATION,
    DELETE_BOARD_PARTICIPANT_MUTATION
} from '#root/src/graphql/mutations/board-mutation'
import { arrayMove } from '@dnd-kit/sortable'
import { metaActions } from '#root/src/redux/slices/meta.slice.js'

export const boardService = apiService.injectEndpoints({
    endpoints: (build) => ({
        fetchBoards: build.query({
            query: (id_project) => ({
                url: `boards/fetch-list/${id_project}`,
                method: 'get'
            }),
            providesTags: ['Boards'],

            async onCacheEntryAdded(id_project, { dispatch }) {
                websocket()
                    .private(`boards-${id_project}`)
                    .listen('.refresh', (data) => {
                        dispatch(
                            apiService.util.invalidateTags([
                                'KanbanBoards',
                                'Boards',
                                'FormBoards',
                                'Column'
                            ])
                        )
                    })
            }
        }),

        fetchBoardsForTask: build.query({
            query: (id_project) => ({
                url: `boards/fetch-task-boards/${id_project}`,
                method: 'get'
            }),
            providesTags: ['Boards'],
            async onCacheEntryAdded(args, { dispatch }) {
                // by default when
                //dispatch(metaActions.setOpenTask(false))
            }
        }),

        // gql
        getKanbanBoardGql: build.query({
            query: (id) => ({
                body: GET_KANBAN_BOARD_QUERY,
                variables: { id }
            }),
            transformResponse(baseQueryReturnValue, meta, arg) {
                return baseQueryReturnValue?.board
            },
            providesTags: ['Boards', 'KanbanBoards']
        }),

        getFormBoardsGql: build.query({
            query: (id_project) => ({
                body: GET_BOARDS_QUERY,
                variables: { id_project }
            }),
            providesTags: ['FormBoards']
        }),

        getFormBoardGql: build.query({
            query: (id) => ({
                body: GET_BOARD_QUERY,
                variables: { id }
            }),
            providesTags: ['Board']
        }),

        createBoardGql: build.mutation({
            query: ({ id_project, name, participants }) => ({
                body: CREATE_BOARD_MUTATION,
                variables: { id_project, name, participants: participants || [] }
            }),
            invalidatesTags: ['FormBoards', 'MainProject', 'Boards']
        }),

        deleteBoardGql: build.mutation({
            query: (id) => ({
                body: DELETE_BOARD_MUTATION,
                variables: { id }
            }),
            invalidatesTags: ['FormBoards', 'MainProject', 'Boards']
        }),

        updateBoardGql: build.mutation({
            query: ({ id, name, private: p, participants }) => ({
                body: UPDATE_BOARD_MUTATION,
                variables: { id, name, private: p, ...(participants ? {participants} : {}) }
            }),
            invalidatesTags: ['Boards', 'BoardParticipants', 'FormBoards', 'Project', 'KanbanBoards'],
            async onQueryStarted(
                { id, id_project, ...props },
                { dispatch, queryFulfilled }
            ) {
                const patchAllBoards = dispatch(
                    apiService.util.updateQueryData(
                        'getFormBoardsGql',
                        id_project,
                        (draftBoards) => {
                            Object.assign(
                                draftBoards.boards.find(
                                    (v) => parseInt(v.id) === parseInt(id)
                                ),
                                props
                            )
                        }
                    )
                )

                const patchBoardItself = dispatch(
                    apiService.util.updateQueryData(
                        'getFormBoardGql',
                        id,
                        (draftBoard) => {
                            Object.assign(draftBoard.board, props)
                        }
                    )
                )

                try {
                    await queryFulfilled
                } catch {
                    patchAllBoards.undo()
                    patchBoardItself.undo()
                }
            }
        }),

        sortBoardGql: build.mutation({
            query: ({ id, newIndex }) => ({
                body: SORT_BOARD_MUTATION,
                variables: { id, position: newIndex + 1 }
            }),
            invalidatesTags: ['Boards'],
            async onQueryStarted(
                { id, newIndex, oldIndex, id_project },
                { dispatch }
            ) {
                return dispatch(
                    apiService.util.updateQueryData(
                        'getFormBoardsGql',
                        parseInt(id_project),
                        (immer) => {
                            return {
                                boards: arrayMove(
                                    immer.boards,
                                    oldIndex,
                                    newIndex
                                )
                            }
                        }
                    )
                )
            }
        }),

        addBoardParticipantGql: build.mutation({
            query: ({ id_board, id_participant }) => ({
                body: CREATE_BOARD_PARTICIPANT_MUTATION,
                variables: { id_board, id_participant }
            }),
            invalidatesTags: ['Board', 'Boards'],
            async onQueryStarted(params, actions) {
                updateBoardParticipants(params, actions)
            }
        }),

        deleteBoardParticipantGql: build.mutation({
            query: ({ id_board, id_participant }) => ({
                body: DELETE_BOARD_PARTICIPANT_MUTATION,
                variables: { id_board, id_participant }
            }),
            invalidatesTags: ['Board', 'Boards'],
            async onQueryStarted(params, actions) {
                updateBoardParticipants(params, actions, 'delete')
            }
        })
    }),
    overrideExisting: true
})

const updateBoardParticipants = async (params, actions, type = 'add') => {
    const { id_board, id_project } = params || {}
    const { dispatch, queryFulfilled } = actions || {}

    const patchAllBoards = dispatch(
        apiService.util.updateQueryData(
            'getFormBoardsGql',
            id_project,
            (draftBoards) => {
                let board = draftBoards.boards.find(
                    (v) => parseInt(v?.id) === parseInt(id_board)
                )
                let count = board.participants_count

                board.participants_count =
                    type === 'add' ? count + 1 : count - 1
            }
        )
    )

    try {
        await queryFulfilled
    } catch {
        patchAllBoards.undo()
    }
}

export const {
    useFetchBoardsQuery,
    useFetchBoardsForTaskQuery,

    // gql
    useCreateBoardGqlMutation,
    useDeleteBoardGqlMutation,
    useGetFormBoardGqlQuery,
    useGetFormBoardsGqlQuery,
    useGetKanbanBoardGqlQuery,
    useUpdateBoardGqlMutation,
    useSortBoardGqlMutation,
    useAddBoardParticipantGqlMutation,
    useDeleteBoardParticipantGqlMutation
} = boardService
