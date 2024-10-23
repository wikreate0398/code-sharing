import Loader from '#root/src/components/ui/loader'
import { Table, Tbody, Td, Th, Thead, Tr } from '#root/src/components/ui/table'
import { useFetchUsersQuery } from '#root/src/redux/api/cp/user.api'
import { Box } from '@mui/material'

const UsersTable = () => {
    const { data, isLoading } = useFetchUsersQuery()

    if (isLoading) return <Loader />

    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>ФИО</Th>
                    <Th>Стэк</Th>
                    <Th>Почта</Th>
                </Tr>
            </Thead>
            <Tbody>
                {data.map((user) => (
                    <Tr key={user.id}>
                        <Td>{user.login}</Td>
                        <Td>
                            <UserSkills skills={user.skills} />
                        </Td>
                        <Td>{user.email}</Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    )
}

const UserSkills = ({ skills = [] }) => {
    if (skills.length <= 0) return null

    return (
        <>
            {skills.map((skill, idx) => (
                <Box display="inline-block" mr="4px" key={idx}>
                    {skill}
                </Box>
            ))}
        </>
    )
}

export default UsersTable
