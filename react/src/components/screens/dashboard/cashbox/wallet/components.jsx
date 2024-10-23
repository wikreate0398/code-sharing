import { withStyles } from '@mui/styles'
import { Box } from '@mui/material'
import classNames from 'classnames'
import { flexEndProps } from '#root/src/helpers/functions'

const styles = {
    container: {
        width: '210px',
        backgroundColor: '#f2f3f4',
        borderRadius: '12px',
        padding: '20px',

        '& .actions': {
            display: 'none'
        },

        '&:hover': {
            backgroundColor: '#efeff0',
            '& .actions': {
                ...flexEndProps()
            }
        }
    },

    currency: ({ color = '#2D4E0D', mb, bg }) => ({
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: 600,
        color,
        backgroundColor: bg
    }),

    value: {
        color: '#000',
        fontSize: '20px',
        fontWeight: 600,
        marginBottom: '5px',
        letterSpacing: '-0.2 px'
    },

    description: {
        color: '#00000070',
        fontSize: '13px',
        fontWeight: 400
    }
}

const WalletContainer = withStyles(styles)(({
    classes,
    children,
    className,
    ...props
}) => {
    return (
        <Box className={classNames(classes.container, className)} {...props}>
            {children}
        </Box>
    )
})

const Currency = withStyles(styles)(({ classes, children }) => {
    return <Box className={classes.currency}>{children}</Box>
})

const Value = withStyles(styles)(({ classes, children }) => {
    return <Box className={classes.value}>{children}</Box>
})

const Description = withStyles(styles)(({ classes, children }) => {
    return <Box className={classes.description}>{children}</Box>
})

export { WalletContainer, Currency, Value, Description }
