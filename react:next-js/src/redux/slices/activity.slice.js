import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    period: { from: null, to: null },
    day: null
}

export const activitySlice = createSlice({
    name: 'activity',
    initialState,
    reducers: {
        setPeriod: (state, action) => {
            state.period = action.payload
        },

        setDay: (state, action) => {
            state.day = action.payload
        }
    }
})

export const activityReducer = activitySlice.reducer
export const activityActions = activitySlice.actions
