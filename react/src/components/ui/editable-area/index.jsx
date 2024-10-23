import React, {
    createContext, forwardRef, memo,
    useCallback,
    useContext,
    useEffect, useImperativeHandle,
    useRef,
    useState
} from 'react'
import { makeStyles } from '@mui/styles'
import { Box, Button, ClickAwayListener, TextareaAutosize } from '@mui/material'
import classNames from 'classnames'
import { isFnc, isNull, spaceBetweenProps } from '#root/src/helpers/functions'
import Icon from '#root/src/components/ui/icon'
import Mention from '../mention'

const useStyles = makeStyles(() => ({
    root: {
        backgroundColor: 'transparent',
        outline: 'none',
        padding: '8px',
        resize: 'none',
        cursor: 'pointer',
        width: '100%',
        border: '1px solid transparent',

        '&.editing': {
            border: '1px solid #4260F2',
            cursor: 'text',
            backgroundColor: '#fff',
            boxShadow: '0px 0px 0px 3px #E8F0FE',
            borderRadius: ({ disableBorderRadius }) =>
                disableBorderRadius ? null : '8px'
        }
    }
}))

const EditableAreaStateProviderContext = createContext({
    isEditMode: false,
    enableEditMode: () => {},
    disableEditMode: () => {}
})

export const EditableAreaState = memo(({
                                           children,
                                           value: initialValue = false,
                                           toggleState = () => null
                                       }) => {
    const [isEditMode, setEditMode] = useState(initialValue)

    useEffect(() => {
        if (initialValue !== undefined) setEditMode(initialValue)
    }, [initialValue])

    const enableEditMode = () => {
        setEditMode(true)
        toggleState(true)
    }

    const disableEditMode = () => {
        setEditMode(false)
        toggleState(false)
    }

    const args = {
        isEditMode,
        enableEditMode,
        disableEditMode
    }

    return (
        <EditableAreaStateProviderContext.Provider value={{ ...args }}>
            {children(args)}
        </EditableAreaStateProviderContext.Provider>
    )
})

const EditableArea = ({
                          value: defaultValue = '',
                          onChange = null,
                          handleDisableEditMode = null,
                          triggOnEnter = false,
                          save,
                          className = null,
                          bodyClassName = null,
                          startIcon = null,
                          endIcon = null,
                          customize = {},
                          width = '100%',
                          useSaveBtn = false,
                          hasMention = false,
                          disableBorderRadius = false,
                          saveOnClickOutside = false,
                          users = [],
                          mt = null,
                          ...props
                      }) => {
    const ref = useRef()
    const containerRef = useRef()
    const [value, setValue] = useState('')

    const { isEditMode, enableEditMode, disableEditMode } = useContext(
        EditableAreaStateProviderContext
    )

    const classes = useStyles({ disableBorderRadius })

    useEffect(() => {
        setValue(defaultValue || '')
        return () => setValue('')
    }, [defaultValue])

    useEffect(() => {
        if (ref.current) {
            if (isEditMode) {
                ref.current.focus()
            } else {
                ref.current.blur()
            }
        }
    }, [isEditMode])

    function isAsync(func) {
        return typeof func === 'object' && typeof func.then === 'function'
    }

    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === 'Enter' && triggOnEnter) {
                event.preventDefault()
                handleSave()
            }
        },
        [triggOnEnter, value, disableEditMode]
    )

    const handleSave = useCallback(() => {
        const res = save(value)
        if (isAsync(res)) {
            res.then(disableEditMode).catch(disableEditMode)
        } else {
            disableEditMode()
        }
    }, [save, value, disableEditMode])

    const handleChange = useCallback(
        (e) => {
            setValue(e.target.value)
            if (isFnc(onChange)) onChange(e.target.value)
        },
        [ref, onChange]
    )

    const handleSelect = useCallback(
        (updatedText) => {
            if (!ref.current) return

            setValue(updatedText)
            if (isFnc(onChange)) onChange(updatedText)
        },
        [ref, value]
    )

    // if (isNull(value)) return nul

    return (
        <ClickAwayListener
            onClickAway={() => {
                if (!isEditMode) return
                if (saveOnClickOutside && defaultValue !== value)
                    return handleSave()

                setValue(defaultValue)
                disableEditMode()
                if (isFnc(handleDisableEditMode)) handleDisableEditMode()
            }}
        >
            <Box position="relative" width={width} mt={mt}>
                <Box
                    className={classNames(bodyClassName, {
                        editingRoot: isEditMode
                    })}
                    ref={containerRef}
                >
                    {startIcon}
                    <TextareaAutosize
                        value={value}
                        ref={ref}
                        multiline="true"
                        minRows={1}
                        onKeyDown={handleKeyDown}
                        onChange={handleChange}
                        autoCorrect="off"
                        onClick={() => {
                            if (!isEditMode) enableEditMode()
                        }}
                        className={classNames(className, classes.root, {
                            editing: isEditMode
                        })}
                        sx={{
                            '&.editing': customize || {},
                            ...props?.sx,
                            fontSize: '9px'
                        }}
                        {...props}
                    />
                    {endIcon}
                </Box>

                {hasMention && (
                    <Mention
                        data={users}
                        inputRef={ref}
                        containerRef={containerRef}
                        onSelect={handleSelect}
                        value={value}
                    />
                )}
                {useSaveBtn && isEditMode && (
                    <Save handleSave={handleSave} disableEditMode={disableEditMode}/>
                )}
            </Box>
        </ClickAwayListener>
    )
}

const Save = memo(({handleSave, disableEditMode}) => {
    return (
        <Box
            {...spaceBetweenProps()}
            gap="20px"
            width="100%"
            mt="10px"
        >
            <Button
                variant="blue"
                size="small"
                onClick={handleSave}
            >
                Сохранить
            </Button>
            <Icon name="close" v2 onClick={disableEditMode} />
        </Box>
    )
})

export default EditableArea
