
import Inner from '#root/src/components/ui/inner'
import { useParams} from "#root/renderer/hooks";
import { useLazyGetProjectGuestQuery } from '#root/src/redux/api/participant.api'
import Header from '#root/src/components/screens/dashboard/project/_components/header.jsx'
import Analytics from '#root/src/components/screens/dashboard/project/guest/_components/analytics'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectPeriod } from '#root/src/redux/slices/meta.slice'
import Activity from '#root/src/components/screens/dashboard/_components/activity'

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
            <Activity id_project={id_project} id_user={parseInt(meta.user.id)}/>
        </Inner>
    )
}

export default GuestProject
