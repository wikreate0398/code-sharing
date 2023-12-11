import { apiService } from '@/redux/api-service'
import websocket from '@/config/laravel-echo'
import { metaActions } from '@/redux/slices/meta.slice'

export const participantService = apiService.injectEndpoints({
    endpoints: (build) => ({
        getProjectParticipant: build.query({
            query: ({ id_project, login, from, to }) => ({
                url: `participants/fetch-project-participant/${id_project}/${login}?from=${from}&to=${to}`,
                method: 'get'
            }),
            providesTags: ['Participant']
        }),

        getOwnerParticipantsOnlineStatus: build.query({
            query: () => ({
                url: `participants/fetch-online`,
                method: 'get'
            }),
            async onCacheEntryAdded(args, { dispatch, getState }) {
                websocket()
                    .private(`user-${getState().meta.user.id}`)
                    .listen('.online-status', (data) => {
                        dispatch(metaActions.updateOnlineStatus(data))
                    })
            },
            invalidatesTags: ['OnlineStatuses']
        }),

        getAllParticipantsStats: build.query({
            query: ({ from, to }) => ({
                url: `participants/fetch-participants-stats?from=${from}&to=${to}`,
                method: 'get'
            })
        }),

        getAllParticipants: build.query({
            query: () => ({
                url: `participants/fetch-all-participants`,
                method: 'get'
            }),
            providesTags: ['Participant']
        }),

        getParticipantProjects: build.query({
            query: ({ login, from, to }) => ({
                url: `participants/fetch-participant-projects${
                    login ? `/${login}` : ''
                }?from=${from}&to=${to}`,
                method: 'get'
            })
        }),

        getProjectParticipantsStats: build.query({
            query: ({ id_project, from, to }) => ({
                url: `participants/fetch-project-participants-stats/${id_project}?from=${from}&to=${to}`,
                method: 'get'
            }),
            providesTags: ['Participant']
        }),

        getProjectGuest: build.query({
            query: ({ id_project, from, to }) => ({
                url: `participants/fetch-project-guest/${id_project}?from=${from}&to=${to}`,
                method: 'get'
            }),
            providesTags: ['GuestProject']
        }),

        getBoardParticipants: build.query({
            query: (id_board) => ({
                url: `participants/fetch-board-participants/${id_board}`,
                method: 'get'
            }),
            providesTags: ['Participant']
        }),

        updateProjectParticipant: build.mutation({
            query: (data) => ({
                url: `participants/update`,
                method: 'POST',
                data
            }),
            invalidatesTags: ['Participant']
        })
    }),
    overrideExisting: false
})

export const {
    useLazyGetProjectParticipantQuery,
    useLazyGetProjectGuestQuery,
    useLazyGetParticipantProjectsQuery,
    useLazyGetAllParticipantsStatsQuery,
    useGetParticipantProjectsQuery,
    useGetBoardParticipantsQuery,
    useGetOwnerParticipantsOnlineStatusQuery,
    useLazyGetProjectParticipantsStatsQuery,
    useUpdateProjectParticipantMutation,
    useGetAllParticipantsQuery
} = participantService
