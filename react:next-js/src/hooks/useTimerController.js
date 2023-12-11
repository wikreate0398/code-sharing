import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectTimer } from '@/redux/slices/meta.slice'
import { useTimerTogglMutation } from '@/redux/api/time.traking.api'
import { useMemo } from 'react'
import getOr from 'lodash/fp/getOr'

export const useTimerController = (customId = null) => {
    const { id_project } = useParams()
    const projectId = customId ?? id_project
    const timer = useSelector(selectTimer)
    const [timerToggl] = useTimerTogglMutation()

    const isTimerRunning = useMemo(
        () => timer?.[projectId]?.play,
        [timer, projectId]
    )

    const onToggleTimer =
        (action) =>
        (i = null) => {
            let customId = ['string', 'number'].includes(typeof i) ? i : null

            timerToggl({
                action,
                id_project: customId ?? projectId
            })
        }

    const timerByProject = getOr(null, [projectId], timer)

    return {
        isTimerRunning,
        timerByProject,
        timer,
        onStopTimer: onToggleTimer('stop_timer'),
        onStartTimer: onToggleTimer('start_timer')
    }
}
