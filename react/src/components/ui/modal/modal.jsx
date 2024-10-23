import { Box, Modal as UiModal } from '@mui/material'
import Icon from '#root/src/components/ui/icon'
import Loader from '#root/src/components/ui/loader'
import { withStyles } from '@mui/styles'
import ContainerLoader from '#root/src/components/ui/loader/container-loader'

const styles = {
    content: {
        position: 'absolute',
        top: '100px',
        left: '0',
        right: '0',
        margin: 'auto',
        minHeight: '100px',
        background: '#fff',
        border: '1px solid rgba(255, 255, 255, 1) !important',
        borderRadius: '16px',
        overflow: 'hidden'
    },

    close: {
        position: 'absolute',
        zIndex: 100,
        top: '12px',
        right: '12px',
        cursor: 'pointer'
    }
}

const Modal = withStyles(styles)(({
    classes: style,
    children,
    width = 430,
    height = null,
    minWidth = 'auto',
    minHeight = null,
    maxHeight = null,
    maxWidth = '90%',
    open,
    onClose,
    loading = false,
    hideCloseIcon = false,
    ...props
}) => {
    const { disableScrollLock, ...other } = props

    return (
        <UiModal
            sx={{ overflow: 'auto' }}
            disableScrollLock={disableScrollLock}
            open={open}
            onClose={() => onClose(!open)}
        >
            <Box
                style={{
                    width,
                    height,
                    minWidth,
                    minHeight: minHeight ? `${minHeight}px` : null,
                    maxHeight,
                    maxWidth
                }}
                className={style.content}
                {...other}
            >
                {!hideCloseIcon && (
                    <Icon
                        name="close"
                        width={20}
                        height={20}
                        className={style.close}
                        onClick={() => onClose(!open)}
                    />
                )}
                {loading ? (
                    <ContainerLoader height={minHeight || 250} />
                ) : (
                    children
                )}
            </Box>
        </UiModal>
    )
})

export default Modal
