import {
    forwardRef,
    memo,
    useEffect,
    useRef,
    useState,
    useCallback
} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { dateFormat } from '@/helpers/functions'
import classNames from 'classnames'
import useStyles from './styles'
import moment from 'moment'
import Icon from '@/components/ui/icon'
import { Box } from '@mui/material'

const DateRangePicker = memo(
    ({
        width = null,
        height = null,
        value = null,
        handleSearch,
        minDate,
        maxDate,
        todayMaxDay = false,
        disable = false,
        ...props
    }) => {
        const classList = useStyles({ width, height })
        const [changed, setChanged] = useState(false)
        const [date, setDate] = useState({
            from: null,
            to: null
        })
        const pickerRef = useRef()

        useEffect(() => {
            setupInitialValue()

            return () => setChanged(false)
        }, [value])

        const setupInitialValue = () => {
            let from = value?.[0] ? new Date(value?.[0]) : new Date()
            let to = value?.[1] ? new Date(value?.[1]) : new Date()
            setDate({ from, to })
        }

        const onChange = useCallback(
            (params) => {
                setDate({
                    from: params[0] || null,
                    to: params[1] || null
                })

                if (params[1]) {
                    handleSearch({
                        from: dateFormat(params[0]),
                        to: dateFormat(params[1])
                    })
                }

                if (
                    moment(params[0]).format('DD-MM-YYYY') ===
                    moment(params[1]).format('DD-MM-YYYY')
                ) {
                    pickerRef.current.setOpen(false)
                }

                // new bind outside click
                pickerRef.current.handleCalendarClickOutside = (e) => {
                    if (params[0] && params[1] == null) {
                        setupInitialValue()
                    }

                    pickerRef.current.setOpen(false)
                }

                setChanged(true)
            },
            [handleSearch, date]
        )

        if (!date.from) return <>...</>

        return (
            <Box
                className={classNames(classList.root, { disable, changed })}
                display="flex"
                justifyContent="space-start"
                alignItems="center"
            >
                <Icon
                    name="datepicker"
                    className={classList.icon}
                    width={12}
                    height={12}
                    onClick={() =>
                        handleSearch({
                            from: value?.[0],
                            to: value?.[1]
                        })
                    }
                />

                <DatePicker
                    className={classList['date-picker']}
                    selectsRange
                    minDate={minDate ? new Date(minDate) : null}
                    maxDate={
                        todayMaxDay
                            ? new Date()
                            : maxDate
                              ? new Date(maxDate)
                              : null
                    }
                    selected={date.from}
                    startDate={date.from}
                    endDate={date.to}
                    onChange={onChange}
                    disabled={disable}
                    dateFormat="dd.MM.yy"
                    shouldCloseOnSelect={true}
                    customInput={<PickerInput />}
                    ref={pickerRef}
                    {...props}
                />
            </Box>
        )
    }
)

const PickerInput = forwardRef(({ value, onClick }, ref) => {
    return (
        <Box className="value" onClick={onClick} ref={ref}>
            {value}
        </Box>
    )
})

export default DateRangePicker
