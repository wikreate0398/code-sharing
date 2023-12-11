'use client'

import { notFound, useParams, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectPeriod, selectUser } from '@/redux/slices/meta.slice'
import { useLazyGetParticipantProjectsQuery } from '@/redux/api/participant.api'
import { useCallback, useEffect, useRef, useState } from 'react'
import Inner from '@/components/ui/inner'
import Header from '@/components/screens/dashboard/project/participant/_components/header'
import Activity from '@/components/screens/dashboard/_components/activity'
import { TabItem, Tabs } from '@/components/ui/tabs'
import AnalyticValue from '@/components/ui/analytic-value'
import {
    average,
    empty,
    flexStartProps,
    minToAnalyticFormat,
    objValues,
    pluck,
    priceString,
    roundSecToMin
} from '@/helpers/functions'
import AnalyticsContainer from '@/components/screens/dashboard/project/_components/analytics-container'
import ProjectAvatar from '@/components/ui/project-avatar'
import { Box } from '@mui/material'

const ParticipantStatistics = () => {
    const { login = null } = useParams()
    const authUser = useSelector(selectUser)
    const period = useSelector(selectPeriod)
    const query = useSearchParams()
    const [tab, setTab] = useState(null)
    const refActivity = useRef(null)

    const [trigger, result] = useLazyGetParticipantProjectsQuery({ login })

    useEffect(() => {
        if (period) {
            setTab(null)
            trigger({ login, ...period })
        }
    }, [login, period])

    const handleClick = useCallback(
        (id_project) => {
            if (id_project !== tab) {
                refActivity.current.setDay(null)
                setTab(id_project)
            }
        },
        [refActivity, setTab, tab]
    )

    if (result?.isError) notFound()
    if (
        (result.status === 'fulfilled' && empty(result?.data)) ||
        empty(result.data)
    )
        return null

    const { user, analytics, worked_days } = result.data

    return (
        <Inner back={query.get('back') ?? false}>
            <Header user={user} worked_days={worked_days} />

            <Tabs>
                <TabItem active={!tab} onClick={() => handleClick(null)}>
                    All
                </TabItem>
                {analytics.map(({ id_project, project }) => {
                    return (
                        <TabItem
                            key={id_project}
                            active={id_project === tab}
                            onClick={() => handleClick(id_project)}
                        >
                            <Box {...flexStartProps('center')} gap="5px">
                                <ProjectAvatar
                                    bg={project.bg}
                                    r={4}
                                    size={12}
                                    name={project?.name}
                                />{' '}
                                {project.name}
                            </Box>
                        </TabItem>
                    )
                })}
            </Tabs>

            <Analytics
                analytics={
                    tab
                        ? analytics.filter(
                              ({ id_project }) => id_project === tab
                          )
                        : analytics
                }
                id_project={tab}
                isParticipant={login === authUser.login}
            />

            <Activity ref={refActivity} id_project={tab} login={login} />
        </Inner>
    )
}

const Analytics = ({ analytics, id_project = null, isParticipant = false }) => {
    let totalMinutes = 0
    let purchasePrice = 0
    objValues(analytics).forEach(({ total_purchase, worked_time }) => {
        totalMinutes += roundSecToMin(worked_time)
        purchasePrice += total_purchase
    })

    const hourly_price = !id_project
        ? average(pluck(analytics, 'hourly_price'))
        : analytics.find((v) => v.id_project === id_project).hourly_price

    const sell_price = !id_project
        ? average(pluck(analytics, 'sell_price'))
        : analytics.find((v) => v.id_project === id_project).sell_price

    return (
        <AnalyticsContainer>
            <AnalyticValue
                {...minToAnalyticFormat(totalMinutes)}
                symbolSize={20}
                label="Worked time"
            />

            <AnalyticValue
                value={priceString(purchasePrice)}
                symbol="$"
                symbolSize={20}
                label="Need to pay"
            />

            <AnalyticValue
                value={priceString(hourly_price, 1)}
                symbol="$"
                symbolSize={20}
                label="Hourly Rate"
            />

            {!isParticipant && (
                <AnalyticValue
                    value={priceString(sell_price, 1)}
                    symbol="$"
                    label="Sell Price"
                />
            )}
        </AnalyticsContainer>
    )
}

export default ParticipantStatistics
