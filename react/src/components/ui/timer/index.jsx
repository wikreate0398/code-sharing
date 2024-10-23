import TimerOverlay from '#root/src/components/ui/timer/overlay'
import { useTimerController } from '#root/src/hooks/useTimerController.js'
import StopTimer from '#root/src/components/ui/timer/stop-timer.jsx'
import StartTimer from '#root/src/components/ui/timer/start-timer.jsx'

export { TimerOverlay }

const Timer = ({id_project = null, id_board = null, id_task = null}) => {
    const {isTimerRunning} = useTimerController()

    if (isTimerRunning(id_project, id_task)) {
        return <StopTimer />
    }

    return <StartTimer id_project={id_project} id_board={id_board} id_task={id_task}/>
}

export default Timer