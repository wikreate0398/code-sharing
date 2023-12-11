import { apiService } from '@/redux/api-service'
import websocket from '@/config/laravel-echo'

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
                    .channel(`boards.${id_project}`)
                    .listen('.refresh', (data) => {
                        dispatch(apiService.util.invalidateTags(['Boards']))
                    })
            }
        }),

        fetchBoardsForTask: build.query({
            query: (id_project) => ({
                url: `boards/fetch-task-boards/${id_project}`,
                method: 'get'
            }),
            providesTags: ['Boards']
        }),

        createBoard: build.mutation({
            query: (data) => ({ url: `boards/create`, method: 'POST', data }),
            invalidatesTags: ['Boards']
        }),

        updateBoard: build.mutation({
            query: (data) => ({ url: `boards/update`, method: 'POST', data }),
            invalidatesTags: ['Boards', 'Participant']
        })
    }),
    overrideExisting: false
})

export const {
    useFetchBoardsQuery,
    useFetchBoardsForTaskQuery,
    useCreateBoardMutation,
    useUpdateBoardMutation
} = boardService
