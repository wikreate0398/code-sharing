import { useSelector } from 'react-redux'
import { selectTimer } from '#root/src/redux/slices/meta.slice'
import { useTimerTogglMutation } from '#root/src/redux/api/traking.api.js'
import { useCallback, useMemo } from 'react'
import { numberEq, objValues } from '#root/src/helpers/functions.js'

export const useTimerController = () => {
    const timer = useSelector(selectTimer)
    const [timerToggl] = useTimerTogglMutation()

    const activeTimer = useMemo(() => objValues(timer).find(({play}) => Boolean(play)), [timer])

    const isTimerRunning = useCallback((id_project, id_task = null) => {

        if (!activeTimer) return null

        const isProjectPlay = numberEq(activeTimer.id_project, id_project) && Boolean(activeTimer.play)

        if (Boolean(id_task)) {
            return isProjectPlay && numberEq(activeTimer.id_task, id_task)
        }

        return isProjectPlay
    }, [activeTimer])

    return {
        isTimerRunning,
        activeTimer,
        timer,
        onStopTimer: () => timerToggl({action: 'stop_timer'}),
        onStartTimer: (id_project, id_board, id_task) => timerToggl({action: 'start_timer', id_project, id_board, id_task})
    }
}
