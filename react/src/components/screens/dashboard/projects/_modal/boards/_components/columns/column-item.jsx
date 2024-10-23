import React, { useCallback, useEffect, useRef, useState } from 'react'
import useStyles from '#root/src/components/screens/dashboard/projects/_modal/styles'
import {
    ClickAwayListener,
    Collapse,
    IconButton,
    Stack,
    Typography
} from '@mui/material'
import { declination } from '#root/src/helpers/functions'
import ArrowDown from '../../../../../../../ui/svg-icons/icons/arrow-down'
import Icon from '#root/src/components/ui/icon'
import { styled } from '@mui/system'
import TextField from '@mui/material/TextField'
import EmojiStr from '#root/src/components/ui/emoji-component'
import EmojiPicker from '#root/src/components/ui/emoji-picker'
import classNames from 'classnames'
import SmileEmoji from '../../../../../../../ui/svg-icons/icons/smile-emoji'
import ColumnParticipants from '#root/src/components/screens/dashboard/projects/_modal/boards/_components/columns/column-participants'
import useColumnItem from '#root/src/components/screens/dashboard/projects/_modal/boards/_hooks/useColumnItem'

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
        height: 30
    }
})

const ColumnItem = ({ item, onDelete }) => {
    const classes = useStyles()
    const {
        expanded,
        handler,
        responsible_count,
        opened,
        handleChange,
        handleSubmitValue,
        handleSubmitEmoji,
        onExpand,
        toggleEmoji,
        emojiRef,
        setOpenEmoji,

        active,
        value
    } = useColumnItem(item)
    const { id, responsible, emoji } = item || {}

    return (
        <Stack className={classes.boardInfoCard}>
            <Stack className={classes.boardColumnItem}>
                <ClickAwayListener
                    onClickAway={() => {
                        setOpenEmoji(false)
                    }}
                >
                    <div ref={emojiRef}>
                        <EmojiPicker
                            anchor="top"
                            parentRef={emojiRef}
                            opened={opened}
                            onClose={() => setOpenEmoji(false)}
                            onSelect={handleSubmitEmoji}
                        />

                        <Stack
                            className={classNames(classes.emojiComponent, {
                                empty: !emoji,
                                active: opened
                            })}
                            onClick={toggleEmoji}
                        >
                            {emoji ? (
                                <EmojiStr size={15}>{emoji}</EmojiStr>
                            ) : (
                                <SmileEmoji />
                            )}
                        </Stack>
                    </div>
                </ClickAwayListener>

                <Stack className={classes.boardColumnInfo}>
                    <ClickAwayListener
                        onClickAway={() => {
                            handleSubmitValue()
                        }}
                    >
                        <Stack
                            className={classes.boardColumnInner}
                            onClick={handler}
                        >
                            {!active ? (
                                <>
                                    <Typography
                                        variant="subtitle-13"
                                        className={classes.boardColumnName}
                                    >
                                        {value}
                                    </Typography>
                                    {Boolean(responsible_count) && (
                                        <Typography
                                            className={
                                                classes.columnParticipantsNumber
                                            }
                                        >
                                            {responsible_count}{' '}
                                            {declination(
                                                responsible_count,
                                                'отвественный',
                                                'отвественных',
                                                'отвественных'
                                            )}
                                        </Typography>
                                    )}
                                </>
                            ) : (
                                <SearchInput
                                    size="small"
                                    autoFocus={true}
                                    variant="standard"
                                    value={value}
                                    onChange={handleChange}
                                    onKeyDown={(event) => {
                                        if (
                                            event.code === 'Enter' ||
                                            event.code === 'NumpadEnter'
                                        ) {
                                            event.preventDefault()
                                            handleSubmitValue()
                                        }
                                    }}
                                />
                            )}
                        </Stack>
                    </ClickAwayListener>

                    <Stack gap="2px" flexDirection="row">
                        <IconButton
                            onClick={onExpand}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ArrowDown active={expanded} />
                        </IconButton>
                        <IconButton onClick={onDelete}>
                            <Icon
                                name="delete-grey"
                                width={14}
                                height={16}
                                pointer
                                v2
                            />
                        </IconButton>
                    </Stack>
                </Stack>
            </Stack>
            <Collapse
                in={expanded}
                timeout="auto"
                sx={{
                    zIndex: 10
                }}
            >
                <ColumnParticipants responsible={responsible} id_column={id} />
            </Collapse>
        </Stack>
    )
}

export default ColumnItem
