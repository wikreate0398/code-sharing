'use client'

import React, { useEffect } from 'react'
import Inner from '@/components/ui/inner'
import DateRangePicker from '@/components/ui/datepicker'
import { useSelector } from 'react-redux'
import { selectPeriod, selectUser } from '@/redux/slices/meta.slice'
import { useActions } from '@/helpers/hooks'
import { Box, Typography } from '@mui/material'
import { useLazyGetAllParticipantsStatsQuery } from '@/redux/api/participant.api'
import { notFound, useRouter, useSearchParams } from 'next/navigation'
import Analytics from '@/components/screens/dashboard/statistics/_components/analytics'
import { empty, objectToQueryStr, spaceBetweenProps } from '@/helpers/functions'
import ParticipantsList from '@/components/screens/dashboard/statistics/_components/participants-list'
import { participantStatisticRoute } from '@/config/routes'

const ParticipantsStatistics = () => {
    const period = useSelector(selectPeriod)
    const { setPeriodAction } = useActions()
    const user = useSelector(selectUser)
    const { push } = useRouter()
    const query = useSearchParams()
    const [trigger, result] = useLazyGetAllParticipantsStatsQuery()

    useEffect(() => {
        if (period) trigger(period)
    }, [period])

    useEffect(() => {
        if (result.status === 'fulfilled' && empty(result.data)) {
            const queryStr = objectToQueryStr({ back: query.get('back') })
            push(`${participantStatisticRoute(user.login)}?` + queryStr)
        }
    }, [result])

    if (result?.isError) notFound()
    if (
        (result.status === 'fulfilled' && empty(result?.data)) ||
        empty(result.data)
    )
        return null

    const { from, to } = period
    const data = result.data

    return (
        <Inner back={query.get('back') ?? false}>
            <Box {...spaceBetweenProps()} mb="50px">
                <Typography variant="title-24">All Members</Typography>
                <DateRangePicker
                    value={[from, to]}
                    todayMaxDay
                    width="150px"
                    handleSearch={setPeriodAction}
                />
            </Box>
            <Analytics data={data} />
            <ParticipantsList data={data} />
        </Inner>
    )
}

export default ParticipantsStatistics
