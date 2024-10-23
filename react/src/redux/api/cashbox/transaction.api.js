import { apiService } from '#root/src/redux/api-service'

const route = 'cashbox/transaction'

export const transactionService = apiService.injectEndpoints({
    endpoints: (build) => ({
        getTransactions: build.query({
            query: ({ from, to, type }) => ({
                url: `${route}/fetch-list?from=${from}&to=${to}&type=${type}`,
                method: 'get'
            }),
            providesTags: ['Transactions']
        }),

        getTransaction: build.query({
            query: (id) => ({
                url: `${route}/fetch-transaction/${id}`,
                method: 'get'
            })
        }),

        createTransaction: build.mutation({
            query: (data) => ({ url: `${route}/create`, method: 'POST', data }),
            invalidatesTags: ['Transactions', 'Wallets']
        }),

        createTransferToWallet: build.mutation({
            query: (data) => ({
                url: `${route}/transfer/create`,
                method: 'POST',
                data
            }),
            invalidatesTags: ['Transactions', 'Wallets']
        }),

        editTransferToWallet: build.mutation({
            query: ({ id, ...data }) => ({
                url: `${route}/transfer/update/${id}`,
                method: 'POST',
                data
            }),
            invalidatesTags: ['Transactions', 'Wallets']
        }),

        deleteTransferToWallet: build.mutation({
            query: (id) => ({
                url: `${route}/transfer/delete/${id}`,
                method: 'POST'
            }),
            invalidatesTags: ['Transactions', 'Wallets']
        }),

        switchStatus: build.mutation({
            query: ({ id, ...data }) => ({
                url: `${route}/switch-status/${id}`,
                method: 'POST',
                data
            }),
            invalidatesTags: ['Transactions', 'Wallets']
        }),

        deleteTransaction: build.mutation({
            query: (id) => ({ url: `${route}/delete/${id}`, method: 'POST' }),
            invalidatesTags: ['Transactions', 'Wallets']
        }),

        updateTransaction: build.mutation({
            query: ({ id, ...data }) => ({
                url: `${route}/update/${id}`,
                method: 'POST',
                data
            }),
            invalidatesTags: ['Transactions', 'Wallets']
        })
    }),
    overrideExisting: false
})

export const {
    useCreateTransactionMutation,
    useCreateTransferToWalletMutation,
    useEditTransferToWalletMutation,
    useDeleteTransferToWalletMutation,
    useSwitchStatusMutation,
    useDeleteTransactionMutation,
    useUpdateTransactionMutation,
    useLazyGetTransactionQuery,
    useGetTransactionsQuery
} = transactionService
