'use client'

import { Modal, ModalHeader, ModalBody } from '@/components/ui/modal'
import { useNotify } from '@/helpers/hooks'
import { Form, Formik } from 'formik'
import Input from '@/components/ui/form/input'
import { Typography } from '@mui/material'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'
import { requiredMessage } from '@/config/validation-messages'
import SubmitBtn from '@/components/ui/form/submit-button'
import ParticipantsSelector from '@/components/screens/dashboard/project/_components/participants-selector'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '@/redux/slices/meta.slice'
import {
    useCreateBoardMutation,
    useUpdateBoardMutation
} from '@/redux/api/board.api'
import { ProjectProviderContext } from '@/providers/project-provider'
import { empty } from '@/helpers/functions'
import { apiService, requestHandler, usePrefetch } from '@/redux/api-service'

const AddEditModal = ({ open, handler, item }) => {
    return (
        <Modal open={open} onClose={handler}>
            <ModalHeader>
                <Typography variant="title-24">
                    {item ? 'Редактировать доску' : 'Добавить доску'}
                </Typography>
            </ModalHeader>
            <ModalBody>
                <ModalContent modalHandler={handler} item={item} />
            </ModalBody>
        </Modal>
    )
}

const ValidationSchema = Yup.object().shape({
    name: Yup.string().required(requiredMessage)
})

const ModalContent = ({ modalHandler, item }) => {
    const user = useSelector(selectUser)
    const notify = useNotify()
    const formRef = useRef()
    const { project } = useContext(ProjectProviderContext)
    const [createBoard] = useCreateBoardMutation()
    const [updateBoard] = useUpdateBoardMutation()
    const prefetchParticipantsOnlineStatuse = usePrefetch(
        'getOwnerParticipantsOnlineStatus'
    )

    const [initialValues, setInitialValues] = useState({
        name: '',
        participants: []
    })

    useEffect(() => {
        if (item) {
            setInitialValues(item)
        } else {
            setInitialValues({
                ...initialValues,
                participants: [
                    {
                        id: user.id,
                        name: user.name,
                        login: user.login
                    }
                ]
            })
        }
        return () => {
            formRef?.current?.resetForm()
        }
    }, [item])

    const handleSubmit = useCallback(
        (values, { setSubmitting }) => {
            setSubmitting(true)
            const request = item?.id ? updateBoard : createBoard
            request({ ...values, id_project: project.id }).then((result) =>
                requestHandler({
                    result,
                    onFinishRequest: () => {
                        setSubmitting(false)
                    },
                    on200Http: ({ message, status }) => {
                        notify(message, status)
                        if (status) {
                            prefetchParticipantsOnlineStatuse(user.id, {
                                force: true
                            })
                            modalHandler()
                        }
                    }
                })
            )
        },
        [user, modalHandler, item, project, updateBoard, createBoard]
    )

    if ((item && !initialValues?.id) || empty(initialValues.participants))
        return null

    return (
        <Formik
            innerRef={formRef}
            validationSchema={ValidationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={initialValues}
            enableReinitialize
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
                        label="Название доски"
                        value={values.name}
                        onChange={handleChange}
                        error={errors.name}
                        mb="15px"
                    />

                    <ParticipantsSelector values={values.participants} />

                    <SubmitBtn isSubmitting={isSubmitting} onClick={submitForm}>
                        Сохранить
                    </SubmitBtn>
                </Form>
            )}
        </Formik>
    )
}

export default AddEditModal
