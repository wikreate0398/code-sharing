'use client'

import { useLazyGetProjectParticipantQuery } from '@/redux/api/participant.api'
import { notFound, useParams } from 'next/navigation'
import Inner from '@/components/ui/inner'
import Header from '@/components/screens/dashboard/project/participant/_components/header'
import Analytics from '@/components/screens/dashboard/project/participant/_components/analytics'
import { projectRoute } from '@/config/routes'
import { useSelector } from 'react-redux'
import { selectPeriod } from '@/redux/slices/meta.slice'
import { useEffect } from 'react'
import Activity from '@/components/screens/dashboard/_components/activity'

const ProjectParticipant = () => {
    const { id_project, login = null } = useParams()
    const period = useSelector(selectPeriod)

    const [trigger, result] = useLazyGetProjectParticipantQuery({
        id_project,
        login
    })

    useEffect(() => {
        if (period) trigger({ id_project, login, ...period })
    }, [id_project, login, period])

    if (result?.isLoading || !result.data) return null
    if (result?.isError) notFound()

    const { meta, analytics } = result.data

    return (
        <Inner back={projectRoute(id_project)}>
            <Header user={meta.user} />
            <Analytics analytics={analytics} data={meta} />
            <Activity id_project={id_project} login={login} />
        </Inner>
    )
}

export default ProjectParticipant
