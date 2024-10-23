import React from 'react'
import useStyles from '#root/src/components/screens/dashboard/projects/_modal/styles'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Stack, Typography } from '@mui/material'
import classNames from 'classnames'
import Icon from '#root/src/components/ui/icon'
import { declination } from '#root/src/helpers/functions'

const BoardItem = ({ item, sx, onSelect, isSelected }) => {
    const classes = useStyles()

    const { id, name, participants_count, private: isPrivate } = item || {}

    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id
    })

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 999 : 'unset',
        position: 'relative'
    }

    return (
        <Stack
            className={classNames(classes.participantBox, { isSelected })}
            onClick={onSelect}
            sx={sx}
            ref={setNodeRef}
            style={style}
        >
            <Icon
                ref={setActivatorNodeRef}
                {...listeners}
                {...attributes}
                name="handle_grey"
                width={35}
                height={14}
                pointer
                v2
            />

            <Stack className={classNames(classes.participantBoxInfo, 'column')}>
                <Typography
                    variant="subtitle-13"
                    className={classes.participantName}
                >
                    {name}
                </Typography>
                {participants_count && isPrivate ? (
                    <Typography className={classes.participantLogin}>
                        {participants_count}{' '}
                        {declination(
                            participants_count,
                            'участник',
                            'участника',
                            'участников'
                        )}
                    </Typography>
                ) : null}
            </Stack>
        </Stack>
    )
}

export default BoardItem
