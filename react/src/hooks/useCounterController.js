import { useEffect, useState } from 'react'
import { timeDigit, toLocalTimezone } from '#root/src/helpers/functions'
import moment from 'moment'

const countTime = (timer) => {
    return timer
        ? timer.worked_time +
              parseInt(
                  moment().diff(toLocalTimezone(timer.last_launch), 'seconds')
              )
        : 0
}

const useCounterController = (data) => {
    const [value, setValue] = useState(countTime(data))

    useEffect(() => {
        if (!data?.play) return

        const timer = () => {
            setValue(countTime(data))
        }

        timer()
        const interval = setInterval(timer, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [data])

    const totalMinutes = Math.floor(value / 60)
    const seconds = value % 60
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return {
        isStopped: hours === 0 && minutes === 0 && seconds === 0,
        seconds: timeDigit(seconds),
        hours: timeDigit(hours),
        minutes: timeDigit(minutes)
    }
}

export default useCounterController
