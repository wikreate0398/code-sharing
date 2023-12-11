import TextField from '@mui/material/TextField'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import { useMemo } from 'react'
import { isFnc } from '@/helpers/functions'
import Icon from '@/components/ui/icon'

const filter = createFilterOptions()

export default function CreatableSelect({
    items,
    value,
    label,
    handleCreate,
    handleChange,
    renderOption,
    error,
    freeSolo = false,
    disabled = false
}) {
    const valueObj = useMemo(
        () => items.find(({ id }) => id === value),
        [items, value]
    )

    return (
        <Autocomplete
            value={valueObj || null}
            noOptionsText="Ничего нет найдено"
            popupIcon={<Icon width={12} height={12} name="arrow-select" />}
            onChange={(event, newValue) => {
                if (newValue && newValue.inputValue) {
                    handleCreate(newValue.inputValue)
                } else {
                    handleChange(newValue)
                }
            }}
            disabled={disabled}
            freeSolo={freeSolo}
            filterOptions={(options, params) => {
                const filtered = filter(options, params)

                const { inputValue } = params
                const isExisting = options.some(
                    (option) => inputValue === option.name
                )

                if (inputValue !== '' && !isExisting) {
                    filtered.push({
                        inputValue,
                        name: `Создать "${inputValue}"`
                    })
                }

                return filtered
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            options={items}
            getOptionLabel={(option) => {
                if (option?.inputValue) {
                    return option.inputValue
                }

                return option.name
            }}
            renderOption={
                isFnc()
                    ? renderOption
                    : (props, option) => (
                          <li {...props} key={option.id}>
                              {option.name}
                          </li>
                      )
            }
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
