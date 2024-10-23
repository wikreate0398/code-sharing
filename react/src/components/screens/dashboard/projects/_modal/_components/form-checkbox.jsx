import React from 'react'
import useStyles from '#root/src/components/screens/dashboard/projects/_modal/styles'
import { Stack, Typography } from '@mui/material'
import classNames from 'classnames'

const FormCheckbox = ({ name, value, setFieldValue, options }) => {
    const classes = useStyles()

    return (
        <Stack className={classes.paymentIntervalBox}>
            {options.map(({ label, value: v }, i) => {
                return (
                    <Typography
                        key={v + label}
                        onClick={() => setFieldValue(name, v)}
                        className={classNames(classes.paymentIntervalText, {
                            active: v === value
                        })}
                    >
                        {label}
                    </Typography>
                )
            })}
        </Stack>
    )
}

export default FormCheckbox
