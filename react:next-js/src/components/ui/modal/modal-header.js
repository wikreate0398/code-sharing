import { Box } from '@mui/material'
import { withStyles } from '@mui/styles'
import classNames from 'classnames'

const styles = {
    root: {
        display: 'flex',
        color: '#000 !important',
        margin: '40px 0 0',
        borderTopLeftRadius: '0.3rem',
        borderTopRightRadius: '0.3rem',
        padding: '0 25px'
    },

    title: {
        fontSize: '24px !important',
        marginBottom: '0',
        lineHeight: 1.5,
        fontWeight: '500 !important',
        textAlign: 'center'
    }
}

const ModalHeader = withStyles(styles)(({
    classes,
    className,
    children,
    justifyContent = 'center',
    ...props
}) => {
    return (
        <Box
            className={classNames(classes.root, className)}
            justifyContent={justifyContent}
            {...props}
        >
            <h5 className={classes.title}>{children}</h5>
        </Box>
    )
})

export default ModalHeader
