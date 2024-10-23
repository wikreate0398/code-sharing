
import Inner from '#root/src/components/ui/inner'
import { useSearchParams } from "#root/renderer/hooks"
import { Box } from '@mui/material'
import Wallet from '#root/src/components/screens/dashboard/cashbox/wallet'
import { flexStartProps, objValues } from '#root/src/helpers/functions'
import AddWallet from '#root/src/components/screens/dashboard/cashbox/wallet/add-wallet'
import { useGetWalletsQuery } from '#root/src/redux/api/cashbox/wallet.api'
import Transactions from '#root/src/components/screens/dashboard/cashbox/transactions'

const Cashbox = () => {
    const query = useSearchParams()
    return (
        <Inner
            maxWidth="md"
            backStyles={{ left: '-100px' }}
            back={query.get('back') ?? false}
        >
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
