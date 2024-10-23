import React, { memo, useCallback, useRef, useState } from 'react'
import useStyles from '#root/src/components/screens/dashboard/projects/_modal/styles'
import { empty, flexStartProps } from '#root/src/helpers/functions'
import {
    Box,
    Button,
    ClickAwayListener,
    Stack,
    Typography
} from '@mui/material'
import classNames from 'classnames'
import Icon from '#root/src/components/ui/icon'
import { styled } from '@mui/system'
import TextField from '@mui/material/TextField'
import ContainerLoader from '#root/src/components/ui/loader/container-loader'
import ParticipantItem from '#root/src/components/screens/dashboard/projects/_modal/participants/_components/participant-item'
import useDebouncedCallback from '#root/src/hooks/useDebouncedCallback'

const Autocomplete = ({
    size = 'large', // large|small
    anchor = 'bottom', // bottom|top
    searchable = true,
    label = 'Добавить',
    onSearchReq = null,
    onSelect = () => null,
    onPressEnter = () => null,
    noBorder = false,
    sx
}) => {
    const classes = useStyles()
    const [active, setActive] = useState(false)
    const handler = useCallback(() => {
        setActive(!active)
    }, [active])
    const isLarge = size === 'large'
    const iconSize = isLarge ? 12 : 8

    const parentRef = useRef()

    return (
        <ClickAwayListener onClickAway={() => setActive(false)}>
            <Box
                {...flexStartProps('center')}
                gap={isLarge ? '14px' : '10px'}
                sx={sx}
                className={classNames(classes.addParticipantBox, size, {
                    active
                })}
                ref={parentRef}
            >
                <Button
                    className={classNames(classes.addParticipantBtn, size)}
                    onClick={handler}
                >
                    <Icon
                        pointer
                        name="plus"
                        width={iconSize}
                        height={iconSize}
                        v2
                    />
                </Button>
                <Stack
                    className={classNames(classes.userInfoBox, {
                        active,
                        noBorder
                    })}
                >
                    {!active ? (
                        <Typography
                            onClick={handler}
                            className={classes.addParticipantText}
                        >
                            {label}
                        </Typography>
                    ) : (
                        <Search
                            parentRef={parentRef}
                            anchor={anchor}
                            onClose={handler}
                            searchable={searchable}
                            onSearchReq={onSearchReq}
                            handleSelect={onSelect}
                            handlePressEnter={onPressEnter}
                        />
                    )}
                </Stack>
            </Box>
        </ClickAwayListener>
    )
}

const SearchInput = styled(TextField)({
    border: 'none',
    borderRadius: 0,

    '& .MuiInputBase-root': {
        '&::before, &::after': {
            content: 'none'
        }
    },

    '& .MuiInputBase-input': {
        padding: '0px !important',
        border: 'none',
        height: 40
    }
})

const Search = memo(
    ({
        onClose: handleClose,
        searchable,
        onSearchReq,
        handleSelect,
        handlePressEnter,
        anchor,
        parentRef
    }) => {
        const classes = useStyles()

        const [loading, setLoading] = useState(false)
        const [value, setValue] = useState('')
        const [result, setResult] = useState([])

        const onClose = useCallback(() => {
            handleClose()
        }, [handleClose])

        const handleSearch = useCallback(
            async (search) => {
                if (!searchable) return

                if (search.length < 2) {
                    if (!empty(result)) setResult([])
                    return
                }

                setLoading(true)

                await onSearchReq(search).then((resp) => {
                    setResult(resp)
                })

                setLoading(false)
            },
            [onSearchReq, result, searchable]
        )

        const handleDelaySearchReq = useDebouncedCallback(handleSearch, 200)

        const { top, left, height, width } =
            parentRef.current?.getBoundingClientRect() || {}

        return (
            <>
                <SearchInput
                    size="small"
                    autoFocus={true}
                    variant="standard"
                    value={value}
                    onChange={(e) => {
                        const search = e.target.value
                        setValue(search)

                        handleDelaySearchReq(search)
                    }}
                    onKeyDown={(event) => {
                        if (
                            handlePressEnter &&
                            (event.code === 'Enter' ||
                                event.code === 'NumpadEnter')
                        ) {
                            event.preventDefault()
                            handlePressEnter(value, () => {
                                onClose()
                                setValue('')
                            })
                        }
                    }}
                />

                {searchable && value.length ? (
                    <Stack
                        sx={{
                            ...(anchor === 'bottom'
                                ? { top: top + height + 10 }
                                : { top }),
                            left: left - 10,
                            width: width + 20
                        }}
                        className={classNames(
                            classes.participantDrowdown,
                            anchor,
                            {
                                active: searchable && value.length
                            }
                        )}
                    >
                        {loading ? (
                            <ContainerLoader overlay size={30} />
                        ) : !result || !result?.length ? (
                            <Typography
                                variant="subtitle-13"
                                className={classes.notFoundText}
                            >
                                Ничего нет найдено
                            </Typography>
                        ) : (
                            result.map((item) => (
                                <ParticipantItem
                                    key={item.id}
                                    item={item}
                                    onSelect={(e) => {
                                        e.stopPropagation()

                                        handleSelect(item, () => {
                                            onClose && onClose()
                                            setResult([])
                                        })
                                    }}
                                />
                            ))
                        )}
                    </Stack>
                ) : null}
            </>
        )
    }
)

export default Autocomplete
