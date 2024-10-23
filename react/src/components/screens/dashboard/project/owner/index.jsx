
import Inner from '#root/src/components/ui/inner'
import Header from '#root/src/components/screens/dashboard/project/owner/_components/header'
import Analytics from '#root/src/components/screens/dashboard/project/owner/_components/analytics'
import Boards from '#root/src/components/screens/dashboard/project/owner/_components/boards'
import ParticipantsList from '#root/src/components/screens/dashboard/project/owner/_components/participants'
import { useFetchBoardsQuery } from '#root/src/redux/api/board.api'
import { useParams} from "#root/renderer/hooks";
import { isNull, keyBy, objValues } from '#root/src/helpers/functions'
import { projectsRoute } from '#root/src/config/routes'
import { useLazyGetProjectParticipantsStatsQuery } from '#root/src/redux/api/participant.api'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectPeriod } from '#root/src/redux/slices/meta.slice'

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
