import { apiService } from '@/redux/api-service'

export const userTagService = apiService.injectEndpoints({
    endpoints: (build) => ({
        getUserTags: build.query({
            query: (type) => ({
                url: `tags/fetch-tags?type=${type}`,
                method: 'get'
            })
        }),

        createUserTag: build.mutation({
            query: (data) => ({ url: `tags/create`, method: 'POST', data }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data: resp } = await queryFulfilled

                    dispatch(
                        apiService.util.updateQueryData(
                            'getUserTags',
                            resp.type,
                            (immer) => [...immer, resp]
                        )
                    )
                } catch (e) {}
            }
        }),

        deleteUserTag: build.mutation({
            query: (id) => ({ url: `tags/delete/${id}`, method: 'POST' }),
            invalidatesTags: ['UserTags']
        })
    }),
    overrideExisting: false
})

export const {
    useGetUserTagsQuery,
    useCreateUserTagMutation,
    useDeleteUserTagMutation
} = userTagService
