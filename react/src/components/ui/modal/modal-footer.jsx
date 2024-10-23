import { Box } from '@mui/material'

const ModalFooter = ({ children }) => {
    return (
        <Box
            padding="0 31px 15px"
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
        >
            {children}
        </Box>
    )
}

export default ModalFooter
