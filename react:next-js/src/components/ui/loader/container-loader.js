import CircularLoader from '@/components/ui/loader/circular-loader'

const ContainerLoader = ({ size = 50, height = 250, overlay = false }) => {
    return <CircularLoader size={size} boxHeight={height} overlay={overlay} />
}

export default ContainerLoader
