import { Box } from '@mui/material'

const FormControl = ({ children, marginBottom = '20px', ...props }) => {
    return (
        <Box marginBottom={marginBottom} {...props}>
            {children}
        </Box>
    )
}

export default FormControl
