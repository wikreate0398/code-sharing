import { Typography } from '@mui/material'
import Wrapper from '../_components/wrapper'
import UsersTable from './_components/table'

const UsersScreen = () => {
    return (
        <Wrapper>
            <Typography mb="30px" variant="title-32">
                Cпециалисты
            </Typography>
            <UsersTable />
        </Wrapper>
    )
}

export default UsersScreen
