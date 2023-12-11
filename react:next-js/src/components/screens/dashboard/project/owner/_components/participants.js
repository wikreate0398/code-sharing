import { Box, Typography } from '@mui/material'
import Avatar from '@/components/ui/avatar'
import {
    empty,
    flexStartProps,
    minToAnalyticFormat,
    pluck,
    roundSecToMin
} from '@/helpers/functions'
import AnalyticValue from '@/components/ui/analytic-value'
import { useParams, useRouter } from 'next/navigation'
import { Table, Thead, Tbody, Tr, Td, Th } from '@/components/ui/table'
import { projectParticipantRoute } from '@/config/routes'
import { useSelector } from 'react-redux'
import { selectOnlineStatuses } from '@/redux/slices/meta.slice'
import { useIsOnline } from '@/helpers/hooks'

const ParticipantsList = ({ participants, statistic }) => {
    if (empty(participants)) return null

    return (
        <Box mt="20px">
            <Typography variant="subtitle-15">Members</Typography>

            <Table version={2}>
                <Thead>
                    <Tr>
                        <Th>#</Th>
                        <Th>Stack</Th>
                        <Th>Tracked</Th>
                        <Th />
                    </Tr>
                </Thead>
                <Tbody>
                    {participants.map((v) => (
                        <Participant
                            key={v.id}
                            statistic={statistic}
                            participant={v}
                        />
                    ))}
                </Tbody>
            </Table>
        </Box>
    )
}

const Participant = ({ participant, statistic }) => {
    const { id, name, login } = participant
    const isOnline = useIsOnline()
    const { push } = useRouter()

    const location = projectParticipantRoute(useParams().id_project, login)

    return (
        <Tr>
            <Td>
                <Box
                    {...flexStartProps('center')}
                    gap="12px"
                    onClick={() => push(location)}
                >
                    <Avatar name={name} pointer online={isOnline(id)} />
                    <Box>
                        <Typography
                            fontWeight={500}
                            component="p"
                            marginBottom="4px"
                        >
                            {name}
                        </Typography>
                        <Typography variant="extra-small-gray" component="p">
                            @{login}
                        </Typography>
                    </Box>
                </Box>
            </Td>
            <Td className="skill">
                {pluck(participant.skills, 'name').join(', ')}
            </Td>
            <Td>
                <AnalyticValue
                    {...minToAnalyticFormat(
                        roundSecToMin(statistic?.[id]?.worked_time)
                    )}
                    symbolFullSize
                    size={13}
                />
            </Td>
            <Td>
                <Typography
                    onClick={() => push(location)}
                    style={{ cursor: 'pointer' }}
                    variant="detail"
                >
                    Detail
                </Typography>
            </Td>
        </Tr>
    )
}

export default ParticipantsList
