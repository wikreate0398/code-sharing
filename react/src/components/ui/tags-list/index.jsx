import React, { memo } from 'react'
import { Box, Stack } from '@mui/material'
import { empty, textColorToBg } from '#root/src/helpers/functions'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    taskTag: {
        width: 'fit-content',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '14px',
        letterSpacing: '-0.002em'
    }
}))

const TagsList = memo(({ tags, marginBottom = '8px' }) => {
    const classes = useStyles()

    if (empty(tags)) return null

    return (
        <Stack
            flexDirection="row"
            gap="5px"
            flexWrap="wrap"
            marginBottom={marginBottom}
        >
            {tags.map(({ name, color }, i) => {
                return (
                    <Box
                        key={i}
                        className={classes.taskTag}
                        sx={{
                          background: textColorToBg(color),
                          color
                        }}>
                        {name}
                    </Box>
                )
            })}
        </Stack>
    )
}, (prev, next) => {
    return JSON.stringify(prev.tags) === JSON.stringify(next.tags)
})

export default TagsList
