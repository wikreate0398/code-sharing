//@ts-nocheck

import React, { memo, useMemo, useState } from 'react'
import { pluck } from '#root/src/helpers/functions'
import TextField from '@mui/material/TextField'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import { Box, ClickAwayListener, InputAdornment } from '@mui/material'
import useStyles from '#root/src/components/ui/custom-autocomplete/styles'
import OptionItem from '#root/src/components/ui/custom-autocomplete/_components/option-item'
import ListItem from '#root/src/components/ui/custom-autocomplete/_components/list-item'
import ListboxComponent from '#root/src/components/ui/custom-autocomplete/_components/listbox-component'
import type AutocompleteProps from '#root/src/components/ui/custom-autocomplete/types'
import classNames from 'classnames'
import _ from 'lodash'

const filter = createFilterOptions()

/*
 * defaultTags - массив значений которые мы хотим показать в тегах но не хотим выводить в выпадающем списке.
 * Значения не будут числится в селекте
 */
const CustomAutocomplete = ({
    items,
    defaultValue = [],
    defaultTags = [],
    values = [],
    handleChange,
    handleCreate = () => null,
    filterItems = () => null,
    noOptionsText = 'Нет данных',
    renderInput: Input = TextField,
    optionEndAdornment: OptionEndAdornment = () => null,
    inputProps,
    selectable = false,
    creatable = false,
    multiple = false,
    filterSelectedOptions = false,
    draggable,
    onDragEnd,
    disableClearable = false,
    deleteOnOpen = false,
    renderTags = (...props: any) => null,
    renderOption = (...props: any) => null,
}: AutocompleteProps) => {
    const [open, setOpen] = useState(false)

    const valueArr = useMemo(
        () => items.filter(({ id }) => [...(open ? values : _.uniq([...values, ...defaultTags]))].includes(String(id))),
        [items, values, defaultTags, open]
    )

    const isDnd = draggable && onDragEnd
    const classes = useStyles({
        disableClearable,
        hasChips: Boolean(valueArr?.length)
    })

    const onChange = (e, selectedValues, reason) => {
        const isRemove = reason === 'removeOption'
        if (isRemove) e.stopPropagation() // to not open menu on delete of tag

        const isCreatable = selectedValues.find((v) => Boolean(v?.inputValue))

        if (isCreatable?.inputValue && creatable && handleCreate) {
            handleCreate(isCreatable.inputValue, e)
            return
        }

        handleChange(pluck(selectedValues, 'id'), reason)
    }

    const onFilterOptions = (options, params) => {
        const filtered = filter(options, params)

        const { inputValue } = params
        const isExisting = options.some((option) => inputValue === option.name)

        if (inputValue !== '' && !isExisting && creatable) {
            filtered.push({
                newItem: true,
                inputValue,
                name: `Создать "${inputValue}"`
            })
        }
        return filtered
    }

    const handleOpen = (e) => {
        setOpen(true)

        let input = e.target.querySelector('input')
        if (input) setTimeout(() => input.focus(), 100) // time until input will render
    }

    return (
        <ClickAwayListener
            onClickAway={() => {
                open && setOpen(false)
            }}
        >
            <Autocomplete
                openOnFocus
                open={open}
                multiple={multiple}
                filterSelectedOptions={filterSelectedOptions}
                noOptionsText={noOptionsText}
                selectOnFocus
                handleHomeEndKeys
                defaultValue={defaultValue}
                value={valueArr || []}
                popupIcon={null}
                onChange={onChange}
                filterOptions={onFilterOptions}
                options={(filterItems && filterItems(items)) || items}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => {
                    return String(option.id) === String(value.id)
                }}
                classes={{
                    popper: classes.root,
                    inputRoot: classNames(classes.input, { open }),

                    listbox: classes.listbox
                }}
                ListboxComponent={(props) => (
                    <ListboxComponent
                        isDnd={isDnd}
                        items={items}
                        onDragEnd={onDragEnd}
                        {...props}
                    />
                )}
                renderOption={({ key, ...props }, option) => {

                    const jsx = renderOption(props, option)

                    if (jsx !== null) return jsx

                    return (
                        <ListItem
                            key={key}
                            idDnd={isDnd}
                            props={props}
                            option={option}
                            selectable={selectable}
                            OptionEndAdornment={OptionEndAdornment}
                        />
                    )
                }}
                renderInput={(params) => (
                    <RenderInput
                        params={params}
                        inputProps={inputProps}
                        onClick={handleOpen}
                        Input={Input}
                    />
                )}
                renderTags={(values, getTagProps) => {
                    const jsx = renderTags(values, getTagProps, open)
                    return (
                        <Box className="rendered-tags">
                            {jsx !== null ? jsx : (
                                <>
                                    {values.slice(0, 5).map((option, index) => {
                                        const tagProps = getTagProps({ index })
                                        return (
                                            <OptionItem
                                                key={index}
                                                option={option}
                                                isSelected
                                                {...(deleteOnOpen && open || !deleteOnOpen ? {onDelete: tagProps.onDelete} : {})}
                                            />
                                        )
                                    })}
                                    {Object.values(values).length > 5
                                        ? `+${values.length - 5}`
                                        : ''}
                                </>
                            )}
                        </Box>
                    )
                }}
                disableClearable={disableClearable}
            />
        </ClickAwayListener>
    )
}

const RenderInput = ({ params, inputProps, Input, onClick }) => {

    const chips = params.InputProps.startAdornment

    const {title, rightTitle, placeholder, startAdornment} = inputProps

    return (
        <Input
            title={title}
            rightTitle={rightTitle}
            placeholder={placeholder}
            onClick={(e) => {
                if (e.target.getAttribute('data-prevent-click') !== 'true') {
                    onClick(e)
                }
            }}
            inputProps={{ ...params }}
            InputProps={{
                ...params.InputProps,

                // this is to render startAdornment icon
                startAdornment: (
                    <>
                        {!chips && startAdornment ? (
                            <InputAdornment position="start">
                                {startAdornment}
                            </InputAdornment>
                        ) : null}
                        {chips}
                    </>
                )
            }}
        />
    )
}

export default memo(CustomAutocomplete)
