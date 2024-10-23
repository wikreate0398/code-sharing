import { Container } from '@mui/material'
import Link from '#root/src/components/ui/link'
import Icon from '#root/src/components/ui/icon'
import { withStyles } from '@mui/styles'
import { flexStartProps } from '#root/src/helpers/functions'
import classNames from 'classnames'

const styles = {
    root: {
        marginTop: '70px',
        position: 'relative'
    },

    back: ({ backStyles = {} }) => {
        return {
            ...flexStartProps('center'),
            gap: '12px',
            textDecoration: 'none',
            color: '#878B9C !important',
            background: 'rgba(241, 243, 244, 1)',
            borderRadius: '20px',
            padding: '5px 15px',
            position: 'absolute',
            top: 0,
            left: '-20%',
            ...backStyles,

            '&:hover': {
                background: '#efeff0'
            }
        }
    }
}

const Inner = withStyles(styles)(({
    classes,
    maxWidth = 'sm',
    children,
    back = false,
    backStyles = {},
    className,
    ...props
}) => {
    return (
        <Container
            className={classNames(classes.root, className)}
            maxWidth={maxWidth}
            {...props}
        >
            <Back href={back} backStyles={backStyles} />
            {children}
        </Container>
    )
})

const Back = withStyles(styles)(({ classes, href = false }) => {
    if (!href) return null

    return (
        <Link href={href} className={classes.back}>
            <Icon name="arrow-left" width={6} height={12} /> Назад
        </Link>
    )
})

export default Inner
