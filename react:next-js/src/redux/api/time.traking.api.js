import { apiService } from '@/redux/api-service'
import { objectToQueryStr } from '@/helpers/functions'

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

        getActivityDays: build.query({
            query: ({ id_project, login, from, to }) => {
                let path = `tracking/fetch-activity-days`
                if (id_project) path += `/${id_project}`

                const query = objectToQueryStr({
                    from,
                    to,
                    login
                })

                return {
                    url: `${path}?${query}`,
                    method: 'get'
                }
            },
            providesTags: ['Participant']
        }),

        getActivity: build.query({
            query: ({ id_project, login, day }) => {
                let path = `tracking/fetch-activity`
                if (id_project) path += `/${id_project}`

                const query = objectToQueryStr({
                    day,
                    login
                })

                return {
                    url: `${path}?${query}`,
                    method: 'get'
                }
            },
            providesTags: ['Participant']
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
    useLazyGetActivityDaysQuery,
    useLazyGetActivityQuery,
    useGetTimerQuery
} = timeTrackingService
