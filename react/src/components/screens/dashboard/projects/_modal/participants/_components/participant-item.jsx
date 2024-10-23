import React from 'react'
import useStyles from '#root/src/components/screens/dashboard/projects/_modal/styles'
import { IconButton, Stack, Typography } from '@mui/material'
import classNames from 'classnames'
import Avatar from '#root/src/components/ui/avatar'
import Icon from '#root/src/components/ui/icon'

const ParticipantItem = ({ item, onSelect, onDelete, isSelected, sx }) => {
    const { name, login, avatar_url } = item
    const classes = useStyles()

    return (
        <Stack
            className={classNames(classes.participantBox, { isSelected })}
            onClick={onSelect}
            sx={sx}
        >
            <Avatar
                name={name}
                login={login}
                pointer
                src={avatar_url}
                size={36}
                sx={{
                    borderRadius: 12
                }}
            />
            <Stack className={classes.participantBoxInfo}>
                <Stack className={classes.participantBoxInner}>
                    <Typography
                        variant="subtitle-13"
                        className={classes.participantName}
                    >
                        {name || `@${login}`}
                    </Typography>
                    {name && (
                        <Typography className={classes.participantLogin}>
                            @{login}
                        </Typography>
                    )}
                </Stack>
                {onDelete && (
                    <IconButton onClick={onDelete}>
                        <Icon
                            name="delete-grey"
                            width={14}
                            height={16}
                            pointer
                            v2
                        />
                    </IconButton>
                )}
            </Stack>
        </Stack>
    )
}

export default ParticipantItem
