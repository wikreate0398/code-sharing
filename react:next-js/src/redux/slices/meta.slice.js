import { createSlice } from '@reduxjs/toolkit'
import { userService } from '@/redux/api/user.api'
import { timeTrackingService } from '@/redux/api/time.traking.api'
import { dateFormat } from '@/helpers/functions'
import { now } from 'moment'
import { participantService } from '@/redux/api/participant.api'

const initialState = {
    user: null,
    projects: [],
    boards: [],
    timer: {},
    period: {
        from: dateFormat(now()),
        to: dateFormat(now())
    },
    openTask: false,
    onlineStatuses: {}
}

export const metaSlice = createSlice({
    name: 'meta',
    initialState,
    reducers: {
        setUserAction: (state, action) => {
            state.user = action.payload
        },
        logoutAction: (state) => {
            state.user = null
        },
        setProjectAction: (state, action) => {
            state.project = action.payload
        },
        setPeriodAction: (state, action) => {
            state.period = action.payload
        },
        setBoardsAction: (state, action) => {
            state.boards = action.payload
        },
        setOpenTask: (state, action) => {
            state.openTask = action.payload
        },
        updateOnlineStatus: (state, action) => {
            const { payload } = action
            state.onlineStatuses = {
                ...state.onlineStatuses,
                [payload.id]: payload
            }
        }
    },

    extraReducers: (builder) => {
        builder.addMatcher(
            userService.endpoints.getUser.matchFulfilled,
            (state, { payload }) => {
                state.user = payload
            }
        ),
            builder.addMatcher(
                timeTrackingService.endpoints.getTimer.matchFulfilled,
                (state, { payload }) => {
                    state.timer = payload
                }
            ),
            builder.addMatcher(
                participantService.endpoints.getOwnerParticipantsOnlineStatus
                    .matchFulfilled,
                (state, { payload }) => {
                    state.onlineStatuses = payload
                }
            )
    }
})

export const selectProject = (state) => state.meta.project
export const selectUser = (state) => state.meta.user
export const selectTimer = (state) => state.meta.timer
export const selectPeriod = (state) => state.meta.period
export const selectTaskState = (state) => state.meta.openTask
export const selectOnlineStatuses = (state) => state.meta.onlineStatuses

export const metaReducer = metaSlice.reducer
export const metaActions = metaSlice.actions
