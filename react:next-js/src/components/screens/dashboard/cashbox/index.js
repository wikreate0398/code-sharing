'use client'

import Inner from '@/components/ui/inner'
import { useSearchParams } from 'next/navigation'
import { Box } from '@mui/material'
import Wallet from '@/components/screens/dashboard/cashbox/wallet'
import { flexStartProps, objValues } from '@/helpers/functions'
import AddWallet from '@/components/screens/dashboard/cashbox/wallet/add-wallet'
import { useGetWalletsQuery } from '@/redux/api/cashbox/wallet.api'
import Transactions from '@/components/screens/dashboard/cashbox/transactions'

const Cashbox = () => {
    const query = useSearchParams()

    return (
        <Inner maxWidth="md" back={query.get('back') ?? false}>
            <Wallets />
            <Transactions />
        </Inner>
    )
}

const Wallets = () => {
    const { data: wallets } = useGetWalletsQuery()

    return (
        <Box {...flexStartProps()} flexWrap="wrap" gap="10px">
            {objValues(wallets || []).map((wallet) => (
                <Wallet key={wallet.id} wallet={wallet} />
            ))}
            <AddWallet />
        </Box>
    )
}

export default Cashbox
