import { apiService } from '#root/src/redux/api-service'

const route = 'cashbox/wallet'

export const currencyService = apiService.injectEndpoints({
    endpoints: (build) => ({
        getWallets: build.query({
            query: () => ({ url: `${route}/fetch-list`, method: 'get' }),
            providesTags: ['Wallets']
        }),

        createWallet: build.mutation({
            query: (data) => ({ url: `${route}/create`, method: 'POST', data }),
            invalidatesTags: ['Wallets', 'Currencies']
        }),

        deleteWallet: build.mutation({
            query: (id) => ({ url: `${route}/delete/${id}`, method: 'POST' }),
            invalidatesTags: ['Transactions', 'Wallets', 'Currencies']
        }),

        updateWallet: build.mutation({
            query: ({ id, ...data }) => ({
                url: `${route}/update/${id}`,
                method: 'POST',
                data
            }),
            invalidatesTags: ['Transactions', 'Wallets', 'Currencies']
        })
    }),
    overrideExisting: false
})

export const {
    useGetWalletsQuery,
    useCreateWalletMutation,
    useDeleteWalletMutation,
    useUpdateWalletMutation
} = currencyService
