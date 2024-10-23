import { apiService } from '#root/src/redux/api-service'
import { GET_PROJECT_PARTICIPANTS } from '#root/src/graphql/queries/projects-participants-query'

export const participantService = apiService.injectEndpoints({
    endpoints: (build) => ({
        getProjectParticipantStats: build.query({
            query: ({ id_project, login, from, to }) => ({
                url: `projects/participants/fetch-project-participant-stats/${id_project}/${login}?from=${from}&to=${to}`,
                method: 'get'
            }),
            providesTags: ['Participant']
        }),

        getProjectParticipantsGql: build.query({
            query: (id_project) => ({
                body: GET_PROJECT_PARTICIPANTS,
                variables: { id_project }
            }),
            providesTags: ['Participant']
        }),

        getOwnerParticipantsOnlineStatus: build.query({
            query: () => ({
                url: `projects/participants/fetch-online`,
                method: 'get'
            }),
            invalidatesTags: ['OnlineStatuses']
        }),

        getAllParticipantsStats: build.query({
            query: ({ from, to }) => ({
                url: `projects/participants/fetch-participants-stats?from=${from}&to=${to}`,
                method: 'get'
            })
        }),

        getAllParticipantsOfOwner: build.query({
            query: () => ({
                url: `projects/participants/fetch-all-owner-participants`,
                method: 'get'
            }),
            providesTags: ['Participant']
        }),

        getParticipantProjectsStats: build.query({
            query: ({ login, from, to }) => ({
                url: `projects/participants/fetch-participant-projects-stats${
                    login ? `/${login}` : ''
                }?from=${from}&to=${to}`,
                method: 'get'
            })
        }),

        getProjectParticipantsStats: build.query({
            query: ({ id_project, from, to }) => ({
                url: `projects/participants/fetch-project-participants-stats/${id_project}?from=${from}&to=${to}`,
                method: 'get'
            }),
            providesTags: ['Participant']
        }),

        getProjectGuest: build.query({
            query: ({ id_project, from, to }) => ({
                url: `projects/participants/fetch-project-guest/${id_project}?from=${from}&to=${to}`,
                method: 'get'
            }),
            providesTags: ['GuestProject']
        }),

        getBoardParticipants: build.query({
            query: (id_board) => ({
                url: `boards/participants/fetch-board-participants/${id_board}`,
                method: 'get'
            }),
            providesTags: ['Participant', 'BoardParticipants']
        }),

        updateProjectParticipant: build.mutation({
            query: (data) => ({
                url: `projects/participants/update`,
                method: 'POST',
                data
            }),
            invalidatesTags: ['Participant', 'Statistic']
        }),

        // target - edit project modal, ...

        getProjectParticipants: build.query({
            query: (id_project) => ({
                url: `projects/participants/fetch-project-participants/${id_project}`,
                method: 'GET'
            }),
            providesTags: ['ProjectParticipants']
        }),

        getParticipantInfo: build.query({
            query: ({ id_project, id_member }) => ({
                url: `projects/participants/fetch-project-participant/${id_project}/${id_member}`,
                method: 'GET'
            })
        }),

        addProjectParticipant: build.mutation({
            query: (data) => ({
                url: `projects/participants/create`,
                data,
                method: 'POST'
            }),
            invalidatesTags: ['ProjectParticipants']
        }),

        updateProjectParticipantInfo: build.mutation({
            query: ({ id_user, ...data }) => ({
                url: `projects/participants/update/${id_user}`,
                data,
                method: 'POST'
            })
        }),

        deleteProjectParticipant: build.mutation({
            query: (id_user) => ({
                url: `projects/participants/delete/${id_user}`,
                method: 'POST'
            }),
            invalidatesTags: ['ProjectParticipants']
        })
    }),
    overrideExisting: false
})

export const {
    useLazyGetProjectParticipantStatsQuery,
    useLazyGetProjectGuestQuery,
    useLazyGetAllParticipantsStatsQuery,
    useGetBoardParticipantsQuery,
    useGetOwnerParticipantsOnlineStatusQuery,
    useLazyGetProjectParticipantsStatsQuery,
    useUpdateProjectParticipantMutation,
    useGetAllParticipantsOfOwnerQuery,

    // Gql
    useGetProjectParticipantsGqlQuery,

    // target - edit project modal, ...
    useGetProjectParticipantsQuery,
    useLazyGetProjectParticipantsQuery,
    useLazyGetParticipantInfoQuery,

    useUpdateProjectParticipantInfoMutation,
    useDeleteProjectParticipantMutation,
    useAddProjectParticipantMutation
} = participantService
