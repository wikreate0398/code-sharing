import { Box, Typography } from '@mui/material'
import {
    diffBetween,
    flexStartProps,
    isNull,
    pluck,
    spaceBetweenProps
} from '@/helpers/functions'
import Avatar from '@/components/ui/avatar'
import { useSelector } from 'react-redux'
import { selectPeriod } from '@/redux/slices/meta.slice'
import { useActions, useIsOnline } from '@/helpers/hooks'
import DateRangePicker from '@/components/ui/datepicker'

const Header = ({ user, worked_days = null }) => {
    const period = useSelector(selectPeriod)
    const { setPeriodAction } = useActions()
    const isOnline = useIsOnline()
    const { name, login, skills } = user

    return (
        <Box {...spaceBetweenProps()} mb="25px">
            <Box {...flexStartProps('center')} gap="26px" width="100%">
                <Avatar
                    name={name}
                    size={88}
                    fz={48}
                    online={isOnline(user.id)}
                />
                <Box>
                    <Box mb="10px">
                        <Typography variant="font2" fontSize="32px">
                            {name}
                        </Typography>
                        <Typography marginTop="5px">@ {login}</Typography>
                    </Box>
                    <Typography variant="small-gray" component="p" mt="15px">
                        {pluck(skills, 'name').join(', ')}
                    </Typography>
                </Box>
            </Box>

            <Box display="flex" alignItems="center" flexDirection="column">
                <DateRangePicker
                    value={[period.from, period.to]}
                    handleSearch={setPeriodAction}
                    todayMaxDay
                />
                {!isNull(worked_days) && (
                    <WorkedDays days={worked_days} period={period} />
                )}
            </Box>
        </Box>
    )
}

const WorkedDays = ({ days, period }) => {
    const freeDay = diffBetween(period.from, period.to, 'days') - parseInt(days)
    return (
        <Typography variant="small-gray" mt="10px">
            {days} раб. {freeDay > 0 && `- ${freeDay} не раб.`}
        </Typography>
    )
}

export default Header
