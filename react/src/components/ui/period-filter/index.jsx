import { isNull } from '#root/src/helpers/functions'
import { useEffect } from 'react'
import DropDown from '#root/src/components/ui/dropdown'

const data = [
    { name: 'Сегодня', value: 'today' },
    { name: 'Вчера', value: 'yesterday' },
    { name: 'Неделя', value: 'week' },
    { name: '1 месяц', value: 'one_month' },
    { name: '3 месяца', value: 'three_months' },
    { name: '6 месяцев', value: 'six_months' },
    { name: '1 Год', value: 'one_year' }
]

const Filter = ({ value, dispatchAction }) => {
    useEffect(() => {
        if (isNull(value)) {
            dispatchAction(data[0].value)
        }
    }, [value])

    if (isNull(value)) return null

    return <DropDown data={data} onSelect={dispatchAction} selected={value} />
}

export default Filter
