import { apiService } from '#root/src/redux/api-service'
import { authService } from '../auth.api'

export const projectService = apiService.injectEndpoints({
    endpoints: (build) => ({
        fetchProjects: build.query({
            query: () => ({ url: '/cp/projects/fetch-list', method: 'GET' })
        })
    }),
    overrideExisting: false
})

export const { useFetchProjectsQuery } = authService
