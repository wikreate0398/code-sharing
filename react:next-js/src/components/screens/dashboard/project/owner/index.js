'use client'

import Inner from '@/components/ui/inner'
import Header from '@/components/screens/dashboard/project/owner/_components/header'
import Analytics from '@/components/screens/dashboard/project/owner/_components/analytics'
import Boards from '@/components/screens/dashboard/project/owner/_components/boards'
import ParticipantsList from '@/components/screens/dashboard/project/owner/_components/participants'
import { useFetchBoardsQuery } from '@/redux/api/board.api'
import { useParams } from 'next/navigation'
import { isNull, keyBy, objValues } from '@/helpers/functions'
import { projectsRoute } from '@/config/routes'
import { useLazyGetProjectParticipantsStatsQuery } from '@/redux/api/participant.api'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectPeriod } from '@/redux/slices/meta.slice'

const OwnerProject = () => {
    const { id_project } = useParams()
    const period = useSelector(selectPeriod)
    const { boards, participants, isLoading } = useFetchBoardsQuery(
        parseInt(id_project),
        {
            selectFromResult: ({ data, ...props }) => {
                const participants = {}
                data?.forEach((v) => {
                    v.participants.forEach((participant) => {
                        participants[participant.id] = participant
                    })
                })

                return {
                    boards: data ?? [],
                    participants: objValues(participants),
                    ...props
                }
            }
        }
    )

    const [trigger, result] = useLazyGetProjectParticipantsStatsQuery()

    useEffect(() => {
        if (!isNull(period)) {
            trigger({ id_project, ...period })
        }
    }, [id_project, period])

    return (
        <Inner back={projectsRoute()}>
            <Header />
            <Analytics data={result?.data ?? []} />
            <Boards boards={boards} isLoading={isLoading} />
            <ParticipantsList
                statistic={keyBy(result?.data ?? [], 'id_user')}
                participants={participants}
            />
        </Inner>
    )
}

export default OwnerProject
