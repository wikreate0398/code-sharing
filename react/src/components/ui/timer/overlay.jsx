import { Box, Button } from '@mui/material'
import { makeStyles, styled } from '@mui/styles'
import StartTimer from '#root/src/components/ui/timer/start-timer'
import Icon from '#root/src/components/ui/icon'
import StopTimer from '#root/src/components/ui/timer/stop-timer'
import { useEffect } from 'react'
import { useTimerController } from '#root/src/hooks/useTimerController'

const useStyles = makeStyles(() => ({
    root: {
        position: 'absolute',
        display: 'flex',
        paddingTop: '170px',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(250, 250, 250, .5)',
        zIndex: 100,
        left: 0,
        top: '105px',
        overflow: 'hidden'
    },

    inner: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },

    title: {
        fontSize: '24px',
        fontWeight: 700,
        marginTop: '20px',
        textAlign: 'center',
        lineHeight: '30px'
    }
}))

const HourglassBtn = styled(Button)(() => ({
    '&.MuiButtonBase-root': {
        backgroundColor: '#30C76D',
        borderRadius: '16px',
        padding: '12px 15px',
        minWidth: 'auto',
        '&:hover': {
            backgroundColor: '#30C76D'
        }
    }
}))

const TimerOverlay = () => {
    const classes = useStyles()
    const { isTimerRunning } = useTimerController()

    useEffect(() => {
        if (!isTimerRunning) {
            document.body.style.overflow = 'hidden'
            window.scrollTo({ top: 0 })
        }

        return () => {
            document.body.style.overflow = 'scroll'
        }
    }, [isTimerRunning])

    if (isTimerRunning) return <StopTimer />

    return (
        <Box className={classes.root}>
            <Box className={classes.inner}>
                <HourglassBtn>
                    <Icon name="hourglass" width={20} height={26} />
                </HourglassBtn>

                <Box className={classes.title}>
                    Запустите таймер, <br /> чтобы продолжить работу
                </Box>
            </Box>
            <StartTimer />
        </Box>
    )
}

export default TimerOverlay
