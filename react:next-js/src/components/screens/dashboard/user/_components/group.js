import React from 'react'
import useStyles from '@/components/screens/dashboard/user/styles'
import { Stack, Typography } from '@mui/material'

const Group = ({ children, title }) => {
    const classes = useStyles()

    return (
        <Stack className={classes.group}>
            {title && (
                <>
                    <Typography className={classes.groupTitle}>
                        {title}
                    </Typography>
                    <div className={classes.divider} />
                </>
            )}
            <Stack className={classes.groupBody}>{children}</Stack>
        </Stack>
    )
}

export default Group
