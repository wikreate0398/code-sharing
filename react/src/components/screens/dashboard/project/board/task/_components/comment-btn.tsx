import Icon from '#root/src/components/ui/icon'
import { Box, BoxProps } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { memo } from 'react'

const useStyles = makeStyles(() => ({
    root: {
        backgroundColor: '#fff',
        borderRadius: '4px',
        boxShadow: '0px 1px 2px 0px #0000001A',
        padding: '4px 6.5px 3.5px',
        cursor: 'pointer',
        height: '24px'
    }
}))

const CommentBtn = memo((props: BoxProps) => {
    const classes = useStyles()

    return (
        <Box className={classes.root} {...props}>
            <Icon name="comment" width={12} height={12} />
        </Box>
    )
})

export default CommentBtn
