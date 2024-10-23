import React, { memo, useEffect, useMemo, useState } from 'react'
import CardWrapper from '#root/src/components/screens/dashboard/statistics/participant-stats/_components/card-wrapper'
import ActivityCalendar from 'react-activity-calendar'
import moment from 'moment'
import { Alert, Box, Tooltip, Typography } from '@mui/material'
import 'moment/locale/ru'
import { makeStyles } from '@mui/styles'
import {
    useLazyGetActivityYearsQuery,
    useLazyGetAnnualActivityQuery
} from '#root/src/redux/api/statistics.api'
import {
    empty,
    formatDuration,
    roundSecToMin
} from '#root/src/helpers/functions'
import DropDown from '#root/src/components/ui/dropdown'
import Stack from '@mui/material/Stack'
import 'moment/locale/ro'
import _ from 'lodash'

const formatDateToISO = (date: Date): string => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')

    return `${yyyy}-${mm}-${dd}`
}

const useStyles = makeStyles((theme) => ({
    root: {
        '& text': {
            fontSize: 10,
            color: 'rgba(158, 162, 178, 1)'
        }
    },
    tooltip: {
        background: '#fff',
        border: '1.5px solid #000',
        color: '#62646C',
        fontSize: 18
    }
}))

interface ActivityPerYearProps {
    id_project: number | string
    login: string
}

const prepareChartData = (data, year) => {
    if (empty(data)) return []

    const days = []

    for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(Number(year), month + 1, 0).getDate()
        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(Number(year), month, day)

            const date = formatDateToISO(dateObj)
            const relatedInfo = data?.find((i) => i.date === date)
            const { projects = [], count } = relatedInfo || {}

            const getLevel = (time) => {
                if (time < 7200) return 1
                if (time < 14400) return 2
                if (time < 25200) return 3
                if (time > 25200) return 4
            }

            const formattedDay = {
                date,
                count,
                level: getLevel(count) || 0,
                projects
            }
            days.push(formattedDay)
        }
    }

    return days
}

const ActivityPerYear = memo(({ id_project, login }: ActivityPerYearProps) => {
    const classes = useStyles()

    const [trigger, { data, isLoading, isSuccess }] =
        useLazyGetAnnualActivityQuery()

    const [
        triggerFetchYears,
        { data: years = [], isSuccess: isSuccessYearsReq }
    ] = useLazyGetActivityYearsQuery()

    const [year, setYear] = useState(null) //moment().format('YYYY')

    useEffect(() => {
        if (!year) return

        trigger({
            id_project: id_project !== 'all' ? id_project : null,
            login,
            year
        })
    }, [id_project, login, year])

    useEffect(() => {
        triggerFetchYears({
            id_project: id_project !== 'all' ? id_project : null,
            login
        }).then(({ data }) => {
            setYear(!empty(data) ? _.last(data) : null)
        })

        return () => {
            setYear(null)
        }
    }, [id_project])

    const chartData = useMemo(() => prepareChartData(data, year), [data, year])

    return (
        <CardWrapper
            title="Активность за год"
            rightSide={() => {
                if (!isSuccessYearsReq || empty(years)) return null

                return (
                    <DropDown
                        selected={String(year)}
                        propsChildren={{ style: { flex: 1 } }}
                        data={years.map((v) => ({
                            name: String(v),
                            value: String(v)
                        }))}
                        onSelect={setYear}
                    />
                )
            }}
        >
            {chartData?.length > 0 ? (
                <Box className={classes.root}>
                    <ActivityCalendar
                        data={[...chartData]}
                        hideColorLegend
                        showWeekdayLabels
                        hideTotalCount
                        fontSize={9}
                        blockSize={11}
                        blockRadius={2}
                        blockMargin={3}
                        labels={{
                            months: [
                                'Янв',
                                'Фев',
                                'Мар',
                                'Апр',
                                'Май',
                                'Ию',
                                'Июл',
                                'Авг',
                                'Сен',
                                'Окт',
                                'Ноя',
                                'Дек'
                            ],
                            weekdays: ['Сб', 'Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт']
                        }}
                        theme={{
                            light: [
                                'rgba(243, 244, 247, 1)',
                                'rgba(66, 96, 242, 1)'
                            ],
                            dark: [
                                'rgba(243, 244, 247, 1)',
                                'rgba(66, 96, 242, 1)'
                            ]
                        }}
                        renderBlock={(block, activity) => {
                            const {
                                count,
                                date,
                                // @ts-ignore
                                projects = []
                            } = activity || {}
                            const time = formatDuration({
                                ammount: roundSecToMin(count),
                                type: 'minutes'
                            })

                            if (!count) return block

                            return (
                                <Tooltip
                                    disableInteractive
                                    classes={{ tooltip: classes.tooltip }}
                                    title={(
                                        <Stack flexDirection="column">
                                            <Box component="p">
                                                {moment(date)
                                                    .locale('ru')
                                                    .format('dd D MMM yy')}{' '}
                                                - {time}{' '}
                                            </Box>
                                            {projects.map(
                                                ({ id, name, worked_time }) => {
                                                    return (
                                                        <Box component="p" key={id}>
                                                            {name}{' '}
                                                            <b>
                                                                {formatDuration({
                                                                    ammount: roundSecToMin(
                                                                        worked_time
                                                                    ),
                                                                    type: 'minutes'
                                                                })}
                                                            </b>
                                                        </Box>
                                                    )
                                                }
                                            )}
                                        </Stack>
                                    )}
                                >
                                    {block}
                                </Tooltip>
                            )
                        }}
                    />
                </Box>
            ) : (
                <Alert severity="info" sx={{ width: '100%' }}>
                    Активность не обнаружена
                </Alert>
            )}
        </CardWrapper>
    )
})

export default ActivityPerYear
