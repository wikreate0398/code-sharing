import React, { memo, useCallback, useState } from 'react'
import useStyles from '#root/src/components/screens/dashboard/project/board/task/styles'
import { useTheme } from '@mui/styles'
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state'
import Calendar from '#root/src/components/ui/svg-icons/icons/calendar'
import { Popover, PopoverOrigin, Typography } from '@mui/material'
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import InputSelector from '#root/src/components/screens/dashboard/project/board/task/_components/task-details/_components/input-selector'
import moment from 'moment/moment'
import { useUpdateTask } from '#root/src/components/screens/dashboard/project/board/task/hooks'
import { Moment } from 'moment'
import { Theme } from '@mui/system'

const anchorOrigin: PopoverOrigin = {
    vertical: 'bottom',
    horizontal: 'center'
}

const transformOrigin: PopoverOrigin = {
    vertical: 'top',
    horizontal: 'center'
}

interface Props {
    id: number
    deadline_at: null | Moment
}

const DatePicker = memo(({ id, deadline_at }: Props) => {
    const classes = useStyles()
    const theme: Theme = useTheme()
    const updateTask = useUpdateTask()

    const setValue = useCallback(
        (value) => {
            updateTask({ id, deadline_at: value })
        },
        [updateTask, id]
    )

    let date = deadline_at?.format('ddd, D MMMM')
    let time = deadline_at?.format('HH:mm')

    return (
        <PopupState
            variant="popover"
            popupId="user-settings-popup"
            disableAutoFocus={false}
        >
            {(popupState) => {
                return (
                    <>
                        <InputSelector
                            placeholder="Выбрать дату"
                            value={date}
                            title="ДЕДЛАЙН"
                            startAdornment={<Calendar />}
                            noBorder
                            endAdornment={
                                <Typography
                                    variant="subtitle-13"
                                    color={theme.palette.neutral[600]}
                                >
                                    {time || '00:00'}
                                </Typography>
                            }
                            {...bindTrigger(popupState)}
                        />

                        <Popover
                            {...bindPopover(popupState)}
                            anchorOrigin={anchorOrigin}
                            transformOrigin={transformOrigin}
                        >
                            <StaticDateTimePicker
                                className={classes.datePicker}
                                ampm={false}
                                minDate={moment()}
                                value={deadline_at}
                                viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock
                                }}
                                onClose={() => {
                                    popupState.close()
                                }}
                                onAccept={(v) => {
                                    setValue(v)
                                    popupState.close()
                                }}
                            />
                        </Popover>
                    </>
                )
            }}
        </PopupState>
    )
})

export default DatePicker
