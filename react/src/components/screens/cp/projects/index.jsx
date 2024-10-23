import { Typography } from '@mui/material'
import Wrapper from '../_components/wrapper'
import ProjectsTable from './_components/table'

const ProjectsScreen = () => {
    return (
        <Wrapper>
            <Typography mb="30px" variant="title-32">
                Проекты
            </Typography>
            <ProjectsTable />
        </Wrapper>
    )
}

export default ProjectsScreen
