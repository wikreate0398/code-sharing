import { Typography } from '@mui/material'
import Wrapper from '#root/src/components/screens/cp/_components/wrapper/index.jsx'
import UsersTable from '#root/src/components/screens/cp/users/_components/table/index.jsx'

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
