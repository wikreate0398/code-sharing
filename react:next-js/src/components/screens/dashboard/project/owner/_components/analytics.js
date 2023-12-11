import AnalyticsContainer from '@/components/screens/dashboard/project/_components/analytics-container'
import AnalyticValue from '@/components/ui/analytic-value'
import {
    countHourlyPrice,
    minToAnalyticFormat,
    objValues,
    priceString,
    roundSecToMin
} from '@/helpers/functions'

const Analytics = ({ data }) => {
    let totalMinutes = 0
    let retailPrice = 0
    let purchasePrice = 0
    objValues(data).forEach(({ sell_price, hourly_price, worked_time }) => {
        const minutes = roundSecToMin(worked_time)
        totalMinutes += minutes
        purchasePrice += countHourlyPrice(minutes, hourly_price)
        retailPrice += countHourlyPrice(minutes, sell_price)
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
                label="Need to pay"
            />

            <AnalyticValue
                value={priceString(retailPrice)}
                symbol="$"
                symbolSize={20}
                label="Invoice price"
            />

            <AnalyticValue
                value={`+${priceString(retailPrice - purchasePrice)}`}
                symbol="$"
                label="Potential income"
            />
        </AnalyticsContainer>
    )
}

export default Analytics
