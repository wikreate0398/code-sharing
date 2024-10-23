import { apiService, rtkQueryTags } from '#root/src/redux/api-service'
import websocket from '#root/src/config/laravel-echo'
import {
    createTaskTagInCache,
    deleteTaskTagFromCache,
    updateTaskTagInCache
} from '#root/src/redux/api/task/task.tags.api.js'
import { metaActions } from '#root/src/redux/slices/meta.slice.js'
import { logoutRoute } from '#root/src/config/routes.js'

import { GET_USER_BY_ID, GET_USER_BY_LOGIN } from '#root/src/graphql/queries/user-query.js'
import { isNum } from '#root/src/helpers/functions.js'

export const userService = apiService.injectEndpoints({
    endpoints: (build) => ({
        getUser: build.query({
            query: () => ({ url: `user`, method: 'get' }),
            providesTags: ['User'],
            async onCacheEntryAdded(
                args,
                { dispatch, cacheDataLoaded, getState }
            ) {
                await cacheDataLoaded
                const id_user = getState().meta.user.id

                websocket()
                    .private(`user-${id_user}`)
                    .listen('.refresh', (data) => {
                        dispatch(apiService.util.invalidateTags(['User']))
                    }).listen('.refresh_timer', (data) => {
                        dispatch(apiService.util.invalidateTags(['Timer']))
                    }).listen('.reload_page', (data) => {
                        window.location.reload()
                    }).listen('.reload_rtk_requests', (data) => {
                        dispatch(apiService.util.invalidateTags(rtkQueryTags))
                    }).listen('.logout', (data) => {
                        window.location = logoutRoute()
                    }).listen('.online-status', (data) => {
                         console.log('online-status', data.socketId , window.Echo.socketId())
                        if (data.socketId !== window.Echo.socketId()) {
                            dispatch(apiService.util.invalidateTags(['Timer', 'Statistic']))
                        }
                        dispatch(metaActions.updateOnlineStatus(data))
                    }).listen('.update_timer', (data) => {
                        dispatch(apiService.util.invalidateTags(['Timer', 'Statistic']))
                    })

                const handleRefreshProjects = (data) => {
                    dispatch(
                        apiService.util.invalidateTags([
                            'User', 'UserProjects', 'Project', 'Boards', 'Timer'
                        ])
                    )
                }

                websocket()
                    .private(`projects-${id_user}`)
                    .listen('.touched', (data) => {
                        dispatch(
                            apiService.util.updateQueryData(
                                'getUserProjectsGql',
                                undefined,
                                (immer) => {
                                    const project = immer.find(
                                        (v) =>
                                            parseInt(v.id) === parseInt(data.id)
                                    )

                                    if (project) {
                                        Object.assign(project, data, {})
                                    }
                                }
                            )
                        )
                    })
                    .listen('.refresh', handleRefreshProjects)
                    .listen('.refresh_main', () => {
                        dispatch(
                            apiService.util.invalidateTags([
                                'Projects'
                            ])
                        )
                    })
                    .listen('.delete', handleRefreshProjects)

                websocket()
                    .private(`taskTags-${id_user}`)
                    .listen('.update', (data) => {
                        updateTaskTagInCache(data, dispatch)
                    }).listen('.create', (data) => {
                    createTaskTagInCache(data, dispatch)
                }).listen('.delete', (data) => {
                    deleteTaskTagFromCache(data, dispatch)
                }).listen('.move', (data) => {
                    updateTaskTagInCache(data, dispatch)
                })
            }
        }),

        getUserByIdentifier: build.query({
            query: ({ identifier, withTrashed = false }) => {
                const isId = isNum(identifier)
                return {
                    body: isId ? GET_USER_BY_ID : GET_USER_BY_LOGIN,
                    variables: {[isId ? 'id' : 'login']: identifier, withTrashed}
                }
            },
            transformResponse(baseQueryReturnValue, meta, { identifier }) {
                return baseQueryReturnValue[!isNum(identifier) ? 'userByLogin' : 'userById']
            },
            providesTags: ['User', 'Participant', 'ProjectParticipants']
        }),

        editUserInfo: build.mutation({
            query: (data) => ({
                url: 'profile/update-profile',
                method: 'POST',
                data
            }),
            invalidatesTags: ['User']
        }),

        changePassword: build.mutation({
            query: (data) => ({
                url: 'profile/change-password',
                method: 'POST',
                data
            }),
            invalidatesTags: ['User']
        }),

        handleNetwork: build.mutation({
            query: (data) => ({
                url: 'profile/handle-network',
                method: 'POST',
                data
            }),
            invalidatesTags: ['User']
        }),

        deleteAccount: build.mutation({
            query: (data) => ({
                url: 'profile/delete-account',
                method: 'POST',
                data
            })
        })
    }),
    overrideExisting: false
})

export const {
    useGetUserQuery,
    useEditUserInfoMutation,
    useChangePasswordMutation,
    useDeleteAccountMutation,
    useHandleNetworkMutation,
    useGetUserByIdentifierQuery
} = userService
