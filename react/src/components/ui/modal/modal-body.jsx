import { Box } from '@mui/material'
import { withStyles } from '@mui/styles'
import classNames from 'classnames'

const styles = {
    root: {
        padding: '30px 48px 53px',
        overflowY: 'auto'
    }
}

const ModalBody = withStyles(styles)(({
    classes,
    children,
    className,
    height = false,
    ...props
}) => {
    return (
        <Box
            className={classNames(classes.root, className)}
            {...(height ? { height } : {})}
            {...props}
        >
            {children}
        </Box>
    )
})

export default ModalBody
