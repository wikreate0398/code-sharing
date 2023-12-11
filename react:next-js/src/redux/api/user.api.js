import { apiService } from '@/redux/api-service'

export const userService = apiService.injectEndpoints({
    endpoints: (build) => ({
        getUser: build.query({
            query: () => ({ url: `user`, method: 'get' }),
            providesTags: ['User']
        }),
        editUserInfo: build.mutation({
            query: (data) => ({
                url: 'profile/update-profile',
                method: 'POST',
                data
            }),
            providesTags: ['User']
        }),
        changePassword: build.mutation({
            query: (data) => ({
                url: 'profile/change-password',
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
    useChangePasswordMutation
} = userService
