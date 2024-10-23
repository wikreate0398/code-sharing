import Emojis from 'react-emoji-component'
import React from 'react'
import { createStyles, makeStyles } from '@mui/styles'

const useStyles = makeStyles(() =>
    createStyles({
        root: {}
    })
)

const EmojiStr = ({ children, size = 14, mr = null, ...props }) => {
    const classList = useStyles({ mr })
    return (
        <Emojis className={classList.root} size={parseInt(size)} {...props}>
            {children}
        </Emojis>
    )
}

export default EmojiStr
