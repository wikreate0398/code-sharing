import { TextField } from '@mui/material'
import Icon from '#root/src/components/ui/icon'
import React from 'react'

const Select = ({
    children,
    label,
    onChange,
    value,
    disabled,
    placeholder,
    error = null,
    size = 'normal',
    ...props
}) => {
    return (
        <TextField
            select
            label={label}
            value={value || ''}
            size={size}
            fullWidth
            onChange={onChange}
            helperText={error}
            error={Boolean(error)}
            SelectProps={{
                IconComponent: (props) => (
                    <Icon
                        {...props}
                        width={12}
                        height={12}
                        name="arrow-select"
                    />
                )
            }}
            disabled={disabled}
            {...props}
            onClose={() => {
                setTimeout(() => {
                    document.activeElement.blur()
                }, 0)
            }}
        >
            {children}
        </TextField>
    )
}

export default Select
