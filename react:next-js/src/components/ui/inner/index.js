import { Container } from '@mui/material'
import Link from 'next/link'
import Icon from '@/components/ui/icon'
import { withStyles } from '@mui/styles'
import { flexStartProps } from '@/helpers/functions'

const styles = {
    root: {
        marginTop: '70px',
        position: 'relative'
    },

    back: {
        ...flexStartProps('center'),
        gap: '12px',
        textDecoration: 'none',
        color: '#878B9C',
        position: 'absolute',
        top: 0,
        left: '-30%'
    }
}

const Inner = withStyles(styles)(({
    classes,
    maxWidth = 'sm',
    children,
    back = false,
    ...props
}) => {
    return (
        <Container className={classes.root} maxWidth={maxWidth} {...props}>
            <Back href={back} />
            {children}
        </Container>
    )
})

const Back = withStyles(styles)(({ classes, href = false }) => {
    if (!href) return null

    return (
        <Link href={href} className={classes.back}>
            <Icon name="arrow-left" width={6} height={12} /> Back
        </Link>
    )
})

export default Inner
