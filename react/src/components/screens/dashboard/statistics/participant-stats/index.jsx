import React from 'react'
import { useParams, useSearchParams } from '#root/renderer/hooks'
import { useSelector } from 'react-redux'
import { selectPeriod } from '#root/src/redux/slices/meta.slice'
import { useCallback, useEffect, useRef, useState } from 'react'
import Inner from '#root/src/components/ui/inner'
import Header from '#root/src/components/screens/dashboard/project/_components/header.jsx'
import Activity from '#root/src/components/screens/dashboard/_components/activity'
import { roundSecToMin } from '#root/src/helpers/functions'
import Stack from '@mui/material/Stack'
import useStyles from '#root/src/components/screens/dashboard/statistics/participant-stats/styles.ts'
import Filters from '#root/src/components/screens/dashboard/statistics/participant-stats/_components/filters.tsx'
import ActivityGraph from '#root/src/components/screens/dashboard/statistics/participant-stats/_components/activity-graph.tsx'
import CardWrapper from '#root/src/components/screens/dashboard/statistics/participant-stats/_components/card-wrapper'
import ActivityPerYear from '#root/src/components/screens/dashboard/statistics/participant-stats/_components/activity-per-year'
import { useGetUserByIdentifierQuery } from '#root/src/redux/api/user.api.js'
import { useLazyGetParticipantChartQuery } from '#root/src/redux/api/statistics.api'
import ContainerLoader from '#root/src/components/ui/loader/container-loader'
import TaskStats from '#root/src/components/screens/dashboard/statistics/participant-stats/_components/task-stats.jsx'
import _ from 'lodash';
import moment from "moment/moment.js";

const ParticipantStatistics = () => {
    const classes = useStyles()
    const { login = null } = useParams()
    const period = useSelector(selectPeriod)
    const query = useSearchParams()
    const [tab, setTab] = useState(null)
    const refActivity = useRef(null)

    const {
        data: user,
        isError: isErrorUser,
        isSuccess: isSuccessUser,
        isLoading: isLoadingUser
    } = useGetUserByIdentifierQuery({ identifier: login, withTrashed: true })

    const { linkedProjects } = user || {}

    const [triggerChart, resultChart] = useLazyGetParticipantChartQuery({
        login
    })

    const {
        isError: isErrorChart,
        isSuccess: isSuccessChart,
        isLoading: isLoadingChart,
        isFetching: isFetchingChart,
        data: chartData = []
    } = resultChart

    const isError = isErrorUser || isErrorChart,
        isSuccess = isSuccessUser || isSuccessChart,
        isLoading = isLoadingUser || isLoadingChart

    useEffect(() => {
        if (period) setTab(null)
    }, [period])

    useEffect(() => {
        if (period) {
            triggerChart({ login, id_project: tab, ...period })
        }
    }, [login, period, tab])

    const handleClick = useCallback(
        (id_project) => {
            if (id_project !== tab) {
                refActivity.current.setDay(null)
                setTab(id_project)
            }
        },
        [refActivity, setTab, tab]
    )

    if (isError || (isSuccess && !user)) {
        return null
    }

    if (!isSuccess || isLoading) return <ContainerLoader height={250} />

    const analytics = chartData?.reduce((acc, d) => [...acc, ...d.projects], [])

    const projectsWithAnalitics = analytics?.reduce((acc, current) => {
        let { id_project, worked_time = 0 } = current || {}

        let projectInfo = linkedProjects.find(
            (i) => Number(i.id) === Number(id_project)
        )

        let { name, bg: color } = projectInfo || {}
        let item = acc.get(id_project)

        if (item) {
            item.worked_time = item.worked_time + worked_time

            return acc
        }

        acc.set(id_project, {
            value: id_project,
            name,
            color,
            worked_time
        })

        return acc
    }, new Map())

    const allWorkedProjects = projectsWithAnalitics
        ? [...projectsWithAnalitics?.values()]
        : []

    const allLinkedProjects =
        linkedProjects?.map(({ id, name, bg }) => ({
            value: id,
            name: name,
            color: bg
        })) || []

    const allProjects = [...allLinkedProjects, { name: 'All', value: null }]

    const selectedProject =
        !tab || tab === 'all'
            ? 'All'
            : allProjects.find((i) => i.value === tab)?.name

    let totalMinutes = roundSecToMin(_.sumBy(chartData, 'worked_time') || 0)

    return (
        <Inner back={query.get('back') ?? false} className={classes.root}>
            <Header totalMinutes={totalMinutes} user={user} />

            <Filters
                allProjects={allProjects}
                selectedProject={selectedProject}
                handleSelectProject={handleClick}
            />

            <Stack className={classes.statsRoot}>
                <ActivityGraph
                    isFetchingChart={isFetchingChart}
                    projects={projectsWithAnalitics}
                    chartData={chartData}
                    totalMinutes={totalMinutes}
                />

                <TaskStats id_project={tab} id_user={parseInt(user.id)} {...period}/>

                <CardWrapper title="Логирование действий">
                    <Activity
                        ref={refActivity}
                        id_project={tab}
                        id_user={parseInt(user.id)}
                        login={login}
                    />
                </CardWrapper>

                <ActivityPerYear id_project={tab} login={login} />
            </Stack>
        </Inner>
    )
}

export default ParticipantStatistics
