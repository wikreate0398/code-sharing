'use client'

import { Box, Button, Popover, Stack, Typography } from '@mui/material'
import { empty, flexStartProps, spaceBetweenProps } from '@/helpers/functions'
import { useSelector } from 'react-redux'
import { usePathname, useRouter } from 'next/navigation'
import { makeStyles, withStyles } from '@mui/styles'
import Link from 'next/link'
import Avatar from '@/components/ui/avatar'
import {
    cashboxRoute,
    participantStatisticRoute,
    projectsRoute
} from '@/config/routes'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'
import StatsIcon from '@/components/ui/svg-icons/icons/stats-icon'
import WalletIcon from '@/components/ui/svg-icons/icons/wallet-icon'
import HomeIcon from '@/components/ui/svg-icons/icons/home-icon'
import React from 'react'

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
                        push(`${participantStatisticRoute()}?back=${pathname}`)
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

                <Link href={`${cashboxRoute()}?back=${pathname}`}>
                    <WalletIcon
                        hoverColor="#000"
                        isActive={pathname.includes('cashbox')}
                        pointer
                        width={14}
                        height={14}
                    />
                </Link>
            </Box>

            <UserInfo />
        </Box>
    )
})

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
        borderTop: '1px solid #C2CCD6',
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
                                pointer
                                src={avatar_url}
                                {...bindTrigger(popupState)}
                            />

                            <Popover
                                {...bindPopover(popupState)}
                                isOpen={true}
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
                                                redirectTo('/dashboard/user')
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
