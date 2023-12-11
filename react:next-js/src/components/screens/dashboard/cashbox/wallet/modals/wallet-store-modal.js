import { Modal, ModalBody, ModalHeader } from '@/components/ui/modal'
import { MenuItem, Typography } from '@mui/material'
import * as Yup from 'yup'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Form, Formik } from 'formik'
import Input from '@/components/ui/form/input'
import SubmitBtn from '@/components/ui/form/submit-button'
import FormControl from '@/components/ui/form/form-control'
import Select from '@/components/ui/form/select'
import { useGetAllCurrenciesQuery } from '@/redux/api/cashbox/currency.api'
import { objValues } from '@/helpers/functions'
import {
    useCreateWalletMutation,
    useUpdateWalletMutation
} from '@/redux/api/cashbox/wallet.api'
import { useNotify } from '@/helpers/hooks'
import { minimumSymbols, requiredMessage } from '@/config/validation-messages'
import { requestHandler } from '@/redux/api-service'
import FormInner from '@/components/ui/form/form-inner'

const WalletStoreModal = ({ open, handleClose, wallet = null }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <ModalHeader>
                <Typography variant="title-24">
                    {wallet ? 'Редактировать' : 'Добавить'} кошелек
                </Typography>
            </ModalHeader>
            <ModalBody>
                <ModalContent modalHandler={handleClose} wallet={wallet} />
            </ModalBody>
        </Modal>
    )
}

const ValidationSchema = Yup.object().shape({
    id: Yup.mixed().nullable(true),
    is_edit: Yup.boolean(),
    name: Yup.string()
        .min(5, minimumSymbols(5))
        .max(25, minimumSymbols(25))
        .required(requiredMessage),
    id_currency: Yup.string().when('id', {
        is: (v) => !v,
        then: (schema) => schema.required(requiredMessage),
        otherwise: (schema) => schema
    }),
    amount: Yup.number().nullable(true)
})

const ModalContent = ({ modalHandler, wallet }) => {
    const formRef = useRef()
    const notify = useNotify()
    const [createWallet] = useCreateWalletMutation()
    const [updateWallet] = useUpdateWalletMutation()
    const { data: currency, isLoading: isLoadingCurrency } =
        useGetAllCurrenciesQuery()

    const [initialValues, setInitialValues] = useState({
        id: null,
        is_edit: false,
        name: '',
        amount: '',
        id_currency: ''
    })

    useEffect(() => {
        if (wallet) {
            const { id, name, initial_amount } = wallet

            setInitialValues({
                id,
                name,
                amount: initial_amount,
                is_edit: true
            })
        }

        return () => {
            formRef?.current?.resetForm()
        }
    }, [wallet])

    const handleSubmit = useCallback(
        (values, { setSubmitting, setErrors }) => {
            setSubmitting(true)
            const request = wallet?.id ? updateWallet : createWallet
            request(values).then((result) =>
                requestHandler({
                    result,
                    onFinishRequest: () => {
                        setSubmitting(false)
                    },
                    on200Http: ({ message, status }) => {
                        notify(message, status)
                        if (status) modalHandler()
                    },
                    on422Error: (errors) => {
                        setErrors(errors)
                    }
                })
            )
        },
        [modalHandler, wallet, createWallet, updateWallet]
    )

    if (wallet && !initialValues.id) return null

    return (
        <Formik
            innerRef={formRef}
            validationSchema={ValidationSchema}
            initialValues={initialValues}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={handleSubmit}
        >
            {({ submitForm, isSubmitting, handleChange, values, errors }) => {
                return (
                    <FormInner loading={isSubmitting}>
                        <Form>
                            <FormControl>
                                <Input
                                    name="name"
                                    label="Название cчета *"
                                    value={values.name}
                                    onChange={handleChange}
                                    error={errors.name}
                                />
                            </FormControl>

                            {!wallet?.id && (
                                <FormControl>
                                    <Select
                                        label="Валюта счета *"
                                        name="id_currency"
                                        value={values.id_currency}
                                        error={errors.id_currency}
                                        onChange={handleChange}
                                    >
                                        {objValues(currency || []).map(
                                            ({ id, name, iso }) => {
                                                return (
                                                    <MenuItem
                                                        key={id}
                                                        value={id}
                                                    >
                                                        {name} ({iso})
                                                    </MenuItem>
                                                )
                                            }
                                        )}
                                    </Select>
                                </FormControl>
                            )}

                            <FormControl>
                                <Input
                                    name="amount"
                                    type="number"
                                    label="Начальный баланс"
                                    value={parseFloat(values.amount)}
                                    error={errors.amount}
                                    onChange={handleChange}
                                />
                            </FormControl>

                            <SubmitBtn
                                isSubmitting={isSubmitting}
                                onClick={submitForm}
                            >
                                Сохранить
                            </SubmitBtn>
                        </Form>
                    </FormInner>
                )
            }}
        </Formik>
    )
}

export default WalletStoreModal
