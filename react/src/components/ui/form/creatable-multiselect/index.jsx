import TextField from '@mui/material/TextField'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import { useMemo } from 'react'
import { pluck } from '#root/src/helpers/functions'
import { Chip as MuiChip } from '@mui/material'
import { styled } from '@mui/system'
import Icon from '#root/src/components/ui/icon'

const filter = createFilterOptions()

const Chip = styled(MuiChip)(() => ({
    '&.MuiChip-root': {
        marginRight: '3px'
    }
}))

export default function CreatableMultiSelect({
    items,
    values,
    label,
    handleCreate,
    handleChange,
    creatable = true
}) {
    const valueArr = useMemo(
        () => items.filter(({ id }) => values.includes(parseInt(id))),
        [items, values]
    )

    return (
        <Autocomplete
            multiple
            noOptionsText="Ничего нет найдено"
            popupIcon={<Icon width={12} height={12} name="arrow-select" />}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            value={valueArr || []}
            onChange={(event, selectedValues) => {
                const isCreatable = selectedValues.find((v) =>
                    Boolean(v?.inputValue)
                )

                if (isCreatable?.inputValue && creatable && handleCreate) {
                    handleCreate(isCreatable.inputValue)
                } else {
                    handleChange(pluck(selectedValues, 'id'))
                }
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params)

                const { inputValue } = params
                const isExisting = options.some(
                    (option) => inputValue === option.name
                )

                if (inputValue !== '' && !isExisting && creatable) {
                    filtered.push({
                        inputValue,
                        name: `Создать "${inputValue}"`
                    })
                }
                return filtered
            }}
            id="free-solo-with-text-demo"
            options={items}
            getOptionLabel={(option) => {
                if (option?.inputValue) {
                    return option.inputValue
                }

                return option.name
            }}
            renderOption={(props, option) => {
                return (
                    <li {...props} key={props.key}>
                        {option.name}
                    </li>
                )
            }}
            renderTags={(value, getTagProps) => {
                return (
                    <>
                        {value
                            .filter((v) => !v?.inputValue)
                            .map((option, index) => {
                                const tagProps = getTagProps({ index })
                                return (
                                    <Chip
                                        color="blue"
                                        variant="square"
                                        size="small"
                                        label={option.name}
                                        {...tagProps}
                                        key={tagProps.key}
                                    />
                                )
                            })}
                    </>
                )
            }}
            renderInput={(params) => <TextField {...params} label={label} />}
        />
    )
}
