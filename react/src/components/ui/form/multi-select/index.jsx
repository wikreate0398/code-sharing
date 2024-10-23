import React, { useEffect, useMemo, useState } from 'react'
import {
    Box,
    Chip,
    ClickAwayListener,
    FormGroup,
    FormHelperText,
    FormLabel,
    Paper,
    Typography
} from '@mui/material'
import { formLabel, isFnc, searchData } from '#root/src/helpers/functions'
import Input from '#root/src/components/ui/form/input'
import Icon from '../../icon'
import useStyles from './styles'
import classNames from 'classnames'

/**
 * @todo maybe need refactoring via using hook "useAutocomplete"
 * @see https://mui.com/base-ui/react-autocomplete/hooks-api/
 */
const Multiselect = ({
    initialItems: defaultItems,
    label,
    values,
    onCreate,
    onSelect,
    onCancel,
    onQuery,
    placeholder = null,
    size = 'medium',
    error = null,
    _overrideClasses = {}
}) => {
    const classList = useStyles({ hasSelected: values.length > 0, size })
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState('')

    const initialItems = useMemo(
        () => searchData(defaultItems, value),
        [defaultItems, value]
    )

    useEffect(() => {
        setOpen(value.length > 0)
    }, [value])

    const canCreate = () => {
        return (
            initialItems.filter(
                ({ name }) => name.toLowerCase() === value.toLowerCase()
            ).length <= 0
        )
    }

    const handleSelect = (option, selected) => {
        const handler = selected ? onCancel : onSelect
        setOpen(false)
        return handler(option)
    }

    const handleOpen = () => {
        if (value.length <= 0) return
        setOpen(true)
    }

    const handleCreate = (value) => {
        onCreate(value)
        setOpen(false)
    }

    return (
        <Box position="relative">
            <FormGroup className={classList.formGroup}>
                <FormLabel sx={{ ...formLabel(), marginBottom: '6px' }}>
                    {label}
                </FormLabel>
                <Box
                    className={classNames(
                        classList.wrapper,
                        _overrideClasses?.wrapper
                    )}
                >
                    {values?.length > 0 &&
                        values.map((option, index) => (
                            <Chip
                                key={index}
                                className={classList.selectedItem}
                                label={option.name}
                                size={size}
                                deleteIcon={
                                    <Icon name="close" width={18} height={18} />
                                }
                                onDelete={() => onCancel(option)}
                            />
                        ))}
                    <Input
                        className={classNames(
                            classList.input,
                            _overrideClasses?.input
                        )}
                        value={value}
                        type="text"
                        placeholder={placeholder}
                        onChange={(e) => {
                            setValue(e.target.value)
                            if (isFnc(onQuery)) onQuery(e)
                        }}
                        onClick={handleOpen}
                    />
                </Box>
            </FormGroup>
            {open && (
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                    <Paper elevation={3} className={classList.dropdown}>
                        <Box>
                            <Typography
                                fontSize={13}
                                className={classList.dropdownLabel}
                            >
                                Выберите опцию или создайте новую
                            </Typography>
                            <Box className={classList.dropdownWrapper}>
                                {initialItems?.length > 0 &&
                                    initialItems.map((option, index) => (
                                        <Chip
                                            key={index}
                                            className={classList.selectedItem}
                                            label={option.name}
                                            sx={
                                                values.includes(option)
                                                    ? { opacity: '.8' }
                                                    : {}
                                            }
                                            onClick={() => {
                                                handleSelect(
                                                    option,
                                                    values.includes(option)
                                                )
                                                setValue('')
                                            }}
                                        />
                                    ))}
                                {initialItems?.length <= 0 && (
                                    <p>Ничего не найдено</p>
                                )}
                            </Box>
                        </Box>
                        {canCreate() && (
                            <Box className={classList.dropdownCreate}>
                                <Typography
                                    fontSize={15}
                                    className={classList.dropdownLabel}
                                >
                                    Создать
                                </Typography>
                                <Chip
                                    sx={{ cursor: 'pointer' }}
                                    className={classList.selectedItem}
                                    label={value}
                                    onClick={() => {
                                        handleCreate(value)
                                        setValue('')
                                    }}
                                />
                            </Box>
                        )}
                    </Paper>
                </ClickAwayListener>
            )}

            {Boolean(error) && (
                <FormHelperText sx={{ marginLeft: '14px' }} error>
                    {error}
                </FormHelperText>
            )}
        </Box>
    )
}

export default Multiselect
