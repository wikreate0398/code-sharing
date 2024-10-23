import { Box } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'
import TableRow from './table-row'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { requiredMessage } from '#root/src/config/validation-messages'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
    useCreateConstantMutation,
    useFetchConstantsQuery
} from '#root/src/redux/api/cp/constant.api'
import Loader from '#root/src/components/ui/loader'
import { requestHandler } from '#root/src/redux/api-service'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        },
        row: {
            display: 'grid',
            gridTemplateColumns: '215px 15px repeat(2, 1fr)',
            gap: '15px'
        },
        label: {
            fontSize: '13px',
            fontWeight: 400,
            lineHeight: '16px',
            color: '#000',
            opacity: '50%'
        }
    })
)

const item = {
    id: null,
    name: '',
    value: { ru: '', en: '' }
}

const validationSchema = Yup.object().shape({
    items: Yup.array().of(
        Yup.object().shape({
            name: Yup.string()
                .required(requiredMessage)
                .matches(/^[A-Za-z_]+$/, 'Допустимые символы: _'),
            value: Yup.object().shape({
                ru: Yup.string().required(requiredMessage),
                en: Yup.string().required(requiredMessage)
            })
        })
    )
})

const ConstantsTable = () => {
    const classList = useStyles()
    const ref = useRef(null)
    const { data, isLoading } = useFetchConstantsQuery()
    const [initialValues, setInitialValues] = useState({ items: [] })
    const [createConstant] = useCreateConstantMutation()
    useEffect(() => {
        if (isLoading) return

        setInitialValues({ items: data.concat(item) })
    }, [data, setInitialValues, isLoading])

    const handleSubmit = useCallback(
        ({ items, currentElement }) => {
            createConstant(items[currentElement]).then((result) =>
                requestHandler({
                    result,
                    on200Http: () => {
                        if (items.length === currentElement + 1) {
                            items.push(item)
                        }

                        setInitialValues({ items: items })
                    }
                })
            )
        },
        [setInitialValues, createConstant]
    )

    if (isLoading) return <Loader />

    return (
        <Box className={classList.root}>
            <Box className={classList.row}>
                <Box component="span" className={classList.label}>
                    ID / Название константы
                </Box>
                <Box component="span" className={classList.label} />
                <Box component="span" className={classList.label}>
                    RU
                </Box>
                <Box component="span" className={classList.label}>
                    EN
                </Box>
            </Box>
            <Formik
                initialValues={initialValues}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={handleSubmit}
                innerRef={ref}
                enableReinitialize
            >
                {({ values }) => (
                    <Form className={classList.root}>
                        <TableRow
                            validationSchema={validationSchema}
                            items={values.items}
                            className={classList.row}
                        />
                    </Form>
                )}
            </Formik>
        </Box>
    )
}

export default ConstantsTable
