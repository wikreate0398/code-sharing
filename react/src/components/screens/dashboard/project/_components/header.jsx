import React from 'react'
import { Typography } from '@mui/material'
import {
    formatDuration,
    pluck
} from '#root/src/helpers/functions.js'
import Avatar from '#root/src/components/ui/avatar/index.jsx'
import { useIsOnline } from '#root/src/helpers/hooks.js'
import Stack from '@mui/material/Stack'
import { makeStyles } from '@mui/styles'
import TimerIcon from '#root/src/components/ui/svg-icons/icons/timer-icon.tsx'
import InProgressIcon from '#root/src/components/ui/svg-icons/icons/in-progress-icon.tsx'

const useStyles = makeStyles((theme) => ({
    userInfoRoot: {
        textAlign: 'center'
    },
    userInfo: {
        '& span': {
            color: '#9499A4'
        }
    }
}))

const Header = ({ user, totalMinutes }) => {
    const classes = useStyles()
    const isOnline = useIsOnline()
    const { name, login, skills } = user

    return (
        <Stack alignItems="center" gap="23px" mb="42px">
            <Avatar
                size={76}
                online={isOnline(user.id)}
                style={{
                    borderRadius: 24
                }}
            />
            <Stack
                flexDirection="column"
                gap="0"
                className={classes.userInfoRoot}
            >
                <Typography variant="title-32" mb="14px" component="h2">
                    {name}
                </Typography>
                <Stack
                    flexWrap="nowrap"
                    flexDirection="row"
                    justifyContent="center"
                    gap="8px"
                    mb="18px"
                    className={classes.userInfo}
                >
                    <Typography variant="subtitle-13">@{login}</Typography>

                    <Typography variant="subtitle-13">{`•`}</Typography>

                    <Typography variant="subtitle-13">
                        {pluck(skills, 'name').join(', ')}
                    </Typography>
                </Stack>
                <Stack
                    flexWrap="nowrap"
                    flexDirection="row"
                    justifyContent="center"
                    gap="17px"
                >
                    <Stack flexDirection="row" gap="5px">
                        <InProgressIcon />
                        <Typography variant="subtitle-15">120</Typography>
                    </Stack>

                    <Stack flexDirection="row" gap="5px">
                        <TimerIcon />
                        <Typography variant="subtitle-15">
                            {totalMinutes
                                ? formatDuration({ ammount: totalMinutes, type: 'minutes' })
                                : 0}
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default Header
