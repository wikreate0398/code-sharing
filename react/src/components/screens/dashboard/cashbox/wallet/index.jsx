import {
    confirmAlert,
    flexEndProps,
    priceString,
    spaceBetweenProps
} from '#root/src/helpers/functions'
import {
    WalletContainer,
    Currency,
    Value,
    Description
} from '#root/src/components/screens/dashboard/cashbox/wallet/components'
import { Box } from '@mui/material'
import IconBtn from '#root/src/components/ui/button/icon-button'
import Icon from '#root/src/components/ui/icon'
import React from 'react'
import { useDeleteWalletMutation } from '#root/src/redux/api/cashbox/wallet.api'
import ModalBtn from '#root/src/components/ui/modal/modal-btn'
import WalletStoreModal from '#root/src/components/screens/dashboard/cashbox/wallet/modals/wallet-store-modal'

const Wallet = ({ wallet }) => {
    const { id, currency, amount, initial_amount, name } = wallet
    const { id: id_currency, bg, color, symbol } = currency

    return (
        <WalletContainer>
            <Box {...spaceBetweenProps('center')} mb="30px">
                <Currency color={color} bg={bg}>
                    {symbol}
                </Currency>
                {Boolean(id) && <Actions wallet={wallet} />}
            </Box>
            <Value>
                {priceString(amount, 2)} {symbol}
            </Value>
            <Description>{name}</Description>
        </WalletContainer>
    )
}

const Actions = ({ wallet }) => {
    const [deleteWallet] = useDeleteWalletMutation()

    return (
        <Box gap="8px" className="actions">
            <ModalBtn>
                {({ open, handleModal }) => (
                    <>
                        <IconBtn onClick={handleModal}>
                            <Icon name="pencil" pointer size="10,10" />
                        </IconBtn>
                        <WalletStoreModal
                            open={open}
                            handleClose={handleModal}
                            wallet={wallet}
                        />
                    </>
                )}
            </ModalBtn>

            <IconBtn
                onClick={() => {
                    if (confirmAlert()) {
                        deleteWallet(wallet.id)
                    }
                }}
            >
                <Icon name="trash" pointer size="14,12" />
            </IconBtn>
        </Box>
    )
}

export default Wallet
