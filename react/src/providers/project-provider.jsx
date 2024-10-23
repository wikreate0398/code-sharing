import { createContext, useContext } from 'react'
import HeaderBoards from '#root/src/components/screens/dashboard/_components/header-boards'
import { useGetProjectGqlQuery } from '#root/src/redux/api/project.api'
import { notFound, useParams } from "#root/renderer/hooks"
import { useSelector } from 'react-redux'
import { selectAuthUser } from '#root/src/redux/slices/meta.slice'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import classNames from 'classnames'
import { AI_TRACKING, FREE_TRACKING, TASK_TRACKING } from '#root/src/config/const.js'

export const ProjectProviderContext = createContext({
    project: {},
    isOwner: false,
    isTaskTracking: false,
    isFreeTracking: false,
    isAITracking: false,
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

    const { data: project, isLoading, isError } = useGetProjectGqlQuery(Number(id_project))

    const user = useSelector(selectAuthUser)

    if (isLoading) return null
    if (isError || project === null) {
        notFound()
        return
    }

    const {define} = project.data.tracking_type;

    const isFreeTracking = define === FREE_TRACKING
    const isAITracking = define === AI_TRACKING
    const isTaskTracking = define === TASK_TRACKING

    return (
        <ProjectProviderContext.Provider
            value={{
                project,
                isFreeTracking: isFreeTracking,
                isAITracking: isAITracking,
                isTaskTracking: isTaskTracking,
                isOwner: Number(project.id_owner) === Number(user.id)
            }}
        >
            <HeaderBoards project={project} />
            <Box className={classNames(classes.root)}>{children}</Box>
        </ProjectProviderContext.Provider>
    )
}

export const useProjectContext = () => {
    const {
        project,
        isTaskTracking,
        isFreeTracking,
        isAITracking,
        isOwner
    } = useContext(ProjectProviderContext)

    return {
        project,
        isOwner,
        isTaskTracking,
        isFreeTracking,
        isAITracking
    }
}

export default ProjectProvider
