import { updateElementById } from '#root/src/helpers/functions'
import { apiService } from '#root/src/redux/api-service'

export const constantService = apiService.injectEndpoints({
    endpoints: (build) => ({
        fetchConstants: build.query({
            query: () => ({ url: `/cp/constants/fetch-list`, method: 'GET' })
        }),
        createConstant: build.mutation({
            query: (data) => ({
                url: `/cp/constants/save`,
                method: 'POST',
                data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data: resp } = await queryFulfilled

                    saveConstantInCache(resp.const, args.id, dispatch)
                } catch (e) {}
            }
        })
    }),
    overrideExisting: true
})

export const saveConstantInCache = (payload, id_const, dispatch) => {
    return dispatch(
        apiService.util.updateQueryData(
            'fetchConstants',
            undefined,
            (cachedData) => {
                if (id_const) {
                    updateElementById(
                        cachedData,
                        id_const ?? payload.id,
                        payload
                    )
                } else {
                    return [...cachedData, payload]
                }

                return cachedData
            }
        )
    )
}

export const { useFetchConstantsQuery, useCreateConstantMutation } =
    constantService
