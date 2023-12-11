import React, { useMemo } from 'react'
import { flexStartProps, objValues, roundSecToMin } from '@/helpers/functions'
import { Box, Stack, Typography } from '@mui/material'
import classNames from 'classnames'
import useStyles from '@/components/screens/dashboard/projects/styles'
import TasksList from '@/components/screens/dashboard/projects/_components/tasks-list'
import { useTimerController } from '@/hooks/useTimerController'
import useCounterController from '@/hooks/useCounterController'

const InfoPannel = () => {
    const s = useStyles()

    const { timer } = useTimerController()

    const [projectId, currentWorkingProj] =
        Object.entries(timer)?.find(([_, v]) => v.play) || []

    const totalWorkingTime = useMemo(() => {
        let totalMinutes = 0

        objValues(timer).forEach(({ worked_time }) => {
            totalMinutes += worked_time
        })

        return {
            last_launch: currentWorkingProj?.last_launch,
            play: Boolean(projectId),
            worked_time: totalMinutes
        }
    }, [currentWorkingProj?.last_launch, projectId, timer])

    const { seconds, hours, minutes } = useCounterController(totalWorkingTime)

    return (
        <Stack className={classNames(s.infoPannelWrapper, s.infoPannel)}>
            <Stack className={s.workingProgressRoot}>
                <Stack className={s.workingProgress}>
                    <Typography className={s.progress}>
                        {hours || minutes || seconds
                            ? `${hours}:${minutes}:${seconds}`
                            : '00h 00m'}
                    </Typography>
                    <Typography className={s.description}>
                        Сегодня вы работали
                    </Typography>
                </Stack>
                <Stack className={s.workingProgress}>
                    <Typography className={s.progress}>~</Typography>
                    <Typography className={s.description}>
                        Задач сделано
                    </Typography>
                </Stack>
            </Stack>
            <Stack className={s.tasksRoot}>
                <Box {...flexStartProps('center')} gap="8px" mb="16px">
                    <Typography className={s.tasksRootText}>
                        Задачи на сегодня
                    </Typography>
                    <Typography className={s.tasksAmount}>2</Typography>
                </Box>

                <TasksList />
            </Stack>
        </Stack>
    )
}

export default InfoPannel
