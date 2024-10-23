import {
    WalletContainer,
    Description,
    Value
} from '#root/src/components/screens/dashboard/cashbox/wallet/components'
import { withStyles } from '@mui/styles'
import { Box } from '@mui/material'
import PlusIcon from '#root/src/components/ui/svg-icons/icons/plus-icon'
import { useCallback, useState } from 'react'
import WalletStoreModal from '#root/src/components/screens/dashboard/cashbox/wallet/modals/wallet-store-modal'

const styles = {
    icon: {
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #C2CCD6',
        cursor: 'pointer',
        marginBottom: '30px'
    }
}

const AddWallet = withStyles(styles)(({ classes }) => {
    const [open, setOpen] = useState(false)

    const handleModal = useCallback(() => {
        setOpen(!open)
    }, [open])

    return (
        <>
            <WalletContainer
                style={{ cursor: 'pointer' }}
                onClick={handleModal}
            >
                <Box className={classes.icon}>
                    <PlusIcon />
                </Box>
                <Value>Открыть</Value>
                <Description>Добавить новый кошелек</Description>
            </WalletContainer>
            <WalletStoreModal open={open} handleClose={handleModal} />
        </>
    )
})

export default AddWallet
