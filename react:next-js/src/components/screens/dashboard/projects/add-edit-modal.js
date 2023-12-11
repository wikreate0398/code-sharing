'use client'

import { Modal, ModalHeader, ModalBody } from '@/components/ui/modal'
import { useNotify } from '@/helpers/hooks'
import { Form, Formik } from 'formik'
import Input from '@/components/ui/form/input'
import { Typography } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'
import {
    maxSymbolsValidation,
    requiredMessage
} from '@/config/validation-messages'
import Textarea from '@/components/ui/form/textarea'
import SubmitBtn from '@/components/ui/form/submit-button'
import {
    useCreateProjectMutation,
    useUpdateProjectMutation
} from '@/redux/api/project.api'
import { requestHandler } from '@/redux/api-service'

const AddEditModal = ({ open, handler, item }) => {
    return (
        <Modal open={open} onClose={handler}>
            <ModalHeader>
                <Typography variant="title-24">
                    {item ? 'Редактировать' : 'Добавить'}
                </Typography>
            </ModalHeader>
            <ModalBody>
                <ModalContent modalHandler={handler} item={item} />
            </ModalBody>
        </Modal>
    )
}

const ValidationSchema = Yup.object().shape({
    name: Yup.string().min(5, maxSymbolsValidation(5)).required(requiredMessage)
})

const ModalContent = ({ modalHandler, item }) => {
    const notify = useNotify()
    const formRef = useRef()
    const [updateProject] = useUpdateProjectMutation()
    const [createProject] = useCreateProjectMutation()

    const [initialValues, setInitialValues] = useState({
        name: '',
        link: '',
        description: '',
        service_description: '',
        bg: '#fff'
    })

    useEffect(() => {
        if (item) setInitialValues(item)
        return () => {
            formRef?.current?.resetForm()
        }
    }, [item])

    const handleSubmit = useCallback(
        (values, { setSubmitting }) => {
            setSubmitting(true)
            const request = item?.id ? updateProject : createProject
            request(values).then((result) =>
                requestHandler({
                    result,
                    onFinishRequest: () => {
                        setSubmitting(false)
                    },
                    on200Http: ({ message, status }) => {
                        notify(message, status)
                        if (status) modalHandler()
                    }
                })
            )
        },
        [modalHandler, item, updateProject, createProject]
    )

    if (item && !initialValues?.id) return null

    return (
        <Formik
            innerRef={formRef}
            validationSchema={ValidationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            {({
                submitForm,
                resetForm,
                isSubmitting,
                handleChange,
                values,
                errors,
                setFieldValue
            }) => (
                <Form>
                    <Input
                        name="name"
                        label="Название"
                        value={values.name}
                        onChange={handleChange}
                        error={errors.name}
                        mb="15px"
                    />

                    <Input
                        name="link"
                        label="Ссылка"
                        value={values.link}
                        onChange={handleChange}
                        error={errors.link}
                        mb="15px"
                    />

                    <Textarea
                        name="service_description"
                        placeholder="Услуга"
                        value={values.service_description}
                        onChange={handleChange}
                        mb="15px"
                    />

                    <Textarea
                        name="description"
                        placeholder="Описание"
                        value={values.description}
                        onChange={handleChange}
                        mb="15px"
                    />

                    <Input
                        name="bg"
                        label="Цвет фона (HEX)"
                        value={values.bg}
                        error={errors.bg}
                        onChange={(hex) => setFieldValue('bg', hex)}
                        colorPicker
                        mb="15px"
                    />

                    <SubmitBtn isSubmitting={isSubmitting} onClick={submitForm}>
                        Сохранить
                    </SubmitBtn>
                </Form>
            )}
        </Formik>
    )
}
///
export default AddEditModal
