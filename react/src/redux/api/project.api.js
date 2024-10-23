import { apiService } from '#root/src/redux/api-service'
import {
    GET_EDIT_PROJECT, GET_PROJECT,
    GET_PROJECTS_FOR_DROPDOWN,
    GET_USER_PROJECTS
} from '#root/src/graphql/queries/project-query'
import moment from 'moment'
import { dateFormat } from '#root/src/helpers/functions'
import { DELETE_PROJECT_MUTATION } from '#root/src/graphql/mutations/project-mutation.js'

export const projectService = apiService.injectEndpoints({
    endpoints: (build) => ({
        getUserProjectsGql: build.query({
            query: () => ({
                body: GET_USER_PROJECTS
            }),
            transformResponse({ projects }, meta, arg) {
                return projects.map(({ data, ...props }) => ({
                    ...props,
                    ...data
                }))
            },
            providesTags: ['Projects', 'UserProjects', 'Project']
        }),

        getProjectsForDropdown: build.query({
            query: () => ({
                body: GET_PROJECTS_FOR_DROPDOWN
            }),
            transformResponse(baseQueryReturnValue, meta, arg) {
                const { projects = [] } = baseQueryReturnValue || {}
                return projects
            }
        }),
        
        getProjectGql: build.query({
            query: (id) => ({
                body: GET_PROJECT,
                variables: { id }
            }),
            transformResponse(R) {
                return R?.project
            },
            providesTags: ['Project', 'MainProject']
        }),

        getEditProjectGql: build.query({
            query: (id) => ({
                body: GET_EDIT_PROJECT,
                variables: { id }
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

        deleteProjectGql: build.mutation({
            query: (id) => ({
                body: DELETE_PROJECT_MUTATION,
                variables: { id }
            }),
            invalidatesTags: ['Project']
        }),

        pinProject: build.mutation({
            query: (id) => ({
                url: `projects/pin`,
                data: { id },
                method: 'POST'
            }),
            async onQueryStarted(id, { dispatch, getState }) {
                const id_user = getState().meta.user.id

                dispatch(
                    apiService.util.updateQueryData(
                        'getUserProjectsGql',
                        undefined,
                        (immer) => {
                            const project = immer.find(
                                (v) => parseInt(v.id) === parseInt(id)
                            )

                            project.pin = !project.pin
                            project.updated_at = dateFormat(
                                moment(),
                                'YYYY-MM-DD HH:mm:ss'
                            )
                        }
                    )
                )
            }
        })
    }),
    overrideExisting: false
})

export const {
    useGetProjectGqlQuery,
    useGetProjectsForDropdownQuery,
    useUpdateProjectMutation,
    useCreateProjectMutation,
    usePinProjectMutation,
    useDeleteProjectGqlMutation,

    useLazyGetEditProjectGqlQuery,
    useGetUserProjectsGqlQuery
} = projectService
