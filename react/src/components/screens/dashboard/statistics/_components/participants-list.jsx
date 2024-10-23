import { Box, Typography } from '@mui/material'
import Avatar from '#root/src/components/ui/avatar'
import {
    empty,
    flexStartProps,
    minToAnalyticFormat,
    pluck,
    roundSecToMin
} from '#root/src/helpers/functions'
import AnalyticValue from '#root/src/components/ui/analytic-value'
import { useRouter } from "#root/renderer/hooks"
import { Table, Thead, Tbody, Tr, Td, Th } from '#root/src/components/ui/table'
import { participantStatisticRoute } from '#root/src/config/routes'
import { useIsOnline } from '#root/src/helpers/hooks'

const ParticipantsList = ({ data }) => {
    if (empty(data)) return null

    return (
        <Table version={2} mb="25px">
            <Thead>
                <Tr>
                    <Th>#</Th>
                    <Th>Stack</Th>
                    <Th ac>Tracked</Th>
                    <Th ac>$ Total</Th>
                    <Th />
                </Tr>
            </Thead>
            <Tbody>
                {data.map((v) => (
                    <Participant key={v.user.id} value={v} />
                ))}
            </Tbody>
        </Table>
    )
}

const Participant = ({ value }) => {
    const { user, worked_time, total_purchase } = value
    const { name, login, skills } = user
    const { push } = useRouter()
    const isOnline = useIsOnline()
    const location = `${participantStatisticRoute(
        login
    )}?back=${participantStatisticRoute()}`

    return (
        <Tr>
            <Td>
                <Box
                    {...flexStartProps('center')}
                    gap="12px"
                    onClick={() => push(location)}
                >
                    <Avatar name={name} pointer online={isOnline(user.id)} />
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
            <Td className="skill" nw={false}>
                {pluck(skills, 'name').join(', ')}
            </Td>
            <Td ac>
                <AnalyticValue
                    {...minToAnalyticFormat(roundSecToMin(worked_time))}
                    symbolFullSize
                    size={13}
                />
            </Td>
            <Td ac>
                <Typography variant="font2" fontSize="13px">
                    {Boolean(total_purchase) && `$ ${total_purchase}`}
                </Typography>
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
