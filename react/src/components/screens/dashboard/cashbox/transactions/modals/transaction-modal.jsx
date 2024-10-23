import { Modal, ModalBody, ModalHeader } from '#root/src/components/ui/modal'
import { Alert, Box, MenuItem, Typography } from '@mui/material'
import * as Yup from 'yup'
import {
    maxSymbolsValidation,
    numbericValidation,
    requiredMessage
} from '#root/src/config/validation-messages'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNotify } from '#root/src/helpers/hooks'
import { useGetWalletsQuery } from '#root/src/redux/api/cashbox/wallet.api'
import { Form, Formik, useFormikContext } from 'formik'
import FormControl from '#root/src/components/ui/form/form-control'
import InputDropdown from '#root/src/components/ui/form/input-dropdown'
import { useGetProjectsForDropdownQuery } from '#root/src/redux/api/project.api'
import Select from '#root/src/components/ui/form/select'
import { empty, objValues, pluck, spaceBetweenProps } from '#root/src/helpers/functions'
import Textarea from '#root/src/components/ui/form/textarea'
import { useGetAllParticipantsOfOwnerQuery } from '#root/src/redux/api/participant.api'
import {
    useCreateUserTagMutation,
    useGetUserTagsQuery
} from '#root/src/redux/api/user-tag.api'
import CreatableSelect from '#root/src/components/ui/form/creatable-select'
import CreatableMultiSelect from '#root/src/components/ui/form/creatable-multiselect'
import { DesktopDatePicker } from '@mui/x-date-pickers'
import moment from 'moment'
import AntSwitch from '#root/src/components/ui/form/switch/ant-switch'
import {
    useCreateTransactionMutation,
    useUpdateTransactionMutation
} from '#root/src/redux/api/cashbox/transaction.api'
import { useSelector } from 'react-redux'
import { selectAuthUser } from '#root/src/redux/slices/meta.slice'
import _ from 'lodash'
import FormInner from '#root/src/components/ui/form/form-inner'
import { requestHandler } from '#root/src/redux/api-service'
import CustomButton from '#root/src/components/ui/button/custom-button'

// type = receipt,expense
const TransactionModal = ({ open, handleClose, type, transaction = null }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <ModalHeader>
                <Typography variant="title-24">
                    {type === 'receipt' ? 'Поступление' : 'Расход'}
                </Typography>
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

const ValidationSchema = Yup.object().shape({
    amount: Yup.number(numbericValidation).min(1).required(requiredMessage),
    id_wallet: Yup.number().required(requiredMessage),
    id_contractor: Yup.string().required(requiredMessage),
    ids_tags: Yup.array(),
    formatted_at: Yup.string().required(requiredMessage),
    comment: Yup.string().nullable(true).max(100, maxSymbolsValidation(100))
})

const ModalContent = ({ modalHandler, type, transaction }) => {
    const formRef = useRef()
    const notify = useNotify()
    const [createTransaction] = useCreateTransactionMutation()
    const [updateTransaction] = useUpdateTransactionMutation()

    const { data: wallets, isLoading: isLoadingWallets } = useGetWalletsQuery()
    const { data: projects, isLoading: isLoadingProjects } =
        useGetProjectsForDropdownQuery(undefined, {
            refetchOnMountOrArgChange: true
        })

    const { data: contractors, isLoading: isLoadContractors } =
        useGetUserTagsQuery('contractor')
    const { data: tags, isLoading: isLoadingTags } =
        useGetUserTagsQuery('transaction')
    const { data: participants, isLoading: isLoadingParticipants } =
        useGetAllParticipantsOfOwnerQuery()

    const [initialValues, setInitialValues] = useState({
        id: null,
        amount: '',
        id_wallet: '',
        id_contractor: '',
        id_project: '',
        ids_tags: [],
        formatted_at: moment(),
        accrued_at: moment(),
        paid: true,
        comment: ''
    })

    useEffect(() => {
        if (transaction) {
            const {
                id,
                amount,
                id_origin_wallet,
                id_project,
                id_user_contractor,
                id_contractor_optional,
                formatted_at,
                accrued_at,
                comment,
                tags
            } = transaction

            setInitialValues({
                id,
                amount: parseFloat(amount),
                id_contractor: id_user_contractor
                    ? `participant-${id_user_contractor}`
                    : `optional-${id_contractor_optional}`,
                id_wallet: id_origin_wallet,
                id_project: id_project,
                paid: Boolean(accrued_at),
                ids_tags: pluck(tags, 'id'),
                formatted_at: moment(formatted_at),
                accrued_at: accrued_at ? moment(accrued_at) : null,
                comment
            })
        }
    }, [transaction])

    const handleSubmit = useCallback(
        (values, { setSubmitting, setErrors }) => {
            setSubmitting(true)

            const request = values.id ? updateTransaction : createTransaction

            request({ ...values, action: type }).then((result) =>
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
        [modalHandler, type, createTransaction, updateTransaction]
    )

    if (empty(wallets) && !isLoadingWallets) {
        return (
            <Alert severity="warning">
                Для транзакции необходимо создать кошелек
            </Alert>
        )
    }

    if (transaction && !initialValues.id) return null

    return (
        <Formik
            innerRef={formRef}
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
                errors
            }) => (
                <FormInner
                    loading={
                        isSubmitting ||
                        isLoadContractors ||
                        isLoadingParticipants ||
                        isLoadingTags ||
                        isLoadingWallets ||
                        isLoadingProjects
                    }
                >
                    <Form>
                        <FormControl>
                            <InputDropdown
                                dropdownData={wallets}
                                inputValue={values.amount}
                                id_dropdown={values.id_wallet}
                                disableDropDown={Boolean(values.id)}
                                inputName="amount"
                                label="Сумма"
                                error={errors.amount || errors.id_wallet}
                                handleChangeInput={handleChange}
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
                                handleChangeDropdown={(value) =>
                                    setFieldValue('id_wallet', value)
                                }
                            />
                        </FormControl>

                        <Box mb="24px">
                            <AntSwitch
                                label={values.paid ? 'Оплачен' : 'План'}
                                name="paid"
                                handleChange={(e) => {
                                    const checked = e.target.checked
                                    setFieldValue('paid', checked)
                                    setFieldValue(
                                        'accrued_at',
                                        checked ? moment() : null
                                    )
                                }}
                                checked={values.paid}
                            />
                        </Box>

                        <FormControl {...spaceBetweenProps()} gap="10px">
                            <DesktopDatePicker
                                label="Дата cоздания"
                                inputFormat="DD.MM.YY"
                                value={values.formatted_at}
                                onChange={(value) => {
                                    setFieldValue('formatted_at', value)
                                }}
                            />

                            <DesktopDatePicker
                                label="Дата начисление"
                                inputFormat="DD.MM.YY"
                                value={values.accrued_at}
                                onChange={(value) => {
                                    setFieldValue('accrued_at', value)
                                }}
                            />
                        </FormControl>

                        <Contractors
                            contractors={contractors}
                            actionType={type}
                            error={errors.id_contractor}
                            participants={
                                type === 'expense' ? participants : []
                            }
                        />

                        <Tags tags={tags} />

                        <FormControl>
                            <Select
                                label="Проект"
                                name="id_project"
                                value={values.id_project}
                                error={errors.id_project}
                                onChange={handleChange}
                            >
                                {objValues(projects || []).map(
                                    ({ id, name }) => {
                                        return (
                                            <MenuItem key={id} value={id}>
                                                {name}
                                            </MenuItem>
                                        )
                                    }
                                )}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <Textarea
                                name="comment"
                                placeholder="Коментарий"
                                value={values.comment}
                                onChange={handleChange}
                            />
                        </FormControl>

                        <CustomButton
                            label="Добавить"
                            loading={isSubmitting}
                            onClick={submitForm}
                        />
                    </Form>
                </FormInner>
            )}
        </Formik>
    )
}

const Tags = ({ tags }) => {
    const [createUserTag] = useCreateUserTagMutation()
    const { values, setFieldValue } = useFormikContext()

    const onChange = useCallback(
        (ids) => {
            setFieldValue('ids_tags', ids)
        },
        [values]
    )

    const handleCreate = useCallback(
        (name) => {
            createUserTag({ name, type: 'transaction' }).then((result) =>
                requestHandler({
                    result,
                    on200Http: (data) => {
                        setFieldValue(
                            'ids_tags',
                            _.uniq([...values.ids_tags, parseInt(data.id)])
                        )
                    }
                })
            )
        },
        [createUserTag, values]
    )

    return (
        <FormControl>
            <CreatableMultiSelect
                items={tags || []}
                values={values.ids_tags}
                label="Тэги"
                handleChange={onChange}
                handleCreate={handleCreate}
            />
        </FormControl>
    )
}

const Contractors = ({ contractors, error, participants, actionType = '' }) => {
    const user = useSelector(selectAuthUser)
    const [createUserTag] = useCreateUserTagMutation()
    const { values, setFieldValue } = useFormikContext()

    const handleChange = (option) => {
        setFieldValue('id_contractor', option?.id || '')
    }

    const handleCreate = (name) => {
        createUserTag({ name, type: 'contractor' }).then((result) =>
            requestHandler({
                result,
                on200Http: (data) => {
                    setFieldValue('id_contractor', `optional-${data.id}`)
                }
            })
        )
    }

    const options = useMemo(() => {
        return [
            ...(participants || [])
                .filter(({ id }) => id !== user.id)
                .map(({ id, name, login }) => ({
                    id: `participant-${id}`,
                    name: `@${login}`
                })),
            ...(contractors || []).map(({ id, name }) => ({
                id: `optional-${id}`,
                name
            }))
        ]
    }, [participants, contractors])

    const disabled = Boolean(values.id) && actionType === 'expense'

    return (
        <FormControl>
            <CreatableSelect
                label={disabled ? null : 'Контрагент'}
                error={error}
                disabled={disabled}
                value={values.id_contractor}
                items={options}
                handleChange={handleChange}
                handleCreate={handleCreate}
            />
        </FormControl>
    )
}

export default TransactionModal
