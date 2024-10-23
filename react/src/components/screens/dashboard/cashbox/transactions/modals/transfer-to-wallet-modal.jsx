import InputCurrencyRate from '#root/src/components/screens/dashboard/cashbox/_components/input-currency-rate'
import FormInner from '#root/src/components/ui/form/form-inner'
import InputDropdown from '#root/src/components/ui/form/input-dropdown'
import Textarea from '#root/src/components/ui/form/textarea'
import { Modal, ModalBody, ModalHeader } from '#root/src/components/ui/modal'
import {
    maxSymbolsValidation,
    numbericValidation,
    requiredMessage
} from '#root/src/config/validation-messages'
import { useNotify } from '#root/src/helpers/hooks'
import { requestHandler } from '#root/src/redux/api-service'
import {
    useCreateTransferToWalletMutation,
    useEditTransferToWalletMutation
} from '#root/src/redux/api/cashbox/transaction.api'
import { useGetWalletsQuery } from '#root/src/redux/api/cashbox/wallet.api'
import { Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import FormControl from '#root/src/components/ui/form/form-control'
import React, { useCallback } from 'react'
import * as Yup from 'yup'
import getOr from 'lodash/fp/getOr'
import CustomButton from '#root/src/components/ui/button/custom-button'

const ValidationSchema = Yup.object().shape({
    amount_from: Yup.number(numbericValidation)
        .min(1)
        .required(requiredMessage),
    amount_to: Yup.number().required(requiredMessage),
    id_origin_wallet: Yup.number().required(requiredMessage),
    id_destination_wallet: Yup.number().required(requiredMessage),
    rate: Yup.number().required(requiredMessage),
    comment: Yup.string().nullable(true).max(100, maxSymbolsValidation(100))
})

const TransferToWalletModal = ({
    open,
    handleClose,
    type,
    transaction = null
}) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <ModalHeader>
                <Typography variant="title-24">Перевод</Typography>
            </ModalHeader>

            <ModalBody>
                <ModalContent
                    modalHandler={handleClose}
                    type={type}
                    transaction={transaction}
                />
            </ModalBody>
        </Modal>
    )
}

const ModalContent = ({ modalHandler, transaction }) => {
    const notify = useNotify()
    const [createTransfer] = useCreateTransferToWalletMutation()
    const [editTransfer] = useEditTransferToWalletMutation()

    const { data: wallets, isLoading: isLoadingWallets } = useGetWalletsQuery()

    const {
        id: transferId,
        id_destination_wallet: storedDestinationWallet,
        id_origin_wallet: storedOriginWallet,
        rate: storedRate,
        amount: amount_from,
        amount_to,
        comment: storedComment
    } = transaction || {}

    const isEdit = Boolean(transaction)

    const getWalletById = useCallback(
        (id, arr) => {
            let res = wallets.find((w) => w.id === id)
            if (Array.isArray(arr)) {
                return getOr(null, arr, res)
            }
            return res
        },

        [wallets]
    )

    const id_origin_wallet = getOr(null, [0, 'id'], wallets)

    const id_destination_wallet = getOr(null, [0, 'id'], wallets)

    const initialValues = {
        amount_from: amount_from || '',
        amount_to: amount_to || '',
        id_origin_wallet: storedOriginWallet || id_origin_wallet,
        id_destination_wallet: storedDestinationWallet || id_destination_wallet,
        rate: storedRate ?? 1,
        comment: storedComment || ''
    }

    const handleSubmit = useCallback(
        (values, { setSubmitting, setErrors }) => {
            setSubmitting(true)
            const { ...res } = values
            const request = isEdit ? editTransfer : createTransfer

            request({ id: transferId, ...res }).then((result) =>
                requestHandler({
                    result,
                    onFinishRequest: () => {
                        setSubmitting(false)
                    },
                    on200Http: ({ message, status }) => {
                        notify(message, status)
                        if (status) {
                            modalHandler()
                        }
                    },
                    on422Error: (errors) => {
                        setErrors(errors)
                    }
                })
            )
        },
        [isEdit, transferId]
    )

    return (
        <Formik
            validationSchema={ValidationSchema}
            initialValues={initialValues}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={handleSubmit}
        >
            {({
                submitForm,
                isSubmitting,
                handleChange,
                values,
                setFieldValue,
                setValues,
                errors
            }) => {
                const {
                    amount_from,
                    amount_to,
                    id_origin_wallet,
                    id_destination_wallet,
                    rate,
                    comment
                } = values || {}

                const updateRate = (from, to) => {
                    let prevOrigin = getWalletById(id_origin_wallet, [
                            'currency',
                            'iso'
                        ]),
                        prevDestination = getWalletById(id_destination_wallet, [
                            'currency',
                            'iso'
                        ])

                    let origin = getWalletById(from, ['currency', 'iso']),
                        destination = getWalletById(to, ['currency', 'iso'])

                    if (
                        prevOrigin === origin &&
                        prevDestination === destination
                    ) {
                        return
                    }

                    let isEqual = origin === destination

                    setValues({
                        ...values,
                        rate: isEqual ? 1 : 0,
                        amount_to: isEqual ? amount_from : 0
                    })
                }

                const parcePrice = (p) => Math.abs((Number(p) || 0)?.toFixed(2))

                return (
                    <FormInner loading={isSubmitting || isLoadingWallets}>
                        <Form>
                            <FormControl marginBottom="0">
                                <InputDropdown
                                    dropdownData={wallets}
                                    inputValue={parcePrice(amount_from)}
                                    id_dropdown={id_origin_wallet}
                                    inputName="amount_from"
                                    label="Сумма"
                                    error={
                                        errors.amount_from ||
                                        errors.id_origin_wallet
                                    }
                                    handleChangeInput={(e) => {
                                        handleChange(e)
                                        let from = e.target.value

                                        setFieldValue('amount_to', from / rate)
                                    }}
                                    renderSelected={({ currency }) => {
                                        const { symbol, iso } = currency
                                        return `${symbol} ${iso}`
                                    }}
                                    renderDropdown={({ name, currency }) => {
                                        return (
                                            <>
                                                {name} ({currency.symbol}{' '}
                                                {currency.iso})
                                            </>
                                        )
                                    }}
                                    handleChangeDropdown={(value) => {
                                        updateRate(value, id_destination_wallet)

                                        setFieldValue('id_origin_wallet', value)
                                    }}
                                />
                            </FormControl>

                            <InputCurrencyRate
                                rate={parcePrice(rate)}
                                fromWallet={getWalletById(
                                    id_destination_wallet
                                )}
                                toWallet={getWalletById(id_origin_wallet)}
                                handleSetRate={(value) => {
                                    setValues({
                                        ...values,
                                        rate: value,
                                        amount_to: amount_from / value
                                    })
                                }}
                            />

                            <FormControl>
                                <InputDropdown
                                    dropdownData={wallets}
                                    inputValue={parcePrice(amount_to)}
                                    id_dropdown={id_destination_wallet}
                                    inputName="amount_to"
                                    label="Сумма"
                                    error={
                                        errors.amount_to ||
                                        errors.id_destination_wallet
                                    }
                                    handleChangeInput={(e) => {
                                        handleChange(e)
                                        setFieldValue(
                                            'amount_from',
                                            e.target.value * rate
                                        )
                                    }}
                                    renderSelected={({ currency }) => {
                                        const { symbol, iso } = currency
                                        return (
                                            <>
                                                {symbol} {iso}
                                            </>
                                        )
                                    }}
                                    renderDropdown={({ name, currency }) => {
                                        return (
                                            <>
                                                {name} ({currency.symbol}{' '}
                                                {currency.iso})
                                            </>
                                        )
                                    }}
                                    handleChangeDropdown={(value) => {
                                        updateRate(id_origin_wallet, value)

                                        setFieldValue(
                                            'id_destination_wallet',
                                            value
                                        )
                                    }}
                                />
                            </FormControl>

                            <FormControl>
                                <Textarea
                                    name="comment"
                                    placeholder="Коментарий"
                                    value={comment}
                                    onChange={handleChange}
                                />
                            </FormControl>

                            <CustomButton
                                label={isEdit ? 'Сохранить' : 'Добавить'}
                                loading={isSubmitting}
                                onClick={submitForm}
                            />
                        </Form>
                    </FormInner>
                )
            }}
        </Formik>
    )
}

export default TransferToWalletModal
