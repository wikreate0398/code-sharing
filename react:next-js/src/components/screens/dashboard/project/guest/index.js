'use client'

import Inner from '@/components/ui/inner'
import { useParams } from 'next/navigation'
import { useLazyGetProjectGuestQuery } from '@/redux/api/participant.api'
import Header from '@/components/screens/dashboard/project/participant/_components/header'
import Analytics from '@/components/screens/dashboard/project/guest/_components/analytics'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectPeriod } from '@/redux/slices/meta.slice'
import Activity from '@/components/screens/dashboard/_components/activity'

const GuestProject = () => {
    const { id_project } = useParams()
    const period = useSelector(selectPeriod)

    const [trigger, result] = useLazyGetProjectGuestQuery(parseInt(id_project))

    useEffect(() => {
        trigger({ id_project, ...period })
    }, [id_project, period])

    if (result?.isLoading || !result?.data) return null

    const { meta, analytics } = result.data

    return (
        <Inner>
            <Header user={meta.user} />
            <Analytics data={analytics} hourly_price={meta.hourly_price} />
            <Activity id_project={id_project} />
        </Inner>
    )
}

export default GuestProject
