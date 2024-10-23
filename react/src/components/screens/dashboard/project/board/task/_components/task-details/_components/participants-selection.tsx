import { Chip, Box, styled, Typography } from '@mui/material'
import {
    empty,
    flexStartProps,
    isFnc,
    minutesToFullTime,
    objKeys,
    pluck,
    roundSecToMin
} from '#root/src/helpers/functions'
import Stack from '@mui/material/Stack'
import Avatar from '#root/src/components/ui/avatar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '#root/src/components/ui/svg-icons/icons/close-icon'
import TimerIcon from '#root/src/components/ui/svg-icons/icons/timer-icon'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { useProjectContext } from '#root/src/providers/project-provider'
import { useTimerController } from '#root/src/hooks/useTimerController'
import useTaskDetailsController
    from '#root/src/components/screens/dashboard/project/board/task/_components/task-details/_hooks/useTaskDetailsController'
import { useLazyGetTaskTrackingTimeGqlQuery } from '#root/src/redux/api/traking.api'
import _ from 'lodash'
import CustomAutocomplete from '#root/src/components/ui/custom-autocomplete'
import InputSelector
    from '#root/src/components/screens/dashboard/project/board/task/_components/task-details/_components/input-selector'
import UserIcon from '#root/src/components/ui/svg-icons/icons/user-icon'
import { ParticipantsProps } from '#root/src/types/User'
import ArrowDown from '#root/src/components/ui/svg-icons/icons/arrow-down'
import classNames from 'classnames'

interface Props {
    id_task: number
    task_participants: ParticipantsProps[]
}

const TimerChip = styled(Chip)(() => ({
    '&.MuiChip-root': {
        height: '18px',
        '& .MuiChip-label': {
            paddingLeft: '4px',
            paddingRight: '4px',
            ...flexStartProps('center'),
            gap: '3px',

            '& svg': {
                width: '9px'
            }
        }
    }
}))

const ParticipantOptionItem = ({ option, isSelected, onDelete, time }) => {
    const { avatar, name, persistent } = option || {}

    const color = isSelected ? '#333' : '#9499A4'

    return (
        <Stack
            flexDirection="row"
            alignItems="center"
            sx={{
                color,
                borderRadius: '4px',
                minHeight: 'auto',
                padding: 0
            }}
        >
            {'avatar' in option && (
                <Avatar
                    src={avatar}
                    name={name}
                    showName={Boolean(name)}
                    nameWidth={100}
                    pointer
                    size={18}
                    sx={{
                        borderRadius: 6,
                    }}
                />
            )}

            {(onDelete && !persistent && isSelected) && (
                <IconButton
                    onClick={onDelete}
                    size="small"
                    sx={{ padding: '2px' }}
                >
                    <CloseIcon size={12} />
                </IconButton>
            )}

            {(!isFnc(onDelete) && Boolean(time)) && (
                <TimerChip size="small" variant={`${isSelected ? 'blue' : 'neutral'}`} sx={{marginLeft: '4px'}} label={(
                    <>
                        <TimerIcon {...(isSelected ? {color: '#4260F2'} : {})} /> {minutesToFullTime(roundSecToMin(time.worked_time))}
                    </>
                )} />
            )}
        </Stack>
    )
}

const ParticipantsSelection = memo(({id_task, task_participants}: Props) => {
    const {isTaskTracking} = useProjectContext()
    const {timer} = useTimerController()

    const savedParticipantsIds = pluck(task_participants, 'id').map(String)

    const {
        updateTask,
        participantsList = []
    } = useTaskDetailsController()

    const [trigger, result] = useLazyGetTaskTrackingTimeGqlQuery()

    useEffect(() => {
        if (isTaskTracking) trigger(id_task)
    }, [isTaskTracking, timer])

    const {data: participantsTrackingTimes = []} = result

    let trackingTimeData = []
    if (!empty(participantsTrackingTimes) && isTaskTracking) {
        trackingTimeData = _.keyBy(
            participantsTrackingTimes.filter((v) => roundSecToMin(v.worked_time) > 0),
            'id_user'
        )
    }

    const totalWorkedMin = useMemo(() =>
        roundSecToMin(_.sumBy(participantsTrackingTimes || [], (v) => v.worked_time)), [participantsTrackingTimes]
    )

    const { items, deleted: deletedParticipantsIds } = useMemo(() => {
        const ids = pluck(participantsList, 'id')
        const deleted = []
        const items = [...participantsList];
        participantsTrackingTimes.map(({user}) => {
            if (!ids.includes(user.id)) {
                deleted.push(user.id)
                items.push({id: String(user.id), name: user.name, avatar: user.avatar_url})
            }
        })

        return {items, deleted}
    }, [participantsList, participantsTrackingTimes])

    return (
        <CustomAutocomplete
            selectable
            multiple
            disableClearable
            deleteOnOpen
            defaultTags={objKeys(trackingTimeData)}
            filterItems={(items) => {
                return items.filter((v) => !deletedParticipantsIds.includes(v.id))
            }}
            items={items || []}
            values={savedParticipantsIds}
            handleChange={(ids) => {
                updateTask({ id: id_task, participants: ids })
            }}
            renderInput={InputSelector}
            renderTags={(selectedParticipants = [], getTagProps, open) => {
                return <RenderTags getTagProps={getTagProps}
                                   selectedParticipants={selectedParticipants}
                                   deletedParticipantsIds={deletedParticipantsIds}
                                   trackingTimeData={trackingTimeData}
                                   savedParticipantsIds={savedParticipantsIds}
                                   openDropdown={open}/>

            }}
            inputProps={{
                title: 'ИСПОЛНИТЕЛЬ',
                rightTitle: isTaskTracking ? minutesToFullTime(totalWorkedMin) : null,
                placeholder: empty(savedParticipantsIds) ? 'Назначить' : null,
                startAdornment: <UserIcon />
            }}
        />
    )
})

const RenderTags = ({
    getTagProps,
    selectedParticipants,
    deletedParticipantsIds,
    trackingTimeData,
    savedParticipantsIds,
    openDropdown
}) => {
    const [show, setShow] = useState(false)

    const items = []
    selectedParticipants.forEach((option) => {
        items.push({
            ...option,
            time: trackingTimeData?.[option.id]?.worked_time || 0,
            isSelected: savedParticipantsIds.includes(option.id) && !deletedParticipantsIds.includes(option.id)
        })
    })

    const hasHideElements = items.findIndex((v) => !v.isSelected) !== -1

    return (
        <>
            {(openDropdown ? items : _.orderBy((show ? items : items.filter((v) => v.isSelected)), ['isSelected', 'time'], ['desc', 'desc'])).map((option, index) => {
                const tagProps = getTagProps({ index })
                return (
                    <ParticipantOptionItem
                        key={option.id}
                        option={option}
                        isSelected={option.isSelected}
                        time={trackingTimeData?.[option.id]}
                        {...(openDropdown ? {onDelete: tagProps.onDelete} : {})}
                    />
                )
            })}
            {!openDropdown && hasHideElements && <ShowMore onClick={() => setShow(!show)} show={show}/>}
        </>
    )
}

const ShowMoreComponent = styled(Typography)(() => ({
    ...flexStartProps('center'),
    cursor: 'pointer',
    '& svg': {
        height: '12px'
    },

    '&.show svg': {
        transform: 'rotate(180deg) !important'
    }
}))

const ShowMore = ({onClick, show}) => {
    return (
        <ShowMoreComponent variant="small-gray"
                           className={classNames('', {show})}
                    onClick={onClick}
                    data-prevent-click={true}>
            {show ? 'Скрыть' : 'Все'} <ArrowDown />
        </ShowMoreComponent>
    )
}

export default ParticipantsSelection