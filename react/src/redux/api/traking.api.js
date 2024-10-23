import { apiService } from '#root/src/redux/api-service'
import {
    GET_TASK_ACTIVITY,
    GET_TASK_TRACKING_TIME, GET_DAY_TIME_FOR_EDIT,
    GET_TRACKING_TYPES
} from '#root/src/graphql/queries/tracking-query.js'

export const timeTrackingService = apiService.injectEndpoints({
    endpoints: (build) => ({
        timerToggl: build.mutation({
            query: (data) => ({
                url: `tracking/timer-toggl`,
                method: 'POST',
                data
            }),
            invalidatesTags: ['Timer']
            //... update self online status
        }),

        manageTimer: build.mutation({
            query: ({id_user, ...data }) => ({
                url: `tracking/manage-timer/${id_user}`,
                method: 'POST',
                data
            }),
            invalidatesTags: ['Timer', 'Statistic']
        }),

        getTrackingTypesGql: build.query({
            query: () => ({
                body: GET_TRACKING_TYPES
            }),
            transformResponse({ trackingTypes }, meta, arg) {
                return trackingTypes
            }
        }),

        getTaskTrackingTimeGql: build.query({
            query: (id_task) => ({
                body: GET_TASK_TRACKING_TIME,
                variables: {id_task}
            }),
            transformResponse({ taskTrackingTime }, meta, arg) {
                return taskTrackingTime
            }
        }),

        getTaskActivityGql: build.query({
            query: (id_task) => ({
                body: GET_TASK_ACTIVITY,
                variables: {id_task}
            }),
            transformResponse({ taskActivity }, meta, arg) {
                return taskActivity
            },
            providesTags: (result, error, arg) => {
                return [{ type: 'TaskActivity', id: arg}]
            }
        }),

        getDayUserTimerActivityForEditGql: build.query({
            query: ({ day, id_user }) => ({
                url: `tracking/fetch-day-time/${id_user}?day=${day}`,
                method: 'GET'
            }),
            providesTags: ['Statistic', 'StatisticDayTimer']
        }),

        getTimer: build.query({
            query: (id) => ({ url: `tracking/fetch-timer`, method: 'GET' }),
            providesTags: ['Timer']
        })
    }),
    overrideExisting: false
})

export const {
    useTimerTogglMutation,
    useManageTimerMutation,
    useGetTimerQuery,
    useGetTrackingTypesGqlQuery,
    useLazyGetTaskTrackingTimeGqlQuery,
    useLazyGetTaskActivityGqlQuery,
    useLazyGetDayUserTimerActivityForEditGqlQuery
} = timeTrackingService
