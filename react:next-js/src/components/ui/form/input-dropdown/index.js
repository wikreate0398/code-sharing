import Input from '@/components/ui/form/input'
import { empty, objValues } from '@/helpers/functions'
import { first } from 'lodash/array'
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state'
import { Box, Menu, MenuItem } from '@mui/material'
import { memo, useEffect } from 'react'
import { makeStyles } from '@mui/styles'
import Icon from '@/components/ui/icon'

const useStyles = makeStyles(() => ({
    selected: {
        color: '#979797',
        fontWeight: 600,
        fontSize: '16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',

        '& img': {
            marginLeft: '6px'
        }
    }
}))

const InputDropdown = ({
    inputName,
    inputValue,
    label,
    dropdownData,
    id_dropdown,
    disableDropDown = false,
    error,
    renderDropdown,
    renderSelected,
    handleChangeInput,
    handleChangeDropdown
}) => {
    return (
        <Input
            name={inputName}
            label={label}
            error={error}
            type="number"
            value={inputValue}
            onChange={handleChangeInput}
            endAdornment={
                <Dropdown
                    selected={id_dropdown}
                    disabled={disableDropDown}
                    data={dropdownData}
                    renderSelected={renderSelected}
                    renderDropdown={renderDropdown}
                    handleChange={handleChangeDropdown}
                />
            }
        />
    )
}

const Dropdown = memo(
    ({
        selected,
        data,
        handleChange,
        renderDropdown,
        renderSelected,
        disabled
    }) => {
        const classes = useStyles()

        const item = !empty(data)
            ? selected
                ? data?.find(({ id }) => id === parseInt(selected))
                : first(data)
            : {}

        useEffect(() => {
            handleChange(item?.id)
        }, [])

        if (empty(data)) return null

        return (
            <PopupState variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                    <>
                        <Box
                            {...bindTrigger(popupState)}
                            className={classes.selected}
                        >
                            {renderSelected(item)}{' '}
                            {Boolean(!disabled) && (
                                <Icon name="min-triangle" size="6,5" />
                            )}
                        </Box>
                        {Boolean(!disabled) && (
                            <Menu
                                {...bindMenu(popupState)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right'
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                            >
                                {objValues(data || []).map((value) => {
                                    return (
                                        <MenuItem
                                            key={value.id}
                                            value={value.id}
                                            onClick={() => {
                                                handleChange(value.id)
                                                popupState.close()
                                            }}
                                        >
                                            {renderDropdown(value)}
                                        </MenuItem>
                                    )
                                })}
                            </Menu>
                        )}
                    </>
                )}
            </PopupState>
        )
    }
)

export default InputDropdown
