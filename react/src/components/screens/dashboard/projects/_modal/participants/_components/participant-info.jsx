import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { requiredMessage } from '#root/src/config/validation-messages'
import { makeStyles, useTheme } from '@mui/styles'
import { useAddEditProjectContext } from '#root/src/components/screens/dashboard/projects/_modal/context'
import {
    useDeleteProjectParticipantMutation,
    useLazyGetParticipantInfoQuery,
    useUpdateProjectParticipantInfoMutation
} from '#root/src/redux/api/participant.api'
import ContainerLoader from '#root/src/components/ui/loader/container-loader'
import { Box, Stack, Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import useStyles from '#root/src/components/screens/dashboard/projects/_modal/styles'
import InputDropdown from '#root/src/components/ui/form/input-dropdown'
import FormControl from '#root/src/components/ui/form/form-control'
import { useGetAllCurrenciesQuery } from '#root/src/redux/api/cashbox/currency.api'
import Input from '#root/src/components/ui/form/input'
import { requestHandler } from '#root/src/redux/api-service'
import { useNotify } from '#root/src/helpers/hooks'
import FormGroup from '#root/src/components/screens/dashboard/projects/_modal/_components/form-group'
import FormCheckbox from '#root/src/components/screens/dashboard/projects/_modal/_components/form-checkbox'
import CustomButton from '#root/src/components/ui/button/custom-button'
import DeleteButton from '#root/src/components/ui/button/delete-button.jsx'
import { useGetTrackingTypesGqlQuery } from '#root/src/redux/api/traking.api.js'
import { empty, numberEq } from '#root/src/helpers/functions.js'
import classNames from 'classnames'

const ValidationSchema = Yup.object().shape({
    hourly: Yup.boolean(),
    id_currency: Yup.string().required(requiredMessage),
    id_tracking_type: Yup.string().required(requiredMessage),
    monthly_sallary: Yup.number()
        .required(requiredMessage)
        .when('hourly', {
            is: () => true,
            then: (schema) => schema.notRequired()
        }),
    hourly_price: Yup.number()
        .required(requiredMessage)
        .when('hourly', {
            is: (v) => !Boolean(v),
            then: (schema) => schema.notRequired()
        }),
    monthly_hours: Yup.number().required(requiredMessage),
    overtime_price: Yup.number().required(requiredMessage),
    markup_percent: Yup.number().required(requiredMessage)
})

const ParticipantInfo = () => {
    const theme = useTheme()
    const classes = useStyles()
    const notify = useNotify()
    const {
        id_project,
        selectedParticipantId: id_member,
        setSelectedParticipantId
    } = useAddEditProjectContext()

    const { data: currency } = useGetAllCurrenciesQuery()
    const [trigger, result] = useLazyGetParticipantInfoQuery()

    const [updateMemberInfo] = useUpdateProjectParticipantInfoMutation()
    const [deleteMember] = useDeleteProjectParticipantMutation()

    const { isFetching, isLoading, data = null } = result || {}
    const loading = isFetching || isLoading

    useEffect(() => {
        if (id_member && id_project) trigger({ id_project, id_member })
    }, [id_project, id_member])

    const {
        user,
        id,
        id_currency,
        monthly_sallary,
        hourly_price,
        hourly, // boolean
        id_tracking_type,
        monthly_hours,
        overtime_price,
        markup_percent
    } = data || {}
    const { name, login } = user || {}

    const initialValues = {
        id_currency,
        id_tracking_type,
        hourly: Boolean(hourly),
        monthly_sallary,
        hourly_price,
        monthly_hours,
        overtime_price,
        markup_percent
    }

    const handleSubmit = (values, { setSubmitting, resetForm, setErrors }) => {
        let data = {
            id_user: id,
            ...values
        }

        updateMemberInfo(data).then((result) =>
            requestHandler({
                result,
                on200Http: () => {
                    notify('Изменения успешно сохранены!', 'success')
                },
                on422Error: (errors) => {
                    setErrors(errors)
                },
                onFinishRequest: () => {
                    setSubmitting(false)
                }
            })
        )
    }

    const parcePrice = (p) => Math.abs((Number(p) || 0)?.toFixed(2))

    const getCurrencyById = (id) => currency?.find((i) => i.id === id)

    const inputProps = {
        sx: {
            '& .MuiInputBase-root': {
                backgroundColor: '#fff'
            }
        }
    }

    if (loading)
        return (
            <ContainerLoader
                size={40}
                minWidth="100%"
                sx={{ margin: 'auto' }}
            />
        )

    if (!id_member || !data)
        return (
            <Typography
                variant="subtitle-13"
                color={theme.palette.neutral.black_50}
                sx={{ margin: 'auto' }}
            >
                Выберите участника <br /> для редактирования
            </Typography>
        )

    return (
        <Stack className={classes.infoBoxRoot}>
            <Typography className={classes.userName}>
                {name || login}
            </Typography>
            <Formik
                validationSchema={ValidationSchema}
                validateOnBlur={false}
                validateOnChange={false}
                enableReinitialize={true}
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {({
                    submitForm,
                    isSubmitting,
                    handleChange,
                    values,
                    errors,
                    setFieldValue
                }) => {
                    const {
                        id_currency,
                        hourly,
                        monthly_hours,
                        overtime_price,
                        markup_percent,
                        id_tracking_type
                    } = values

                    let ammountKey = hourly ? 'hourly_price' : 'monthly_sallary'

                    return (
                        <Form className={classes.form}>

                            <FormGroup label="ТИП ОПЛАТЫ">
                                <FormCheckbox
                                    name="hourly"
                                    value={hourly}
                                    setFieldValue={setFieldValue}
                                    options={[
                                        {
                                            label: 'Cтавка',
                                            value: false
                                        },
                                        {
                                            label: 'Почасовка',
                                            value: true
                                        }
                                    ]}
                                />
                            </FormGroup>

                            <TrackingTypes value={id_tracking_type}
                                           setValue={(v) => setFieldValue('id_tracking_type', v)}/>

                            <FormGroup label="ПОДРОБНОСТИ" marginBottom="30px">
                                <FormControl marginBottom="0">
                                    <InputDropdown
                                        dropdownData={currency}
                                        noBorder
                                        labelInside
                                        inputValue={parcePrice(
                                            values[ammountKey]
                                        )}
                                        id_dropdown={id_currency}
                                        inputName={ammountKey}
                                        label={`Сумма / ${
                                            hourly ? 'час' : 'месяц'
                                        }`}
                                        error={
                                            errors[ammountKey] ||
                                            errors.id_currency
                                        }
                                        handleChangeInput={handleChange}
                                        renderSelected={({ symbol, iso }) => {
                                            return `${symbol} ${iso}`
                                        }}
                                        renderDropdown={({
                                            name,
                                            symbol,
                                            iso
                                        }) => {
                                            return (
                                                <>
                                                    {name} ({symbol} {iso})
                                                </>
                                            )
                                        }}
                                        handleChangeDropdown={(value) => {
                                            setFieldValue('id_currency', value)
                                        }}
                                        size="big"
                                        {...inputProps}
                                    />
                                </FormControl>

                                <FormControl marginBottom="0">
                                    <Input
                                        name="monthly_hours"
                                        type="number"
                                        label="Кол-во рабочих часов в месяц"
                                        value={parseFloat(monthly_hours)}
                                        error={errors.monthly_hours}
                                        onChange={handleChange}
                                        noBorder
                                        labelInside
                                        size="big"
                                        {...inputProps}
                                    />
                                </FormControl>

                                <FormControl marginBottom="0">
                                    <Input
                                        name="overtime_price"
                                        type="number"
                                        label="Овертайм рейт"
                                        value={parseFloat(overtime_price)}
                                        error={errors.overtime_price}
                                        onChange={handleChange}
                                        noBorder
                                        labelInside
                                        endAdornment={
                                            <p
                                                className={
                                                    classes.endAdornmentText
                                                }
                                            >
                                                {
                                                    getCurrencyById(id_currency)
                                                        ?.symbol
                                                }
                                            </p>
                                        }
                                        size="big"
                                        {...inputProps}
                                    />
                                </FormControl>

                                <FormControl marginBottom="0">
                                    <Input
                                        name="markup_percent"
                                        type="number"
                                        label="Процент наценки"
                                        value={parseFloat(markup_percent)}
                                        error={errors.markup_percent}
                                        onChange={handleChange}
                                        noBorder
                                        labelInside
                                        endAdornment={
                                            <p
                                                className={
                                                    classes.endAdornmentText
                                                }
                                            >
                                                %
                                            </p>
                                        }
                                        size="big"
                                        {...inputProps}
                                    />
                                </FormControl>
                            </FormGroup>

                            <Stack gap="12px" sx={{ marginTop: 'auto' }}>
                                <DeleteButton name="Удалить участника"
                                              modalText="Вы действительно <br /> хотите удалить
                                                  этого участника?"
                                              handler={() => {
                                                  deleteMember(id)
                                                      .then((res) => {
                                                          const { status } = res?.data || {}
                                                          if (status)
                                                              setSelectedParticipantId(null)
                                                      })
                                              }}/>

                                <CustomButton
                                    onClick={submitForm}
                                    loading={isSubmitting}
                                    label="Сохранить"
                                />
                            </Stack>
                        </Form>
                    )
                }}
            </Formik>
        </Stack>
    )
}

const useTrackingStyles = makeStyles(() => ({
    item: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '8px',
        padding: '13px',
        borderRadius: '10px',
        background: '#fff',
        border: '1px solid transparent',
        cursor: 'pointer',

        '& .checkbox': {
            gridColumn: '1/1',
            gridRow: '1/2',
            width: '17px',
            height: '17px',
            borderRadius: '50%',
            border: '1px solid #C1C6D0'
        },

        '& .name': {
            gridColumn: '2/2',
            gridRow: '1/1',
            fontSize: '13px'
        },

        '& .description': {
            gridColumn: '2/2',
            gridRow: '2/2',
            fontSize: '12px',
            color: 'rgba(0,0,0,.4)',
            lineHeight: '17px'
        },

        '&.active, &:hover': {
            border: '1px solid #007AFF',
            transition: '0.3s all'
        },

        '&.active .checkbox': {
            border: '1px solid #007AFF',
            backgroundColor: '#007AFF',
            backgroundImage: 'url(/img/checked-white.svg)',
            backgroundSize: '9px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }
    },


}))

const TrackingTypes = ({value, setValue}) => {
    const classes = useTrackingStyles()
    const {data } = useGetTrackingTypesGqlQuery()

    if (empty(data)) return null

    return (
        <FormGroup label="Cтатистика" marginBottom="30px">
            {(data ?? []).map(({ id, name, description }) => {
                return (
                    <Box key={id} className={classNames(classes.item, {
                        active: numberEq(value, id)
                    })} onClick={() => setValue(id)}>
                        <Box className="checkbox" />
                        <Box className="name">{name}</Box>
                        <Box className="description">{description}</Box>
                    </Box>
                )
            })}
        </FormGroup>
    )
}

export default ParticipantInfo
