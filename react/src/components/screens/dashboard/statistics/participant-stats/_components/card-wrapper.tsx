import React from 'react'
import useStyles from '#root/src/components/screens/dashboard/statistics/participant-stats/styles'
import Stack from '@mui/material/Stack'
import { Alert, Box, Typography } from '@mui/material'
import { spaceBetweenProps } from '#root/src/helpers/functions'

const CardWrapper = ({
    title,
    children,
    isAlert = false,
    alertMessage = 'Активность не обнаружена',
    rightSide = null
}) => {
    const classes = useStyles()

    return (
        <Stack className={classes.card}>
            <Box {...spaceBetweenProps()} mb="16px">
                <Typography className={classes.cardTitle}>{title}</Typography>
                {Boolean(rightSide) && rightSide()}
            </Box>
            {isAlert ? (
                <Alert severity="info" sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            ) : (
                children
            )}
        </Stack>
    )
}

export default CardWrapper
