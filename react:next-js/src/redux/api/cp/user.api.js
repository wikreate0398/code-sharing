import { apiService } from '@/redux/api-service'
import { authService } from '../auth.api'

export const userService = apiService.injectEndpoints({
    endpoints: (build) => ({
        fetchUsers: build.query({
            query: () => ({ url: '/cp/users/fetch-list', method: 'GET' })
        })
    }),
    overrideExisting: false
})

export const { useFetchUsersQuery } = authService
