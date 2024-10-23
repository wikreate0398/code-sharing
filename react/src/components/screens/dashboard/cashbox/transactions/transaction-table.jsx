import {
    useDeleteTransactionMutation,
    useDeleteTransferToWalletMutation,
    useGetTransactionsQuery,
    useSwitchStatusMutation
} from '#root/src/redux/api/cashbox/transaction.api'
import {
    confirmAlert,
    dateFormat,
    empty,
    flexEndProps,
    flexStartProps,
    monthName,
    priceString,
    uploadPath
} from '#root/src/helpers/functions'
import { Alert, Box, Chip, Stack, Typography } from '@mui/material'
import ContainerLoader from '#root/src/components/ui/loader/container-loader'
import moment from 'moment'
import { Table, Tbody, Td, Th, Thead, Tr } from '#root/src/components/ui/table'
import _ from 'lodash'
import React, { Fragment } from 'react'
import ProjectAvatar from '#root/src/components/ui/project-avatar'
import Avatar from '#root/src/components/ui/avatar'
import Icon from '#root/src/components/ui/icon'
import {
    TransactionModal,
    TransferToWalletModal
} from '#root/src/components/screens/dashboard/cashbox/transactions/modals'
import ModalBtn from '#root/src/components/ui/modal/modal-btn'
import IconBtn from '#root/src/components/ui/button/icon-button'
import ConfirmAmountPopup from '#root/src/components/screens/dashboard/cashbox/transactions/_components/confirm-amount-popup'

const TranasctionTable = ({ from, to, type }) => {
    const { data, isLoading } = useGetTransactionsQuery({ from, to, type })

    if (empty(data) && !isLoading) {
        return <Alert severity="info">Нет транзакций</Alert>
    }

    if (isLoading) return <ContainerLoader />

    const dateField = type === 'paid' ? 'accrued_at' : 'formatted_at'

    const groupedDate = (i) => {
        const value = i[dateField]
        const date = dateFormat(value, 'DD')
        const month = monthName(dateFormat(value, 'M'), true)
        const currentYear = moment().format('Y')
        const year = dateFormat(value, 'Y')
        return `${date} ${month} ${currentYear === year ? '' : year}`
    }

    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>Проект / Участник</Th>
                    <Th ac>Сумма</Th>
                    <Th ac>Оплачен</Th>
                    <Th>Описание</Th>
                    <Th>Тэги</Th>
                    <Th ac>Кошелек</Th>
                    <Th />
                </Tr>
            </Thead>
            <Tbody>
                {Object.entries(_.groupBy(data || [], groupedDate)).map(
                    (value) => {
                        const date = value[0]
                        const items = value[1]
                        return (
                            <Fragment key={date}>
                                <Tr>
                                    <Td colSpan={7} padding="20px 0 15px" ac>
                                        <Typography
                                            fontSize="13"
                                            fontWeight={500}
                                        >
                                            {date}
                                        </Typography>
                                    </Td>
                                </Tr>
                                {items.map((item) =>
                                    item.action === 'transfer' ? (
                                        <TransferRow
                                            key={item.id}
                                            transaction={item}
                                        />
                                    ) : (
                                        <TransactionRow
                                            type={type}
                                            key={item.id}
                                            transaction={item}
                                        />
                                    )
                                )}
                            </Fragment>
                        )
                    }
                )}
            </Tbody>
        </Table>
    )
}

const TransactionRow = ({ type, transaction }) => {
    const {
        id,
        contractor,
        action,
        id_parent,
        optional_contractor,
        project,
        amount,
        origin_wallet,
        comment,
        tags,
        accrued_at
    } = transaction

    const { name: wallet_name, currency } = origin_wallet

    const [switchStatus] = useSwitchStatusMutation()
    const accrued = Boolean(accrued_at)
    const isPlanned = type === 'planned'

    return (
        <Tr>
            <Td>
                <Box {...flexStartProps('center')}>
                    {Boolean(project?.id) && (
                        <>
                            <ProjectAvatar
                                bg={project.bg}
                                size={20}
                                name={project.name}
                            />
                            &nbsp;/&nbsp;
                        </>
                    )}
                    {Boolean(contractor?.id) && (
                        <Avatar
                            size={20}
                            src={uploadPath(
                                `${contractor.id}/avatar/${contractor.avatar}`
                            )}
                            showName
                            name={contractor.name}
                        />
                    )}
                    {Boolean(optional_contractor?.id) &&
                        optional_contractor.name}
                </Box>
            </Td>
            <Td ac>
                <Typography
                    variant="font2"
                    fontSize="13px"
                    color={`${!accrued && '#00000066'}`}
                >
                    {action === 'receipt' ? '+' : '-'}
                    {priceString(amount)} {currency.symbol}
                </Typography>
            </Td>
            <Td ac styles={{ gap: '8px' }}>
                {!id_parent && (
                    <Stack
                        gap="8px"
                        flexDirection="row"
                        justifyContent="center"
                    >
                        <ConfirmAmountPopup
                            switchStatus={switchStatus}
                            id={id}
                            accrued={accrued}
                            isPlanned={isPlanned}
                            amount={parseFloat(amount)}
                        />
                    </Stack>
                )}
            </Td>
            <Td color="#959EA7" nw={false}>
                {comment}
            </Td>
            <Td>
                {!empty(tags) && (
                    <Box {...flexStartProps()} gap="5px">
                        {tags.map(({ id, name }) => (
                            <Chip
                                key={id}
                                color="blue"
                                variant="square"
                                size="small"
                                label={name}
                            />
                        ))}
                    </Box>
                )}
            </Td>
            <Td color="#959EA7" ac>
                <Avatar
                    color={currency.color}
                    bg={currency.bg}
                    size={20}
                    value={currency.symbol}
                    name={`${wallet_name}`}
                    showName
                />
            </Td>
            <Td>{!id_parent && <Actions transaction={transaction} />}</Td>
        </Tr>
    )
}

const TransferRow = ({ transaction }) => {
    const {
        amount,
        amount_to,
        origin_wallet: from_wallet,
        destination_wallet: to_wallet,
        comment
    } = transaction

    const { name: from_wallet_name, currency: from_currency } = from_wallet
    const { name: to_wallet_name, currency: to_currency } = to_wallet

    return (
        <Tr>
            <Td>
                <Avatar
                    color={to_currency.color}
                    bg={to_currency.bg}
                    size={20}
                    value={to_currency.symbol}
                    name={`${to_wallet_name}`}
                    showName
                />
            </Td>
            <Td ac colSpan={2}>
                <Box {...flexStartProps('center')} gap="15px">
                    <Typography variant="font2" fontSize="13px">
                        - {priceString(amount)} {from_currency.symbol}
                    </Typography>
                    <Icon name="arrow-v2" size="10,8" />
                    <Typography variant="font2" fontSize="13px">
                        {priceString(amount_to)} {to_currency.symbol}
                    </Typography>
                </Box>
            </Td>
            <Td color="#959EA7" nw={false}>
                {comment}
            </Td>
            <Td />
            <Td color="#959EA7" ac>
                <Avatar
                    color={from_currency.color}
                    bg={from_currency.bg}
                    size={20}
                    value={from_currency.symbol}
                    name={`${from_wallet_name}`}
                    showName
                />
            </Td>
            <Td>
                <Actions transaction={transaction} />
            </Td>
        </Tr>
    )
}

const Actions = ({ transaction }) => {
    const { action } = transaction
    const [deleteTransaction] = useDeleteTransactionMutation()
    const [deleteTransfer] = useDeleteTransferToWalletMutation()
    const isTransfer = action === 'transfer'
    const EditModal = isTransfer ? TransferToWalletModal : TransactionModal
    const deleteQuery = isTransfer ? deleteTransfer : deleteTransaction

    return (
        <Box {...flexEndProps()} gap="8px">
            <ModalBtn>
                {({ open, handleModal }) => (
                    <>
                        <IconBtn onClick={handleModal}>
                            <Icon name="pencil" pointer size="10,10" />
                        </IconBtn>
                        <EditModal
                            open={open}
                            handleClose={handleModal}
                            type={action}
                            transaction={transaction}
                        />
                    </>
                )}
            </ModalBtn>

            <IconBtn
                onClick={() => {
                    if (confirmAlert()) deleteQuery(transaction.id)
                }}
            >
                <Icon name="trash" pointer size="14,12" />
            </IconBtn>
        </Box>
    )
}

export default TranasctionTable
