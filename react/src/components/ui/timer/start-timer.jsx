import Icon from '#root/src/components/ui/icon'
import { useTimerController } from '#root/src/hooks/useTimerController'
import StartStopTimerButton from '#root/src/components/ui/timer/button.js'

const StartTimer = ({id_project, id_board, id_task}) => {
    const { onStartTimer } = useTimerController()

    return (
        <StartStopTimerButton onClick={() => onStartTimer(id_project, id_board, id_task)}>
            Начать работу <Icon name="play" pointer width={7} height={8} />
        </StartStopTimerButton>
    )
}

export default StartTimer
