import React from 'react'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
    root: {
        backgroundColor: '#E9E9E9',
        padding: '4px 6px',
        borderRadius: '6px',
        color: '#818181',
        fontSize: '16px',
        lineHeight: '16px',
        fontWeight: 600
    }
}))

const Label = ({ value }) => {
    const classes = useStyles()
    return (
        <Box component="span" className={classes.root}>
            {value}
        </Box>
    )
}

export default Label
