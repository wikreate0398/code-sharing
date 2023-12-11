import { useContext } from 'react'
import { SvgCtx } from '@/components/ui/svg-icons/context'
import { Box } from '@mui/material'

const Svg = ({ children }) => {
    const {
        onMouseEnter,
        onMouseLeave,
        className,
        width = 15,
        height = 15
    } = useContext(SvgCtx)

    return (
        <Box
            component="svg"
            width={width}
            height={height}
            className={className}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {children}
        </Box>
    )
}

export default Svg
