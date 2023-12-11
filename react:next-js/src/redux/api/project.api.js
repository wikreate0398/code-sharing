import { apiService } from '@/redux/api-service'
import { updateArray } from '@/helpers/functions'
import websocket from '@/config/laravel-echo'

export const projectService = apiService.injectEndpoints({
    endpoints: (build) => ({
        getProjects: build.query({
            query: () => ({ url: `projects/fetch-list`, method: 'get' }),
            providesTags: ['Projects', 'Project'],
            async onCacheEntryAdded(id_board, { dispatch, getState }) {
                websocket()
                    .private(`projects-${getState().meta.user.id}`)
                    .listen('.update', (data) => {
                        dispatch(
                            apiService.util.updateQueryData(
                                'getProjects',
                                undefined,
                                (immer) => {
                                    const project = immer.find(
                                        (v) => v.id === parseInt(data.id)
                                    )
                                    return updateArray(immer, {
                                        where: { id: parseInt(data.id) },
                                        update: { ...project, ...data }
                                    })
                                }
                            )
                        )
                    })
            }
        }),

        getProject: build.query({
            query: (id) => ({
                url: `projects/fetch-project/${id}`,
                method: 'GET'
            }),
            providesTags: ['Project']
        }),

        createProject: build.mutation({
            query: (data) => ({ url: `projects/create`, data, method: 'POST' }),
            invalidatesTags: ['Project']
        }),

        updateProject: build.mutation({
            query: (data) => ({ url: `projects/update`, data, method: 'POST' }),
            invalidatesTags: ['Project']
        }),

        pinProject: build.mutation({
            query: (id) => ({
                url: `projects/pin`,
                data: { id },
                method: 'POST'
            }),
            async onQueryStarted(id, { dispatch }) {
                dispatch(
                    apiService.util.updateQueryData(
                        'getProjects',
                        undefined,
                        (immer) => {
                            const project = immer.find(
                                (v) => v.id === parseInt(id)
                            )
                            return updateArray(immer, {
                                where: { id: parseInt(id) },
                                update: { pin: !project.pin }
                            })
                        }
                    )
                )
            }
        })
    }),
    overrideExisting: false
})

export const {
    useGetProjectQuery,
    useGetProjectsQuery,
    useUpdateProjectMutation,
    useCreateProjectMutation,
    usePinProjectMutation
} = projectService
