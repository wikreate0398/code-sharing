import { memo, useCallback, useEffect, useState } from 'react'
import { Box, ClickAwayListener } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'
import { flexStartProps, getLastSymbolPosition } from '@/helpers/functions'
import Avatar from '../avatar'
import _ from 'lodash'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            position: 'absolute',
            left: ({ coord }) => `${coord[0] * 5}px`,
            top: ({ coord }) => `${coord[1] * 5 * 4 - 12}px`,
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

const Mention = memo(({ data, onSelect, inputRef, key = 'login' }) => {
    const [isShow, setIsShow] = useState(false)
    const [coord, setCoord] = useState([1, 1]) // last written symbol coords
    const [mentions, setMentions] = useState([])
    const [mentionText, setMentionText] = useState('')
    const classList = useStyles({ coord })

    useEffect(() => {
        setCoord(getLastSymbolPosition(inputRef))

        handleSearch()
    }, [inputRef.current?.value])

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

    if (!isShow) return null

    return (
        <ClickAwayListener onClickAway={() => setIsShow(false)}>
            <Box className={classList.root}>
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
            </Box>
        </ClickAwayListener>
    )
})

export default Mention
