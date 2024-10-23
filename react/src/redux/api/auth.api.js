import { apiService } from '#root/src/redux/api-service'

export const authService = apiService.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation({
            query: (data) => ({ url: `login`, method: 'POST', data })
        }),

        logout: build.mutation({
            query: (data) => ({ url: `logout`, method: 'POST', data })
        }),

        checkUser: build.mutation({
            query: (data) => ({ url: 'auth/check-user', method: 'POST', data })
        }),

        sendEmailCode: build.mutation({
            query: (data) => ({ url: 'auth/send/email', method: 'POST', data })
        }),

        checkCode: build.mutation({
            query: (data) => ({ url: 'auth/check-code', method: 'POST', data })
        }),

        signup: build.mutation({
            query: (data) => ({ url: 'auth/signup', method: 'POST', data })
        }),

        authWithSocials: build.mutation({
            query: (data) => ({ url: 'auth/socialite', method: 'POST', data })
        }),

        forgotPassword: build.mutation({
            query: (data) => ({
                url: 'auth/change-password',
                method: 'POST',
                data
            })
        })
    }),
    overrideExisting: false
})

export const {
    useLoginMutation,
    useLogoutMutation,
    useCheckUserMutation,
    useAuthWithSocialsMutation,
    useSendEmailCodeMutation,
    useCheckCodeMutation,
    useSignupMutation,
    useForgotPasswordMutation
} = authService
