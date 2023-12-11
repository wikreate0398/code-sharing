import { Box, Typography } from '@mui/material'
import { flexStartProps, spaceBetweenProps } from '@/helpers/functions'
import Icon from '@/components/ui/icon'
import { createContext, forwardRef, useImperativeHandle, useState } from 'react'
import DailyAxis from '@/components/screens/dashboard/_components/activity/daily-axis'
import DayActivity from '@/components/screens/dashboard/_components/activity/day-activity'
import { useSelector } from 'react-redux'
import { selectPeriod } from '@/redux/slices/meta.slice'

export const ActivityContextProvider = createContext({
    day: null,
    period: { from: null, to: null },
    id_project: null,
    login: null,
    setDay: () => {}
})

const Activity = forwardRef(({ id_project, login = null }, ref) => {
    const period = useSelector(selectPeriod)
    const [day, setDay] = useState(null)

    useImperativeHandle(
        ref,
        () => ({
            setDay
        }),
        [day]
    )

    return (
        <ActivityContextProvider.Provider
            value={{
                period,
                day,
                setDay,
                id_project,
                login
            }}
        >
            <Box>
                <Box {...spaceBetweenProps()}>
                    <Typography
                        variant="subtitle-15"
                        component="h4"
                        {...flexStartProps('center')}
                        gap="6px"
                    >
                        <Icon name="bars" width={15} height={15} />
                        Активность
                    </Typography>
                </Box>

                {Boolean(period.from) && <DailyAxis />}
                {Boolean(day) && <DayActivity />}
            </Box>
        </ActivityContextProvider.Provider>
    )
})

export default Activity
