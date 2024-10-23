import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Box, ClickAwayListener, Popover } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'
import {
    flexStartProps,
    getLastSymbolPosition
} from '#root/src/helpers/functions'
import Avatar from '../avatar'
import ReactDOM from 'react-dom'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            position: 'fixed',
            zIndex: 1040,
            width: '220px',
            background: '#F2F3F4',
            borderRadius: '12px',
            maxHeight: '300px',
            overflow: 'hidden auto'
        },
        mentionItem: {
            ...flexStartProps('center'),
            gap: '8px',
            padding: '12px',

            '&:hover': {
                background: '#dfe3e6',
                cursor: 'pointer'
            }
        },
        login: {
            fontSize: '12px',
            lineHeight: '18px'
        }
    })
)

const Mention = ({ data, onSelect, inputRef, containerRef, key = 'login' }) => {
    const [isShow, setIsShow] = useState(false)
    const popperRef = useRef()
    const [coord, setCoord] = useState({
        top:1, left: 1
    }) // last written symbol coords
    const [mentions, setMentions] = useState([])
    const [mentionText, setMentionText] = useState('')
    const classList = useStyles()

    useEffect(() => {
        if (popperRef.current) {
            const { top, left } = getLastSymbolPosition(inputRef, popperRef)
            setCoord({ top, left })
        }

        handleSearch()
    }, [inputRef.current?.value, popperRef])

    useEffect(() => {
        if (popperRef.current && isShow) {
            const { top, left } = getLastSymbolPosition(inputRef, popperRef)
            setCoord({ top, left })
        }
    }, [isShow, popperRef])

    const handleSearch = useCallback(() => {
        const { selectionStart, value } = inputRef.current
        const textBeforeCursor = value.substring(0, selectionStart)
        const mentionTriggerText = textBeforeCursor.lastIndexOf('@')

        if (mentionTriggerText !== -1) {
            const mentionText = textBeforeCursor.substring(
                mentionTriggerText + 1
            )

            setMentionText(mentionText)
            setMentions(fetchMentions(mentionText))
            setIsShow(true)

            return
        }

        setMentionText('')
        setIsShow(false)
    }, [setMentionText, setMentions, setIsShow, inputRef.current])

    const handleSelect = useCallback(
        (mention) => {
            const { selectionStart, value } = inputRef.current

            const length = mentionText.length + 1
            const textBeforeCursor = value.substring(0, selectionStart)
            const textAfterCursor = value.substring(textBeforeCursor.length)
            const textBeforeFormatted = textBeforeCursor.substring(
                0,
                textBeforeCursor.length - length
            )
            const textAfterFormatted = textAfterCursor.substring(
                0,
                textAfterCursor.length + length
            )
            const newText =
                textBeforeFormatted + `@${mention[key]} ` + textAfterFormatted

            onSelect(newText)
            setIsShow(false)
            setMentionText('')
        },
        [onSelect, mentionText, setIsShow, setMentionText, inputRef.current]
    )

    const fetchMentions = (query) => {
        return data.filter((mention) =>
            mention[key].toLowerCase().includes(query.toLowerCase())
        )
    }

    if (!isShow || !inputRef.current) return null

    const {top, left} = coord

    return (
        <ClickAwayListener onClickAway={() => setIsShow(false)}>
            <Box
                ref={popperRef}
                className={classList.root}
                sx={{
                    left: `${left}px`,
                    top: `${top}px`
                }}
            >
                <MentionsList mentions={mentions} handleSelect={handleSelect}/>
            </Box>
        </ClickAwayListener>
    )
}

const MentionsList = memo(({mentions, handleSelect}) => {
    const classList = useStyles()
    return (
        <>
            {mentions.map((user) => (
                <Box
                    key={user.id}
                    className={classList.mentionItem}
                    onClick={() => handleSelect(user)}
                >
                    <Avatar name={user.name} size={16} />
                    <Box component="span" className={classList.login}>
                        @{user.login}
                    </Box>
                </Box>
            ))}
        </>
    )
}, (p, n) => p.mentions === n.mentions)

export default memo(Mention)
