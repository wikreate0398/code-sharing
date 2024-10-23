import { createSlice } from '@reduxjs/toolkit'
import { userService } from '#root/src/redux/api/user.api'
import { timeTrackingService } from '#root/src/redux/api/traking.api.js'
import { dateFormat } from '#root/src/helpers/functions'
import moment from 'moment'
import { participantService } from '#root/src/redux/api/participant.api'
import { boardService } from '#root/src/redux/api/board.api.js'

const initialState = {
    user: null,
    projects: [],
    boards: [],
    timer: {},
    period: {
        from: dateFormat(moment().startOf('month')),
        to: dateFormat(moment.now())
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
export const selectAuthUser = (state) => state.meta.user
export const selectTimer = (state) => state.meta.timer
export const selectPeriod = (state) => state.meta.period
export const selectTaskState = (state) => state.meta.openTask
export const selectOnlineStatuses = (state) => state.meta.onlineStatuses

export const metaReducer = metaSlice.reducer
export const metaActions = metaSlice.actions
