import { apiService } from '#root/src/redux/api-service'

const route = 'cashbox/currency'

export const currencyService = apiService.injectEndpoints({
    endpoints: (build) => ({
        getAllCurrencies: build.query({
            query: () => ({ url: `${route}/fetch-list`, method: 'get' }),
            providesTags: ['Currencies']
        }),

        getWalletsCurrencies: build.query({
            query: () => ({
                url: `${route}/fetch-wallets-currencies`,
                method: 'get'
            }),
            providesTags: ['Currencies']
        })
    }),
    overrideExisting: false
})

export const { useGetAllCurrenciesQuery, useGetWalletsCurrenciesQuery } =
    currencyService
