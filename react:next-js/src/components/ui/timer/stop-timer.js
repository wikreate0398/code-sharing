import { Box, Button } from '@mui/material'
import { styled } from '@mui/styles'
import Icon from '@/components/ui/icon'
import { useParams } from 'next/navigation'
import { useTimerController } from '@/hooks/useTimerController'
import useCounterController from '@/hooks/useCounterController'

const background = `linear-gradient(276.56deg, #48C64B 0%, #C4EB73 104.53%)`

const StopTimerButton = styled(Button)(() => ({
    '&.MuiButtonBase-root': {
        background,
        borderRadius: '12px',
        padding: '10px',
        width: '145px',
        minWidth: 'auto',
        position: 'fixed',
        left: 0,
        right: 0,
        margin: 'auto',
        bottom: '40px',
        color: '#fff',
        zIndex: 11,
        fontSize: '16px',
        fontWeight: 600,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px',
        cursor: 'default',
        '&:hover': {
            background
        },

        '& .stop': {
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            width: '36px',
            height: '36px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer'
        },

        '& .counter': {
            fontWeight: 600,
            fontSize: '16px'
        }
    }
}))

const StopTimer = () => {
    const { timerByProject, timer, onStopTimer } = useTimerController()
    const { id_project } = useParams()

    if (!(id_project in timer)) return null

    return (
        <StopTimerButton>
            <Box className="stop" onClick={onStopTimer}>
                <Icon name="stop" pointer width={11} height={14} />
            </Box>{' '}
            <Counter data={timerByProject} />
        </StopTimerButton>
    )
}

export const Counter = ({ data }) => {
    const { seconds, hours, minutes, isStopped } = useCounterController(data)

    if (isStopped) return null

    return (
        <Box className="counter">
            {hours}:{minutes}:{seconds}
        </Box>
    )
}

export default StopTimer
