import CircularLoader from '#root/src/components/ui/loader/circular-loader'
import { FC } from 'react'

interface Props {
    size?: number
    height?: number
    overlay?: boolean
    sx?: object
}

const ContainerLoader = ({
    size = 50,
    height = 250,
    overlay = false,
    sx = {}
}: Props) => {
    return (
        <CircularLoader
            size={size}
            boxHeight={height}
            overlay={overlay}
            sx={sx}
        />
    )
}

export default ContainerLoader
