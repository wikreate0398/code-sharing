import React, { useCallback, useEffect, useState } from 'react'
import Input from '@/components/ui/form/input'

const PopoverInput = ({ value: defVal, onEnter }) => {
    const [value, setValue] = useState('')

    useEffect(() => {
        setValue(defVal)
    }, [defVal])

    const handleChange = (e) => {
        setValue(e.target.value)
    }

    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === 'Enter') {
                event.preventDefault()
                onEnter(value)
            }
        },
        [value, onEnter]
    )

    return (
        <Input
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
        />
    )
}

export default PopoverInput
