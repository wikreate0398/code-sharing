
import { Box, Button, Popover, Stack, Typography } from '@mui/material'
import { empty, flexStartProps, numberEq, spaceBetweenProps } from '#root/src/helpers/functions'
import { useSelector } from 'react-redux'
import { usePathname, useRouter, useSearchParams } from '#root/renderer/hooks'
import { makeStyles, withStyles } from '@mui/styles'
import Link from '#root/src/components/ui/link'
import Avatar from '#root/src/components/ui/avatar'
import {
    cashboxRoute,
    participantStatisticRoute,
    projectsRoute
} from '#root/src/config/routes'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'
import StatsIcon from '#root/src/components/ui/svg-icons/icons/stats-icon'
import WalletIcon from '#root/src/components/ui/svg-icons/icons/wallet-icon'
import HomeIcon from '#root/src/components/ui/svg-icons/icons/home-icon'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { useTimerController } from '#root/src/hooks/useTimerController.js'
import StopTimer from '#root/src/components/ui/timer/stop-timer.jsx'

const styles = {
    root: {
        background: 'rgba(241, 243, 244, 1)',
        borderRadius: '12px',
        padding: '9px 20px'
    },

    left: {
        ...flexStartProps(),
        '& a': {
            borderLeft: '1px solid rgba(0,0,0,.12)',
            padding: '0 15px',
            lineHeight: '13px',

            '&:first-of-type': {
                borderLeft: 'none',
                paddingLeft: 0
            }
        }
    }
}

const Header = withStyles(styles)(({ classes }) => {
    const { push } = useRouter()
    const pathname = usePathname()

    return (
        <Box className={classes.root} {...spaceBetweenProps()}>
            <Box className={classes.left}>
                <Link href={projectsRoute()}>
                    <HomeIcon
                        hoverColor="#000"
                        isActive={pathname === '/dashboard/projects'}
                        pointer
                        width={14}
                        height={14}
                    />
                </Link>
                <Box
                    component="a"
                    onClick={() => {
                        const route = participantStatisticRoute()
                        if (route !== pathname) {
                            push(withBack(route, pathname))
                        }
                    }}
                >
                    <StatsIcon
                        hoverColor="#000"
                        isActive={pathname.includes('stats')}
                        pointer
                        width={14}
                        height={14}
                    />
                </Box>

                <Box
                    component="a"
                    onClick={() => {
                        const route = cashboxRoute()
                        if (route !== pathname) push(withBack(route, pathname))
                    }}
                >
                    <WalletIcon
                        hoverColor="#000"
                        isActive={pathname.includes('cashbox')}
                        pointer
                        width={14}
                        height={14}
                    />
                </Box>
            </Box>

            <Box {...flexStartProps('center')} gap="10px">
                <Timer />
                <UserInfo />
            </Box>
        </Box>
    )
})

const Timer = memo(() => {
    const pathname = usePathname()
    if (pathname.startsWith('/dashboard/p/')) return null

    return  <StopTimer withTaskName inTooltip sm />
})

const withBack = (route, pathname) => {
    if (route === pathname) return route
    return `${route}?back=${pathname}`
}

const useStyles = makeStyles((theme) => ({
    popupRoot: {
        width: 200,
        marginTop: '15px',
        overflow: 'unset',
        padding: '24px 24px 13px',
        border: '1px solid #F3F4F6',
        boxShadow: '0px 1.411300778388977px 2.2138051986694336px 0px #00000002'
    },
    rootPopup: {
        position: 'relative',
        alignItems: 'center'
    },
    triangle: {
        position: 'absolute',
        width: 0,
        height: 0,
        border: '14px solid transparent',
        borderTop: 0,
        borderBottom: '8px solid white',
        borderRadius: '3px',

        top: -23,
        right: 0,
        // left: 0,
        margin: '0 auto'
    },
    login: {
        fontSize: '13px',
        fontWeight: 500,
        lineHeight: '15px',
        color: '#000'
    },
    email: {
        fontSize: '12px',
        lineHeight: '15px',
        color: '#848484'
    },
    buttons: {
        width: '100%',
        borderTop: '1px solid rgba(194, 204, 214, .4)',
        marginTop: '18px',
        paddingTop: '13px',
        gap: '4px'
    }
}))

const anchorOrigin = {
        vertical: 'bottom',
        horizontal: 'center'
    },
    transformOrigin = {
        vertical: 'top',
        horizontal: 'center'
    }

const UserInfo = () => {
    const classes = useStyles()
    const user = useSelector((state) => state.meta.user)
    const router = useRouter()

    if (empty(user)) return null

    const { name, avatar_url, login, email } = user || {}

    return (
        <Box {...flexStartProps()} alignItems="center" gap="12px">
            <Typography variant="small-gray">{user.name}</Typography>
            <PopupState variant="popover" popupId="user-settings-popup">
                {(popupState) => {
                    const redirectTo = (p) => {
                        router.push(p)
                        popupState.close()
                    }

                    return (
                        <>
                            <Avatar
                                name={name}
                                login={login}
                                pointer
                                src={avatar_url}
                                {...bindTrigger(popupState)}
                            />

                            <Popover
                                {...bindPopover(popupState)}
                                anchorOrigin={anchorOrigin}
                                transformOrigin={transformOrigin}
                                classes={{
                                    paper: classes.popupRoot
                                }}
                            >
                                <Stack className={classes.rootPopup}>
                                    <div className={classes.triangle} />
                                    <Avatar
                                        src={avatar_url}
                                        pointer
                                        size={54}
                                        sx={{ marginBottom: '12px' }}
                                    />
                                    <Typography
                                        className={classes.login}
                                        sx={{ marginBottom: '5px' }}
                                    >
                                        {login}
                                    </Typography>
                                    <Typography className={classes.email}>
                                        {email}
                                    </Typography>
                                    <Stack className={classes.buttons}>
                                        <Button
                                            onClick={() =>
                                                redirectTo('/dashboard/profile')
                                            }
                                        >
                                            <Typography
                                                className={classes.login}
                                            >
                                                Настройки
                                            </Typography>
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                redirectTo('/auth/logout')
                                            }
                                        >
                                            <Typography
                                                className={classes.login}
                                            >
                                                Выйти
                                            </Typography>
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Popover>
                        </>
                    )
                }}
            </PopupState>
        </Box>
    )
}

export default Header
