import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import classNames from 'classnames'

const useStyles = makeStyles(() => ({
    root: ({ styles }) => styles
}))

const Td = (data) => {
    const {
        children,
        width = false,
        maxWidth,
        nw = true,
        bold = false,
        semibold = false,
        color,
        bebas = false,
        iterationCell = false,
        noPadding = false,
        style = {},
        right = false,
        left = false,
        ac = false,
        view = true,
        padding = null,
        ellipsis,
        className,
        ...props
    } = data

    const newStyle = {
        ...style,
        width: width,
        minWidth: width,
        maxWidth: width,
        whiteSpace: nw && 'nowrap',
        textAlign: ac ? 'center' : 'left',
        fontWeight: bold ? 'bold' : semibold ? '500' : 'normal',
        color: color || false,
        padding: `${padding ? `${padding} !important` : null}`
    }

    if (left || right) {
        newStyle['textAlign'] = left ? 'left' : 'right'
    }

    if (iterationCell && !color) {
        newStyle['color'] = '#00000066'
        newStyle['width'] = '5px'
    }

    if (bebas) {
        newStyle['fontFamily'] = 'Bebas Neue'
        newStyle['fontSize'] = '14px'
        newStyle['letterSpacing'] = '0.06em'
        newStyle['fontWeight'] = 'bold'
    }

    if (noPadding) {
        newStyle['padding'] = '0px'
    }

    if (ellipsis) {
        newStyle['textOverflow'] = 'ellipsis'
        newStyle['overflow'] = 'hidden'
    }

    const classes = useStyles({ styles: newStyle })

    if (!view) return null

    return (
        <Box
            component="td"
            className={classNames(classes.root, className)}
            {...props}
        >
            {children}
        </Box>
    )
}

export default Td
