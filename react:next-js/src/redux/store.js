import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { metaReducer } from '@/redux/slices/meta.slice'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiService } from '@/redux/api-service'
import { createLogger } from 'redux-logger/src'
import process from 'next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss'
import { activityReducer } from '@/redux/slices/activity.slice'

const reducers = combineReducers({
    meta: metaReducer,
    activity: activityReducer,
    [apiService.reducerPath]: apiService.reducer
})

const logger = createLogger({
    collapsed: true
})

export const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => {
        const conf = [apiService.middleware]
        if (process.env.APP_ENV !== 'production') {
            //conf.push(logger)
        }
        return getDefaultMiddleware().concat(conf)
    }
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization

setupListeners(store.dispatch)
