'use client'

import { Button } from '@mui/material'
import AnimatesCircles from '@/components/ui/animated-circles'

const SubmitBtn = ({
    children,
    isSubmitting,
    variant = 'black',
    fullWidth = true,
    ...props
}) => {
    return (
        <Button fullWidth={fullWidth} variant={variant} {...props}>
            {isSubmitting ? <AnimatesCircles /> : children}
        </Button>
    )
}

export default SubmitBtn
