import { useLazyGetActivityDaysQuery } from '#root/src/redux/api/statistics.api'
import React, { useContext, useEffect } from 'react'
import { Box, Icon } from '@mui/material'
import {
    dateFormat,
    empty,
    minToAnalyticFormat,
    monthName,
    roundSecToMin
} from '#root/src/helpers/functions'
import { makeStyles } from '@mui/styles'
import moment from 'moment'
import { ActivityContextProvider } from '#root/src/components/screens/dashboard/_components/activity/index'
import classNames from 'classnames'
import AnalyticValue from '#root/src/components/ui/analytic-value'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const useStyles = makeStyles((theme) => ({
    root2: {

        '& .slick-track': {
            margin: 0
        },

        backgroundColor: '#F3F4F7',
        borderRadius: '44px',
        padding: '12px 31px',

        '& .slick-next': {
            background: 'transparent !important',
            width: '25px',
            height: '100%',
            right: '-25px',

            '&:before': {
                content: '""',
                backgroundImage: 'url(/img/arrow-left.svg)',
                backgroundSize: '12px 12px',
                backgroundRepeat: 'no-repeat',
                display: 'block',
                width: '12px',
                height: '100%',
                backgroundPosition: 'center',
                transform: 'rotate(180deg)'
            }
        },

        '& .slick-prev': {
            background: 'transparent !important',
            width: '25px',
            height: '100%',

            '&:before': {
                content: '""',
                backgroundImage: 'url(/img/arrow-left.svg)',
                backgroundSize: '12px 12px',
                backgroundRepeat: 'no-repeat',
                display: 'block',
                width: '100%',
                height: '100%',
                backgroundPosition: 'right'
            }
        },

        '& .day': {
            textAlign: 'center',
            cursor: 'pointer',

            '& .date': {
                marginBottom: '4px',
                fontSize: '11px',
                lineHeight: '11px',
                fontWeight: 400,
                color: 'rgba(0,0,0,.5)',
                padding: '2px 4px',
                borderRadius: '32px',
                display: 'inline',

                '&.active': {
                    color: '#fff',
                    backgroundColor: '#000'
                }
            },

            '& .time': {
                fontWeight: 500,
                fontSize: '13px',
                lineHeight: '13px'
            }
        },

        ...theme.palette.scrollbar()
    },

    root: {
        overflowX: 'scroll',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'start',
        gap: '76px',
        backgroundColor: '#F3F4F7',
        borderRadius: '44px',
        padding: '12px 31px',

        '& .day': {
            textAlign: 'center',
            cursor: 'pointer',

            '& .date': {
                marginBottom: '4px',
                fontSize: '11px',
                lineHeight: '11px',
                fontWeight: 400,
                color: 'rgba(0,0,0,.5)',
                padding: '2px 4px',
                borderRadius: '32px',

                '&.active': {
                    color: '#fff',
                    backgroundColor: '#000'
                }
            },

            '& .time': {
                fontWeight: 500,
                fontSize: '13px',
                lineHeight: '13px'
            }
        },

        ...theme.palette.scrollbar()
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

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block"}}
            onClick={onClick}
        />
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block"}}
            onClick={onClick}
        />
    );
}

const DailyAxis = () => {
    const classes = useStyles()
    const { period, setDay, id_project, login } = useContext(
        ActivityContextProvider
    )
    const [trigger, result] = useLazyGetActivityDaysQuery()

    const data = result?.data ?? []

    useEffect(() => {
        if (period.from !== period.to) {
            trigger({ id_project, login, ...period }).then(({ data }) => {
                setDay(data[0].date)
            })
        } else {
            setDay(period.from)
        }
    }, [period, id_project])

    if (empty(data) || period.from === period.to) return null

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 7,
        initialSlide: 0,
        centerMode: false,
        ...(data.length > 7 ? {
            nextArrow: <SampleNextArrow />,
            prevArrow:  <SamplePrevArrow />,
            slidesToScroll: 7,
        }: {arrows: false})
    };

    return (
       <>
           <Box className={classNames("slider-container", classes.root2)}>
               <Slider {...settings}>
                   {data.map((v, k) => {
                       if (parseInt(v.worked_time) < 60) return null
                       if (dateFormat(v.date, 'DD') === '01' && k !== 0) {
                           return <MonthSep key={k} date={v.date} />
                       }
                       return <Day key={k} data={v} />
                   })}
               </Slider>
           </Box>
       </>
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
