import { Box } from '@mui/material'
import { withStyles } from '@mui/styles'

const styles = {
    root: {
        padding: '30px 48px 53px',
        overflowY: 'auto'
    }
}

const ModalBody = withStyles(styles)(({
    classes,
    children,
    height = false,
    ...props
}) => {
    return (
        <Box
            className={classes.root}
            {...(height ? { height } : {})}
            {...props}
        >
            {children}
        </Box>
    )
})

export default ModalBody
