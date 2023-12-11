import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
    root: ({ size }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
        border: '1px solid #C2CCD6',
        borderRadius: '4px',
        cursor: 'pointer'
    })
}))

const IconBtn = ({ children, size = 25, ...props }) => {
    const classes = useStyles({ size })
    return (
        <Box {...props} className={classes.root}>
            {children}
        </Box>
    )
}

export default IconBtn
