import { useGetWalletsQuery } from '@/redux/api/cashbox/wallet.api'
import { Box, Typography } from '@mui/material'
import DateRangePicker from '@/components/ui/datepicker'
import React, { useState } from 'react'
import {
    dateFormat,
    flexStartProps,
    spaceBetweenProps
} from '@/helpers/functions'
import moment, { now } from 'moment'
import Icon from '@/components/ui/icon'
import IconBtn from '@/components/ui/button/icon-button'
import ModalBtn from '@/components/ui/modal/modal-btn'
import {
    TransactionModal,
    TransferToWalletModal
} from '@/components/screens/dashboard/cashbox/transactions/modals'
import { TabItem, Tabs } from '@/components/ui/tabs'
import TranasctionTable from '@/components/screens/dashboard/cashbox/transactions/transaction-table'

const Transactions = () => {
    const { data: wallets } = useGetWalletsQuery()

    const [period, setPeriodAction] = useState({
        from: dateFormat(moment().startOf('month')),
        to: dateFormat(now())
    })

    const [type, setType] = useState('paid')

    return (
        <Box mt="30px">
            <Box {...spaceBetweenProps()} mb="40px">
                <Typography variant="title-20">Транзакции</Typography>
                <Box {...flexStartProps()} gap="20px">
                    {type === 'paid' && (
                        <DateRangePicker
                            value={[period.from, period.to]}
                            handleSearch={setPeriodAction}
                            height={25}
                        />
                    )}
                    <Box {...flexStartProps()} gap="5px">
                        {wallets?.length > 1 && (
                            <ModalBtn>
                                {({ open, handleModal }) => (
                                    <>
                                        <IconBtn onClick={handleModal}>
                                            <Icon
                                                name="transfer"
                                                pointer
                                                size="10,11"
                                            />
                                        </IconBtn>
                                        <TransferToWalletModal
                                            open={open}
                                            handleClose={handleModal}
                                        />
                                    </>
                                )}
                            </ModalBtn>
                        )}

                        <ModalBtn>
                            {({ open, handleModal }) => (
                                <>
                                    <IconBtn onClick={handleModal}>
                                        <Icon
                                            name="plus"
                                            pointer
                                            size="10,10"
                                        />
                                    </IconBtn>
                                    <TransactionModal
                                        open={open}
                                        handleClose={handleModal}
                                        type="receipt"
                                    />
                                </>
                            )}
                        </ModalBtn>

                        <ModalBtn>
                            {({ open, handleModal }) => (
                                <>
                                    <IconBtn onClick={handleModal}>
                                        <Icon
                                            name="minus"
                                            pointer
                                            size="10,2"
                                        />
                                    </IconBtn>
                                    <TransactionModal
                                        open={open}
                                        handleClose={handleModal}
                                        type="expense"
                                    />
                                </>
                            )}
                        </ModalBtn>
                    </Box>
                </Box>
            </Box>

            <TransactionTabs type={type} handleClick={(val) => setType(val)} />
            <TranasctionTable type={type} {...period} />
        </Box>
    )
}

const TransactionTabs = ({ type, handleClick }) => {
    return (
        <Tabs mb="15px" fontSize={14}>
            <TabItem
                active={type === 'paid'}
                onClick={() => handleClick('paid')}
            >
                Оплаченные
            </TabItem>
            <TabItem
                active={type === 'planned'}
                onClick={() => handleClick('planned')}
            >
                Запланированные
            </TabItem>
        </Tabs>
    )
}

export default Transactions
