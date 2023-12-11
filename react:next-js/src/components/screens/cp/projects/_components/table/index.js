import Loader from '@/components/ui/loader'
import { Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui/table'
import { useFetchProjectsQuery } from '@/redux/api/cp/project.api'
import { Box } from '@mui/material'
import { flexStartProps } from '@/helpers/functions'

const ProjectsTable = () => {
    const { data, isLoading } = useFetchProjectsQuery()

    if (isLoading) return <Loader />

    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>Название проекта</Th>
                    <Th>Участников</Th>
                    <Th>Cоздатель</Th>
                </Tr>
            </Thead>
            <Tbody>
                {data.map((project) => (
                    <Tr key={project.id}>
                        <Td>
                            <Box {...flexStartProps('flex-start')} gap="6px">
                                <Box
                                    sx={{ background: project.bg }}
                                    borderRadius="5px"
                                    width="18px"
                                    height="18px"
                                />
                                {project.name}
                            </Box>
                        </Td>
                        <Td>{project.count}</Td>
                        <Td>{project.owner}</Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    )
}

export default ProjectsTable
