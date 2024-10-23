import AnalyticsContainer from '#root/src/components/screens/dashboard/project/_components/analytics-container'
import AnalyticValue from '#root/src/components/ui/analytic-value'
import {
    countHourlyPrice,
    minToAnalyticFormat,
    objValues,
    priceString,
    roundSecToMin
} from '#root/src/helpers/functions'

const Analytics = ({ hourly_price, data }) => {
    let totalMinutes = 0
    let purchasePrice = 0
    objValues(data).forEach(({ hourly_price, worked_time }) => {
        const minutes = roundSecToMin(worked_time)
        totalMinutes += minutes
        purchasePrice += countHourlyPrice(minutes, hourly_price)
    })

    return (
        <AnalyticsContainer>
            <AnalyticValue
                {...minToAnalyticFormat(totalMinutes)}
                symbolSize={20}
                label="Worked time"
            />

            <AnalyticValue
                value={priceString(purchasePrice)}
                symbol="$"
                symbolSize={20}
                label="Income"
            />

            <AnalyticValue
                value={hourly_price}
                symbol="$"
                symbolSize={20}
                label="Hourly Rate"
            />
        </AnalyticsContainer>
    )
}

export default Analytics
