'use client'

import {
    Box,
    InputAdornment,
    Popover,
    TextField as MuiTextField,
    Typography
} from '@mui/material'
import Sketch from '@uiw/react-color-sketch'
import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: '14px',
        lineHeight: '16px',
        color: '#000000',
        marginBottom: '6px'
    }
}))

const Input = ({
    name,
    onChange,
    value,
    type = 'text',
    title = null,
    inputProps = {},
    helperText,
    error = null,
    placeholder,
    width = '100%',
    height,
    label,
    endAdornment = null,
    colorPicker = false,
    inputRef,
    disabled = false,
    variant = 'outlined',
    ...props
}) => {
    const classes = useStyles()

    const renderEndAdornment = () => {
        if (!endAdornment && !colorPicker) return null

        return (
            <InputAdornment position="end">
                {colorPicker ? (
                    <ColorPicker color={value} setColor={onChange} />
                ) : (
                    endAdornment
                )}
            </InputAdornment>
        )
    }

    return (
        <Box {...props}>
            {title && (
                <Typography className={classes.title}>{title}</Typography>
            )}
            <TextField
                type={type}
                name={name}
                label={label}
                fullWidth
                variant={variant}
                value={value || ''}
                placeholder={placeholder}
                onChange={onChange}
                autoComplete="off"
                autoCorrect="off"
                inputRef={inputRef}
                disabled={disabled}
                InputProps={{ endAdornment: renderEndAdornment() }}
                helperText={error}
                error={Boolean(error)}
                {...inputProps}
            />
        </Box>
    )
}

const TextField = (props) => {
    return <MuiTextField {...props} />
}

const ColorPicker = ({ color, setColor }) => {
    const [anchorEl, setAnchorEl] = useState(null)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined

    return (
        <>
            <Box
                style={{
                    width: '25px',
                    height: '25px',
                    borderRadius: '8px',
                    backgroundColor: color,
                    cursor: 'pointer',
                    border: '1px solid #ccc'
                }}
                onClick={handleClick}
            />
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
            >
                <Sketch
                    color={color}
                    disableAlpha
                    onChange={(color) => setColor(color.hex)}
                />
            </Popover>
        </>
    )
}

export default Input
