
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
import classNames from 'classnames'
import { spaceBetweenProps } from '#root/src/helpers/functions.js'

const titleStyles = {
    fontSize: '14px',
    lineHeight: '16px',
    color: '#000000',
    marginBottom: '6px'
}

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: '12px'
    },

    title: titleStyles,

    rightTitle: titleStyles
}))

const Input = ({
    name,
    onChange,
    value,
    type = 'text',
    title = null,
    rightTitle = null,
    inputProps = {},
    InputProps = {},
    helperText,
    error = null,
    placeholder = null,
    width = '100%',
    height,
    label,
    endAdornment = null,
    colorPicker = false,
    inputRef,
    disabled = false,
    variant = 'outlined',
    noBorder = false,
    labelInside = false,
    size = 'normal', // normal|big|small|medium
    _classes = {},
    startAdornment = null,
    sxInput,
    inputComponent = null,
    ...props
}) => {
    const classes = useStyles({ size })

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

    const renderStartAdornment = () => {
        if (!startAdornment) return null

        return (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
        )
    }

    const renderTitle = () => {
        return (
            <>
                {title && (
                    <Typography
                        className={classNames(classes.title, _classes?.title)}
                    >
                        {title}
                    </Typography>
                )}
                {rightTitle && (
                    <Typography
                        className={classNames(classes.rightTitle, _classes?.rightTitle)}
                    >
                        {rightTitle}
                    </Typography>
                )}
            </>
        )
    }

     return (
        <Box className={classNames(classes.root, _classes?.root)} {...props}>
            {Boolean(rightTitle) ? (
                <Box {...spaceBetweenProps('center')}>{renderTitle()}</Box>
            ) : renderTitle()}
            <TextField
                type={type}
                name={name}
                label={label}
                size={size}
                fullWidth
                variant={variant}
                value={value || ''}
                placeholder={placeholder}
                onChange={onChange}
                autoComplete="off"
                autoCorrect="off"
                inputRef={inputRef}
                disabled={disabled}
                sx={{
                    '& fieldset.MuiOutlinedInput-notchedOutline': {
                        borderColor: noBorder ? '#fff' : null
                    },

                    ...(labelInside
                        ? {
                              '& input.MuiInputBase-input': {
                                  padding: '23px 15px 7px !important'
                              },

                              '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                                  padding: 0,
                                  overflow: 'visible',
                                  transform:
                                      'translate(15px, 9px) scale(0.75)!important'
                              }
                          }
                        : {}),

                    ...sxInput
                }}
                helperText={error}
                error={Boolean(error)}
                {...inputProps}
                InputProps={{
                    endAdornment: renderEndAdornment(),
                    startAdornment: renderStartAdornment(),
                    inputComponent,
                    ...InputProps
                }}
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
