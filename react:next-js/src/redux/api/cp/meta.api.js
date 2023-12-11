import { apiService } from '@/redux/api-service'
import { authService } from '../auth.api'

export const metaService = apiService.injectEndpoints({
    endpoints: (build) => ({
        fetchCounters: build.query({
            query: () => ({ url: '/cp/meta/fetch-counters', method: 'GET' })
        }),
        fetchTimezones: build.query({
            query: () => ({ url: '/meta/fetch-timezones', method: 'GET' })
        })
    }),
    overrideExisting: false
})

export const { useFetchCountersQuery, useFetchTimezonesQuery } = authService
