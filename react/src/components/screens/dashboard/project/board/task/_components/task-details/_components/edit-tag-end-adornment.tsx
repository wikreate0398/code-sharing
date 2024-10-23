import React, {useCallback, useEffect, useRef, useState} from 'react';
import {makeStyles, useTheme} from "@mui/styles";
import {styled, Theme} from "@mui/system";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import PencilIcon from "#root/src/components/ui/svg-icons/icons/pencil-icon";
import {useParams} from "#root/renderer/hooks";
import {useDeleteTaskTagMutation, useUpdateTaskTagMutation} from "#root/src/redux/api/task/task.tags.api";
import {firstLatterUppercase, textColorToBg} from "#root/src/helpers/functions";
import classNames from "classnames";
import {Box, Button, Typography} from "@mui/material";
import Checked from "#root/src/components/ui/svg-icons/icons/checked";
import Icon from "#root/src/components/ui/icon";

const DROPDOWN_HEIGHT = 285

const useStylesAdornmaent = makeStyles((theme) => ({
    drowdown: {
        position: 'fixed',
        pointerEvents: 'none',
        opacity: 0,
        minHeight: 'auto',
        padding: '10px',
        overflow: 'auto',
        zIndex: 100,

        // to fit min 4 items in one scroll
        maxHeight: DROPDOWN_HEIGHT,
        width: 190,
        background: 'white',
        borderRadius: '8px',
        // boxShadow: '0px 6px 15px 0px #00000038',
        transition: '0.2s',
        transform: 'translateY(10px) translateX(-60%)',
        boxShadow:
            '0px 0.7512931227684021px 2.003448247909546px 0px #0000000A, 0px 6px 16px 0px #00000014',

        '&.bottom': {
            transform: 'translateY(10px) translateX(-60%)'
        },
        '&.top': {
            transform: 'translateY(-110%) translateX(-60%)'
        },
        '&.active': {
            opacity: 1,
            transform: 'translateY(0px) translateX(-60%)',
            pointerEvents: 'all',
            '&.top': {
                transform: 'translateY(-100%) translateX(-60%)'
            }
        }
    },

    rootTitle: {
        fontSize: 10,
        lineHeight: '12px',
        color: '#9499A4'
    },
    colorRoot: {
        minHeight: 32,
        borderRadius: 6,
        padding: '0 8px',
        '&:hover': {
            background: '#F3F4F7'
        }
    },
    color: {
        border: '1px solid transparent',
        width: 18,
        height: 18,
        borderRadius: 6
    },
    divider: {
        width: 'calc(100% - 28px)',
        marginLeft: '28px',
        borderTop: '0.5px solid #E8E9EEED'
    },
    removeBtn: {
        marginTop: 4,
        height: 28,
        justifyContent: 'flex-start',
        padding: '0 9px',
        gap: '9px',
        fontWeight: 400,
        boderRadius: '6px',
        color: '#F62619'
    }
}))

const NameInput = styled(TextField)({
    border: '1px solid #E8E9EEED',
    borderRadius: 6,

    '& .MuiInputBase-root': {
        '&::before, &::after': {
            content: 'none'
        }
    },

    '& .MuiInputBase-input': {
        border: 'none',
        height: 32,
        fontSize: '12px !important',
        padding: '0 10px'
    }
})

const EditTagEndAdornment = ({ id, name, color: currentColor }) => {
    const [open, setOpen] = useState(false)
    const parentRef = useRef(null)

    return <Stack sx={{ marginLeft: 'auto' }} ref={parentRef}>
        <IconButton
            onClick={(e) => {
                e.stopPropagation()
                setOpen((o) => !o)
            }}
            size="small"
            sx={{ padding: '4px' }}
        >
            <PencilIcon />
        </IconButton>
        {open && <EndAdornment
            open={open}
            name={name}
            parentRef={parentRef}
            currentColor={currentColor}
            id={id}
            onClose={() => setOpen(false)}/>}
    </Stack>
}

const EndAdornment = ({open, parentRef, name, currentColor, id, onClose}) => {
    const classes = useStylesAdornmaent()
    const theme: Theme = useTheme()
    const { id_project } = useParams()
    const [updateTag] = useUpdateTaskTagMutation()
    const [deleteTag] = useDeleteTaskTagMutation()

    const [value, setValue] = useState(name)

    useEffect(() => {
        setValue(name)
    }, [name])

    const onUpdate = useCallback((fields = {}) => updateTag({id, id_project, ...fields}), [id, id_project])

    const handleEditName = () => {
        if (value === name || !value) return

        onUpdate({name: value})
    }

    const handleChangeColor = useCallback((color) => onUpdate({ color }), [])

    const inputRef = useRef(null)

    const { height, top: positionX } = parentRef.current?.getBoundingClientRect() || {}
    let { offsetTop, parentElement} = parentRef.current?.parentElement || {}
    let scrollTop = parentElement.scrollTop
    let top = offsetTop - scrollTop
    let isNotFitScreen = positionX + DROPDOWN_HEIGHT > window.innerHeight
    let anchor = isNotFitScreen ? 'top' : 'bottom'

    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === 'Enter') {
                event.preventDefault()
                handleEditName()
            }
        },
        [handleEditName]
    )

    const colors = Object.entries(theme.palette.tags).map(
        ([name, color]) => ({
            color,
            name: firstLatterUppercase(name),
            bg: textColorToBg(color)
        })
    )

    return (
        <Stack
            sx={{
                left: '100%',
                ...(anchor === 'bottom'
                    ? { top: top + height + 10, }
                    : { top }),
            }}
            className={classNames(classes.drowdown, anchor, {
                active: open
            })}
        >
            <NameInput
                size="small"
                variant="standard"
                ref={inputRef}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value)
                }}
                // @ts-ignore
                onClick={(e) => {
                    e.stopPropagation()
                    e.target?.focus()
                }}
                onKeyDown={handleKeyDown}
            />

            <Stack mt="10px">
                <Typography mb="5px" className={classes.rootTitle}>
                    Цвет
                </Typography>
                <Stack gap="2px">
                    {colors.map(({ color, bg, name }, i) => {
                        let is = currentColor === color

                        return (
                            <Stack
                                key={i}
                                gap="8px"
                                flexDirection="row"
                                alignItems="center"
                                className={classes.colorRoot}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleChangeColor(color)
                                }}
                            >
                                <Box
                                    className={classes.color}
                                    sx={{
                                        borderColor: `${color}!important`,
                                        background: bg
                                    }}
                                />
                                <Typography variant="subtitle-13">
                                    {name}
                                </Typography>
                                {is && (
                                    <Checked
                                        style={{ marginLeft: 'auto' }}
                                    />
                                )}
                            </Stack>
                        )
                    })}
                </Stack>
                <div className={classes.divider} />
                <Button className={classes.removeBtn} onClick={(e) => {
                    e.stopPropagation()
                    deleteTag({id, id_project})
                }}>
                    <Icon name="delete" width={16} height={16} />
                    Удалить
                </Button>
            </Stack>
        </Stack>
    )
}

export default EditTagEndAdornment;