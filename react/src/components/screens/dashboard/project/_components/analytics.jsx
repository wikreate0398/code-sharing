import AnalyticsContainer from '#root/src/components/screens/dashboard/project/_components/analytics-container.jsx'
import AnalyticValue from '#root/src/components/ui/analytic-value/index.jsx'
import { useFormik } from 'formik'
import { useState } from 'react'
import { useUpdateProjectParticipantMutation } from '#root/src/redux/api/participant.api.js'
import {
    minToAnalyticFormat,
    objValues,
    priceString,
    roundSecToMin
} from '#root/src/helpers/functions.js'

const Analytics = ({ analytics, data }) => {
    const [updateProjectParticipant] = useUpdateProjectParticipantMutation()
    const [initialValues, setInitialValues] = useState({
        id: null,
        sell_price: 0,
        hourly_price: 0
    })

    useState(() => {
        const { id, sell_price, hourly_price } = data
        setInitialValues({ id, sell_price, hourly_price })
    }, [data])

    const { values, handleSubmit, setFieldValue } = useFormik({
        initialValues,
        enableReinitialize: true,
        onSubmit: (values) => {
            updateProjectParticipant(values)
        }
    })

    if (initialValues.id === null) return null

    let totalMinutes = 0
    let purchasePrice = 0
    objValues(analytics).forEach(({ total_purchase, worked_time }) => {
        const minutes = roundSecToMin(worked_time)
        totalMinutes += minutes
        purchasePrice += total_purchase
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
                value={values.hourly_price}
                onEnter={(value) => {
                    setFieldValue('hourly_price', value)
                    handleSubmit()
                }}
                symbol="$"
                symbolSize={20}
                label="Hourly Rate"
            />

            <AnalyticValue
                value={values.sell_price}
                onEnter={(value) => {
                    setFieldValue('sell_price', value)
                    handleSubmit()
                }}
                symbol="$"
                label="Sell Price"
            />
        </AnalyticsContainer>
    )
}

export default Analytics
