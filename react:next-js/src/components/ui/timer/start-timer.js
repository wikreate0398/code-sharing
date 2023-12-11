import { Button } from '@mui/material'
import { styled } from '@mui/styles'
import Icon from '@/components/ui/icon'
import { useTimerController } from '@/hooks/useTimerController'

const background = `linear-gradient(276.56deg, #48C64B 0%, #C4EB73 104.53%)`

const StartTimerButton = styled(Button)(() => ({
    '&.MuiButtonBase-root': {
        background,
        borderRadius: '12px',
        padding: '11px 0',
        width: '210px',
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
        gap: '10px',
        '&:hover': {
            background
        }
    }
}))

const StartTimer = () => {
    const { onStartTimer } = useTimerController()

    return (
        <StartTimerButton onClick={onStartTimer}>
            <Icon name="play" pointer width={12} height={14} /> Начать работу
        </StartTimerButton>
    )
}

export default StartTimer
