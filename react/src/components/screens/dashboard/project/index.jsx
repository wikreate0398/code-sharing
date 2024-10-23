
import OwnerProject from '#root/src/components/screens/dashboard/project/owner'
import GuestProject from '#root/src/components/screens/dashboard/project/guest'
import { useContext } from 'react'
import { ProjectProviderContext } from '#root/src/providers/project-provider'

const Project = () => {
    const { project, isOwner } = useContext(ProjectProviderContext)
    return isOwner ? (
        <OwnerProject project={project} />
    ) : (
        <GuestProject project={project} />
    )
}

export default Project
