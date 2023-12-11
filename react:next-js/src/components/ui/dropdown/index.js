import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state'
import { Button, Menu, MenuItem } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { styled } from '@mui/styles'

const CustomBtn = styled(Button)(() => ({
    '&.MuiButtonBase-root': {
        borderRadius: '6px !important',
        border: 'solid 1px rgba(206, 206, 206, 1) !important',
        boxSizing: 'border-box',
        cursor: 'pointer',
        fontSize: '12px',
        outline: 'none',
        color: 'rgba(206, 206, 206, 1)',
        padding: '5px 30px 5px 9px',
        position: 'relative',
        lineHeight: '1 !important',
        whiteSpace: 'nowrap',

        '& span': { lineHeight: '100%' },
        '& img': { marginRight: '5px' },

        '&:after': {
            borderBottom: '1px solid #000',
            borderRight: '1px solid #000',
            content: '""',
            display: 'block',
            height: '3px',
            width: '3px',
            marginTop: '-2px',
            pointerEvents: 'none',
            position: 'absolute',
            right: '12px',
            top: '50%',
            WebkitTransformOrigin: '66% 66%',
            msTransformOrigin: '66% 66%',
            transformOrigin: '66% 66%',
            WebkitTransform: 'rotate(45deg)',
            msTransform: 'rotate(45deg)',
            transform: 'rotate(45deg)',
            WebkitTransition: 'all 0.15s ease-in-out',
            transition: 'all 0.15s ease-in-out'
        }
    },

    open: {
        '&:after': {
            content: '""',
            webkitTransform: 'rotate(-135deg)',
            msTransform: 'rotate(-135deg)',
            transform: 'rotate(-135deg)'
        }
    }
}))

const DropDown = ({ data, selected: defSelect, onSelect }) => {
    const [selected, setSelected] = useState(defSelect)

    useEffect(() => {
        setSelected(defSelect)
    }, [defSelect])

    const handleClick = useCallback(
        (value) => {
            onSelect(value)
        },
        [onSelect]
    )

    const name =
        data.filter((v) => v.value === selected)?.[0]?.name ?? 'Выбрать'

    return (
        <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
                <>
                    <CustomBtn {...bindTrigger(popupState)}>{name}</CustomBtn>
                    <Menu {...bindMenu(popupState)}>
                        {data.map(({ name, value }, k) => {
                            return (
                                <MenuItem
                                    key={k}
                                    onClick={() => {
                                        handleClick(value)
                                        popupState.close()
                                    }}
                                >
                                    {name}
                                </MenuItem>
                            )
                        })}
                    </Menu>
                </>
            )}
        </PopupState>
    )
}

export default DropDown
