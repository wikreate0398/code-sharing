import { Box, Modal as UiModal } from '@mui/material'
import Icon from '@/components/ui/icon'
import Loader from '@/components/ui/loader'
import { withStyles } from '@mui/styles'
import ContainerLoader from '@/components/ui/loader/container-loader'

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
        borderRadius: '16px'
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
    minHeight = null,
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
                    maxWidth: '90%',
                    minHeight: minHeight ? `${minHeight}px` : null
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
