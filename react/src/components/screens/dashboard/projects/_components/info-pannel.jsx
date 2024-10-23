import React, { memo, useMemo } from 'react'
import { empty, flexStartProps, objValues } from '#root/src/helpers/functions'
import { Box, Stack, Typography } from '@mui/material'
import classNames from 'classnames'
import useStyles from '#root/src/components/screens/dashboard/projects/styles'
import TasksList from '#root/src/components/screens/dashboard/projects/_components/tasks-list'
import { useTimerController } from '#root/src/hooks/useTimerController'
import useCounterController from '#root/src/hooks/useCounterController'
import { useTheme } from '@mui/styles'

const InfoPannel = ({ tasks }) => {
    const classes = useStyles()
    const theme = useTheme()
    const length = tasks.length
    const hasTasks = !empty(tasks)

    return (
        <Stack
            className={classNames(
                classes.infoPannelWrapper,
                classes.infoPannel
            )}
        >
            <WorkingProgress />
            <Stack className={classNames(classes.tasksRoot)}>
                {hasTasks && (
                    <Box {...flexStartProps('center')} gap="8px" mb="16px">
                        <Typography className={classes.tasksRootText}>
                            Задачи на сегодня
                        </Typography>
                        <Typography className={classes.tasksAmount}>
                            {length}
                        </Typography>
                    </Box>
                )}

                {!hasTasks && (
                    <Typography
                        variant="subtitle-13"
                        color={theme.palette.neutral.black_50}
                        sx={{ margin: 'auto', textAlign: 'center' }}
                    >
                        Нет задач в назначенной колонке
                    </Typography>
                )}

                <TasksList tasks={tasks} />
            </Stack>
        </Stack>
    )
}

const WorkingProgress = () => {
    const classes = useStyles()

    return (
        <Stack className={classes.workingProgressRoot}>

                <HoursCounter />
            <Stack className={classes.workingProgress}>
                <Typography className={classes.progress}>~</Typography>
                <Typography className={classes.description}>
                    Задач сделано
                </Typography>
            </Stack>
        </Stack>
    )
}

const HoursCounter = memo(() => {
    const classes = useStyles()

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


    if (empty(timer)) return null

    return (
        <Stack className={classes.workingProgress}>
            <Typography className={classes.progress}>
                {hours || minutes || seconds
                    ? `${hours}:${minutes}:${seconds}`
                    : '00h 00m'}
            </Typography>

            <Typography className={classes.description}>
                Сегодня вы работали
            </Typography>
        </Stack>
    )
})

export default InfoPannel
