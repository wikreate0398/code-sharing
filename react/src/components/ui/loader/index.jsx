
import { Box } from '@mui/material'
import classNames from 'classnames'
import useStyles from '#root/src/components/ui/loader/style'
import CircularLoader from '#root/src/components/ui/loader/circular-loader'

const Loader = ({
    height = 100,
    dim = 35,
    fullPageOverlay = false,
    overlay
}) => {
    const classList = useStyles({ overlay })

    const className = classNames(classList.root, {
        [classList.fullPageOverlay]: fullPageOverlay
    })

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            className={className}
            height={`${!fullPageOverlay ? `${parseInt(height)}px` : '100%'}`}
        >
            <Box className={classList.inner}>
                <CircularLoader size={40} />
            </Box>
        </Box>
    )
}

export default Loader
