import { Box } from '@mui/material'

const Th = ({
    children = null,
    width = false,
    maxWidth,
    nw = true,
    bold = false,
    color,
    style = {},
    right,
    left,
    view = true,
    noPadding,
    padding = null,
    ac = false,
    ...props
}) => {
    const newStyle = {
        ...style,
        width: width,
        minWidth: width,
        maxWidth: width,
        whiteSpace: nw && 'nowrap',
        textAlign: ac ? 'center' : 'left',
        color,
        padding
    }

    if (left || right) {
        newStyle['textAlign'] = left ? 'left' : 'right'
    }

    if (noPadding) {
        newStyle['padding'] = '0px'
    }

    if (!view) return null

    return (
        <Box component="th" style={newStyle} {...props}>
            {children}
        </Box>
    )
}

export default Th
