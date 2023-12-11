'use client'

import OwnerProject from '@/components/screens/dashboard/project/owner'
import GuestProject from '@/components/screens/dashboard/project/guest'
import { useContext } from 'react'
import { ProjectProviderContext } from '@/providers/project-provider'

const Project = () => {
    const { project } = useContext(ProjectProviderContext)
    return project.is_owner ? (
        <OwnerProject project={project} />
    ) : (
        <GuestProject project={project} />
    )
}

export default Project
