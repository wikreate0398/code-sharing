import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useState
} from 'react'
import InputMask from 'react-input-mask'
import InputSelector from '#root/src/components/screens/dashboard/project/board/task/_components/task-details/_components/input-selector'
import { useUpdateTask } from '#root/src/components/screens/dashboard/project/board/task/hooks'
import {
    hoursDeclination,
    minToHours,
    timeDigit,
    trimLeft
} from '#root/src/helpers/functions'
import useDebouncedCallback from '#root/src/hooks/useDebouncedCallback'
import TimerIcon from '#root/src/components/ui/svg-icons/icons/timer-icon'

interface Props {
    id: number
    estimate_time: number | null // minutes
}

const DeadlineInput = memo(({ id, estimate_time }: Props) => {
    const timeRegex = /^(?:[01]\d|2[0-3])\s*:\s*[0-5]\d$/
    const initialMask = '99 : 99'
    const emptyVal = '00 : 00'
    const [value, setValue] = useState(null)
    const [focused, setFocused] = useState(false)
    const [mask, setMask] = useState(initialMask)

    const updateTask = useUpdateTask()

    const save = useDebouncedCallback(
        useCallback(
            (time) => {
                const [hours, min] = time.split(':')
                updateTask({
                    id,
                    estimate_time: parseInt(hours) * 60 + parseInt(min)
                })
            },
            [updateTask, id]
        ),
        1000
    )

    useEffect(() => {
        if (estimate_time) {
            const { hours, minutes } = minToHours(estimate_time)
            setValue(`${timeDigit(hours)}:${timeDigit(minutes)}`)
        }
    }, [estimate_time])

    const handleInputChange = useCallback(
        (e) => {
            let val = e.target.value

            if (timeRegex.test(val)) {
                const [hours, min] = val.split(':')
                const validMin = parseInt(min, 10)

                if (validMin > 59) val = `${hours}:59`

                save(val)
            }

            setValue(val)
        },
        [save]
    )

    const convertVal: string = useMemo(() => {
        if (focused) {
            setMask(initialMask)
            return value
        }

        if (value && value !== emptyVal) {
            let [hours, minutes] = value?.replace(' ', '').split(':') || []
            let isHH = hours !== '00'
            let isMM = trimLeft(minutes, ' ') !== '00'

            hours = parseInt(hours)
            minutes = parseInt(minutes)

            const minMask = minutes < 10 ? 9 : 99

            setMask(
                isHH
                    ? `${hours < 10 ? 9 : 99} ${hoursDeclination(hours)} ${isMM ? `${minMask} мин` : ''}`
                    : `${minMask} мин`
            )

            return `${isHH ? parseInt(hours) : null} ${minutes}`
        }

        return value
    }, [focused, value])

    return (
        <InputMask
            value={convertVal}
            mask={mask}
            maskChar="0"
            placeholder={emptyVal}
            onChange={handleInputChange}
            onFocus={() => {
                setFocused(true)
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') setFocused(false)
            }}
            onBlur={(e) => {
                setFocused(false)
            }}
        >
            {(inputProps) => (
                <InputSelector
                    title="ОЦЕНКА"
                    startAdornment={<TimerIcon />}
                    {...inputProps}
                />
            )}
        </InputMask>
    )
})

export default DeadlineInput
