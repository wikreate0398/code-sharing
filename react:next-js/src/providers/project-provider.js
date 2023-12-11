'use client'

import { createContext } from 'react'
import HeaderBoards from '@/components/screens/dashboard/_components/header-boards'
import { useGetProjectQuery } from '@/redux/api/project.api'
import { notFound, useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectTimer, selectUser } from '@/redux/slices/meta.slice'
import { TimerOverlay } from '@/components/ui/timer'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import classNames from 'classnames'

export const ProjectProviderContext = createContext({
    project: {},
    isOwner: false
})

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,

        '&.blur': {
            filter: 'blur(3px)'
        }
    }
}))

const ProjectProvider = ({ children }) => {
    const classes = useStyles()
    const { id_project, id_board } = useParams()
    const { data: project, isLoading, isError } = useGetProjectQuery(id_project)
    const timer = useSelector(selectTimer)

    const user = useSelector(selectUser)

    if (isLoading) return null
    if (isError) notFound()

    const blur = Boolean(id_board) && !timer?.[id_project]?.play

    return (
        <ProjectProviderContext.Provider
            value={{
                project,
                isOwner: project.id_owner === user.id
            }}
        >
            <HeaderBoards project={project} />
            {Boolean(id_board) && <TimerOverlay />}
            <Box className={classNames(classes.root, { blur })}>{children}</Box>
        </ProjectProviderContext.Provider>
    )
}

export default ProjectProvider
