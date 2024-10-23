import {
    Autocomplete as MuiAutocomplete,
    MenuItem,
    TextField
} from '@mui/material'
import React from 'react'

const Autocomplete = ({
    children,
    label,
    onChange,
    value,
    disabled,
    error = null,
    title = null,
    options = [],
    renderOption,
    getOptionLabel,
    ...props
}) => {
    return (
        <MuiAutocomplete
            disablePortal
            noOptionsText="Ничего нет найдено"
            value={value || null}
            options={options || []}
            onChange={onChange}
            disabled={disabled}
            renderOption={(props, option) => (
                <MenuItem {...props} key={props.key}>
                    {renderOption(option)}
                </MenuItem>
            )}
            getOptionLabel={getOptionLabel}
            fullWidth
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    error={Boolean(error)}
                    helperText={error}
                />
            )}
        />
    )
}

export default Autocomplete
