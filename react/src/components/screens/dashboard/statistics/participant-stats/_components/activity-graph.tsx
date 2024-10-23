import React, {useMemo, useState} from 'react'
import ReactEcharts from 'echarts-for-react'
import Stack from '@mui/material/Stack'
import {Checkbox, FormControlLabel, Skeleton, Typography} from '@mui/material'
import {formatDuration, momentAdd, roundSecToMin} from '#root/src/helpers/functions'
import moment from 'moment/moment'
import useStyles from '#root/src/components/screens/dashboard/statistics/participant-stats/styles'
import { useSelector } from 'react-redux'
import { selectPeriod } from '#root/src/redux/slices/meta.slice'
import CardWrapper from '#root/src/components/screens/dashboard/statistics/participant-stats/_components/card-wrapper'
import {
    getStatsGraphChart,
    MIN_HEIGHT,
    roundChartStackBorders
} from '#root/src/components/screens/dashboard/statistics/participant-stats/_components/utils'

const ActivityGraph = ({
    projects: projectsMap,
    isFetchingChart,
    chartData,
    totalMinutes
}) => {

    const classes = useStyles()
    const [includeWeek, setIncludeWeek] = useState(true)

    const allProjects = projectsMap ? [...projectsMap?.values()] : []

    const period = useSelector(selectPeriod)
    const startDate = moment(period?.from)
    const endDate = moment(period?.to)
    let totalSelectedDays = endDate?.diff(startDate, 'days') + 1 || 0

    const totalWeekendDays = useMemo(() => {
        let weekDays = 0
        for (let i = 0; i <= totalSelectedDays; i++) {
            if ([6,0].includes(moment(startDate).add(i, 'days').day())) {
                weekDays ++
            }
        }
        return weekDays
    }, [startDate, totalSelectedDays])

    if (!includeWeek) {
        totalSelectedDays = totalSelectedDays - totalWeekendDays
    }

    const chartStats = useMemo(() => {
        let legend = []
        let chartProjects = new Map()

        if (!chartData || chartData.length === 0)
            return { legend, allProjects: [] }

        for (let d of chartData) {
            const { date, projects } = d
            let stack = moment(date).format('DD.MM')

            legend.push(stack)

            allProjects.forEach(({ value: id, name, color }) => {
                let projWithStats = projects.find(
                    ({ id_project }) => Number(id) === Number(id_project)
                )

                const { worked_time } = projWithStats || {}
                let val = worked_time
                    ? worked_time > 60 // there are some cases when the timer was started for some seconds and we need to get rid of such statistics
                        ? worked_time + MIN_HEIGHT
                        : '-'
                    : '-'

                if (chartProjects.has(name)) {
                    let e = chartProjects.get(name)
                    e.data = [...e.data, val]
                } else
                    chartProjects.set(name, {
                        data: [val],
                        name,
                        color,

                        // general settings
                        barMaxWidth: 32,
                        stack: 'a',
                        type: 'bar',
                        showBackground: false
                    })
            })
        }

        const series = Array.from(chartProjects.values())

        return {
            legend,
            allProjects: roundChartStackBorders(series)
        }
    }, [chartData, allProjects])

    const chart = getStatsGraphChart(chartStats)

    return (
        <CardWrapper
            title="Статистика активности"
            isAlert={!totalMinutes}
            alertMessage="Активность не обнаружена"
        >
            {!isFetchingChart ? (
                <ReactEcharts option={chart} style={{ height: 175 }} />
            ) : (
                <ChartLoading />
            )}

            <Stack flexDirection="row" mt="24px" gap="40px">
                <>
                    <Stack flexDirection="column" gap="6px">
                        <Typography className={classes.cardTitle}>
                            {formatDuration({
                                ammount: totalMinutes / (totalSelectedDays || 1),
                                type: 'minutes'
                            })}
                        </Typography>
                        <Typography className={classes.statsDescription}>
                            Средний рабочий день
                            <FormControlLabel control={<Checkbox size="small"
                                                                 checked={includeWeek}
                                                                 onChange={() => setIncludeWeek(!includeWeek)} />}
                                              label="(Включая выходные)" />
                        </Typography>
                    </Stack>

                    <Stack
                        gap="40px"
                        flexWrap="wrap"
                        flexDirection="row"
                        justifyContent="flex-end"
                        sx={{ flex: 1 }}
                    >
                        {allProjects.map(({ worked_time, name, color }, i) => {
                            if (parseInt(worked_time) < 60) return null
                            return (
                                <Stack key={i} flexDirection="column" gap="6px">
                                    <Typography className={classes.cardTitle}>
                                        {formatDuration({
                                            ammount: roundSecToMin(worked_time),
                                            type: 'minutes'
                                        })}
                                    </Typography>
                                    <Typography
                                        className={classes.statsDescription}
                                    >
                                        <div
                                            className="project-color"
                                            style={{
                                                backgroundColor: color
                                            }}
                                        />
                                        {name}
                                    </Typography>
                                </Stack>
                            )
                        })}
                    </Stack>
                </>
            </Stack>
        </CardWrapper>
    )
}

const ChartLoading = () => {
    return (
        <Stack
            sx={{ width: '100%', height: 175 }}
            flexDirection="row"
            gap="10px"
            alignItems="flex-end"
            justifyContent="center"
        >
            {Array.from({ length: 25 }).map((v, i) => {
                const n = Math.floor(Math.random() * 100)
                return (
                    <Skeleton
                        sx={{
                            width: 32,
                            height: `${n}%`,
                            transform: 'none'
                        }}
                        animation="pulse"
                    />
                )
            })}
        </Stack>
    )
}

export default ActivityGraph
