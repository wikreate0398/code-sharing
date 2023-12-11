import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react'
import { makeStyles } from '@mui/styles'
import { Box, Button, ClickAwayListener, TextareaAutosize } from '@mui/material'
import classNames from 'classnames'
import { isFnc, isNull, spaceBetweenProps } from '@/helpers/functions'
import Icon from '@/components/ui/icon'
import Mention from '../mention'

const useStyles = makeStyles(() => ({
    root: ({ customize }) => ({
        backgroundColor: 'transparent',
        outline: 'none',
        padding: '5px',
        resize: 'none',
        cursor: 'pointer',
        width: '100%',
        border: '2px solid transparent',

        '&.editing': {
            border: '2px solid #388bff',
            cursor: 'text',
            borderRadius: '3px',
            backgroundColor: '#fff',
            ...customize
        }
    })
}))

const EditableAreaStateProviderContext = createContext({
    isEditMode: false,
    enableEditMode: () => {},
    disableEditMode: () => {}
})

export const EditableAreaState = ({ children }) => {
    const [isEditMode, setEditMode] = useState(false)
    const [value, setValue] = useState('')

    const handleSelectValue = (v) => {
        setValue(v || '')
    }

    const enableEditMode = () => {
        setEditMode(true)
    }

    const disableEditMode = () => {
        setEditMode(false)
    }

    const args = {
        value,
        isEditMode,
        enableEditMode,
        disableEditMode
    }

    return (
        <EditableAreaStateProviderContext.Provider
            value={{ ...args, setValue: handleSelectValue }}
        >
            {children(args)}
        </EditableAreaStateProviderContext.Provider>
    )
}

const EditableArea = ({
    value: defaultValue,
    onChange,
    handleDisableEditMode,
    triggOnEnter = false,
    save,
    className,
    customize = {},
    width = '100%',
    useSaveBtn = false,
    hasMention = false,
    users = [],
    ...props
}) => {
    const ref = useRef()

    const { value, setValue, isEditMode, enableEditMode, disableEditMode } =
        useContext(EditableAreaStateProviderContext)

    const classes = useStyles({ isEditMode, customize })

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

    if (isNull(value)) return null

    return (
        <ClickAwayListener
            onClickAway={() => {
                if (!isEditMode) return
                setValue(defaultValue)
                disableEditMode()
                if (isFnc(handleDisableEditMode)) handleDisableEditMode()
            }}
        >
            <Box position="relative" width={width}>
                <TextareaAutosize
                    value={value}
                    ref={ref}
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
                    {...props}
                />

                {hasMention && (
                    <Mention
                        data={users}
                        inputRef={ref}
                        onSelect={handleSelect}
                        value={value}
                    />
                )}
                {useSaveBtn && isEditMode && (
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
                )}
            </Box>
        </ClickAwayListener>
    )
}

export default EditableArea
