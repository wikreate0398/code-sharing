import { useLazyGetActivityDaysQuery } from '@/redux/api/time.traking.api'
import { useContext, useEffect } from 'react'
import { Box } from '@mui/material'
import {
    dateFormat,
    empty,
    minToAnalyticFormat,
    monthName,
    roundSecToMin
} from '@/helpers/functions'
import { makeStyles } from '@mui/styles'
import moment from 'moment'
import { ActivityContextProvider } from '@/components/screens/dashboard/_components/activity/index'
import classNames from 'classnames'
import AnalyticValue from '@/components/ui/analytic-value'

const useStyles = makeStyles(() => ({
    root: {
        marginTop: '20px',
        overflowX: 'scroll',
        paddingBottom: '10px',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'start',
        gap: '40px',

        '& .day': {
            textAlign: 'center',
            cursor: 'pointer',

            '& .date': {
                marginBottom: '4px',
                fontSize: '11px',
                fontWeight: 400,
                color: 'rgba(0,0,0,.33)',
                padding: '2px 4px',
                borderRadius: '32px',

                '&.active': {
                    color: '#fff',
                    backgroundColor: '#000'
                }
            },

            '& .time': {
                fontWeigh: 500,
                fontSize: '13px'
            }
        }
    },

    monthSeparate: {
        transform: 'rotate(-90deg)',
        fontWeight: 500,
        fontSize: '9px',
        alignSelf: 'center',
        margin: '0 -20px',
        borderTop: '1px solid #000000',
        borderBottom: '1px solid #000000',
        padding: '2px 0 5px 0'
    }
}))

const DailyAxis = () => {
    const classes = useStyles()
    const { period, setDay, id_project, login } = useContext(
        ActivityContextProvider
    )
    const [trigger, result] = useLazyGetActivityDaysQuery()

    const data = result?.data ?? []

    useEffect(() => {
        if (period.from !== period.to) {
            trigger({ id_project, login, ...period })
        } else {
            setDay(period.from)
        }
    }, [period, id_project])

    useEffect(() => {
        if (!empty(data)) {
            setDay(data[0].date)
        }
    }, [data])

    if (empty(data) || period.from === period.to) return null

    return (
        <Box className={classes.root}>
            {data.map((v, k) => {
                if (dateFormat(v.date, 'DD') === '01' && k !== 0) {
                    return <MonthSep key={k} date={v.date} />
                }
                return <Day key={k} data={v} />
            })}
        </Box>
    )
}

const MonthSep = ({ date }) => {
    const classes = useStyles()
    return (
        <Box className={classes.monthSeparate}>
            {monthName(dateFormat(date, 'M'))}
        </Box>
    )
}

const Day = ({ data }) => {
    const { day, setDay } = useContext(ActivityContextProvider)
    const { date, worked_time } = data

    return (
        <Box className="day" onClick={() => setDay(date)}>
            <Box
                className={classNames('date', {
                    active: day === date
                })}
            >
                {moment(date).format('DD.MM')}
            </Box>
            <Box className="time">
                <AnalyticValue
                    {...minToAnalyticFormat(roundSecToMin(worked_time))}
                    symbolFullSize
                    size={13}
                />
            </Box>
        </Box>
    )
}

export default DailyAxis
