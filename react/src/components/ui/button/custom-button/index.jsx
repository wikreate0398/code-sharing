import React, { useMemo } from 'react'
import AnimatesCircles from '#root/src/components/ui/animated-circles/index.jsx'
import { Button } from '@mui/material'

const CustomButton = ({
    size = 'medium', // large | medium | small
    loading,
    disabled,
    fullWidth = true,
    children,
    label,
    sx,
    icon,
    endIcon,
    startIcon,
    variant = 'contained', // contained | outlined
    ...props
}) => {
    return (
        <Button
            fullWidth={fullWidth}
            variant={variant}
            size={size}
            endIcon={endIcon}
            startIcon={icon || startIcon}
            disabled={disabled}
            sx={{
                ...sx
            }}
            {...props}
        >
            {loading ? <AnimatesCircles /> : label}
        </Button>
    )
}

export default CustomButton
