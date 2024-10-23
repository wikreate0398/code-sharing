import { Stack } from '@mui/material'
import classNames from 'classnames'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import React from 'react'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    emojiPicker: {
        position: 'fixed',

        pointerEvents: 'none',
        opacity: 0,
        padding: 2,
        overflow: 'auto',
        zIndex: 100,

        transition: '0.2s',
        '&.bottom': {
            transform: 'translateY(10px)'
        },
        '&.top': {
            transform: 'translateY(-110%)'
        },
        '&.active': {
            opacity: 1,
            transform: 'translateY(0px)',
            pointerEvents: 'all',
            '&.top': {
                transform: 'translateY(-100%)'
            }
        }
    }
}))

const EmojiPicker = ({ opened, anchor = 'bottom', parentRef, onSelect }) => {
    const classes = useStyles()

    const props = {
        background: 'red',
        icons: 'solid',
        emojiButtonRadius: '6px'
    }

    const { top, left, height } =
        parentRef.current?.getBoundingClientRect() || {}

    if (!opened) return

    return (
        <Stack
            className={classNames(classes.emojiPicker, anchor, {
                active: opened
            })}
            sx={{
                ...(anchor === 'bottom'
                    ? { top: top + height + 10 }
                    : { top: top - 10 }),
                left: left - 10
            }}
        >
            <Picker data={data} onEmojiSelect={onSelect} {...props} />
        </Stack>
    )
}

export default EmojiPicker
