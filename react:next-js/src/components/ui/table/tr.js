import { Box } from '@mui/material'

const Tr = ({ children, ...props }) => {
    return (
        <Box component="tr" {...props}>
            {children}
        </Box>
    )
}

export default Tr
