import { apiService } from '#root/src/redux/api-service'
import { objectToQueryStr } from '#root/src/helpers/functions'
import { GET_TASK_TRACKING_TIME, GET_TASKS_STATISTICS } from '#root/src/graphql/queries/tracking-query.js'

export const statisticsService = apiService.injectEndpoints({
    endpoints: (build) => ({

        getParticipantChart: build.query({
            query: ({ id_project, login, from, to }) => {
                let path = `statistics/fetch-participant-chart/${login}`
                if (id_project) path += `/${id_project}`

                const query = objectToQueryStr({
                    from,
                    to
                })

                return { url: `${path}?${query}`, method: 'get'}
            },
            providesTags: ['Statistic']
        }),

        getTasksStatisticsGql: build.query({
            query: (props) => ({
                body: GET_TASKS_STATISTICS,
                variables: props
            }),
            transformResponse({ tasksStatistics }, meta, arg) {
                return tasksStatistics
            }
        }),

        getActivityDays: build.query({
            query: ({ id_project, login, from, to }) => {
                let path = `statistics/fetch-activity-days`
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
            providesTags: ['Statistic']
        }),

        getActivity: build.query({
            query: ({ id_project, login, day }) => {
                let path = `statistics/fetch-activity`
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
            providesTags: ['Statistic']
        }),

        getActivityYears: build.query({
            query: ({ id_project, login, year }) => {
                let path = `statistics/fetch-activity-years/${login}`
                if (id_project) path += `/${id_project}`
                return { url: path, method: 'get' }
            },
            providesTags: ['Statistic']
        }),

        getAnnualActivity: build.query({
            query: ({ id_project, login, year }) => {
                let path = `statistics/fetch-annual-activity/${login}`
                if (id_project) path += `/${id_project}`

                const query = objectToQueryStr({
                    year
                })

                return {
                    url: `${path}?${query}`,
                    method: 'get'
                }
            },
            providesTags: ['Statistic']
        }),
    }),
    overrideExisting: false
})

export const {
    useLazyGetActivityDaysQuery,
    useLazyGetActivityQuery,
    useLazyGetAnnualActivityQuery,
    useLazyGetParticipantChartQuery,
    useLazyGetActivityYearsQuery,
    useGetTasksStatisticsGqlQuery
} = statisticsService
