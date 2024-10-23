import React from 'react'
import { Typography, Stack } from '@mui/material'
import useStyles from '#root/src/components/screens/dashboard/projects/_modal/styles'

const FormGroup = ({ label, children, ...props }) => {
    const classes = useStyles()

    return (
        <Stack className={classes.formGroup} {...props}>
            {label ? (
                <Typography className={classes.formGroupText}>
                    {label}
                </Typography>
            ) : null}
            {children}
        </Stack>
    )
}

export default FormGroup
