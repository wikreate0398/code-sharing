import ContainerLoader from '@/components/ui/loader/container-loader'
import React from 'react'
import { Box } from '@mui/material'

const FormInner = ({ children, loading }) => {
    return (
        <Box position="relative">
            {loading && <ContainerLoader overlay />}
            <Box style={{ opacity: loading ? 0 : 1 }}>{children}</Box>
        </Box>
    )
}

export default FormInner
