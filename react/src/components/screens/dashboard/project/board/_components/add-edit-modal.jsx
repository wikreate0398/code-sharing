
import { Modal, ModalHeader, ModalBody } from '#root/src/components/ui/modal'
import { useNotify } from '#root/src/helpers/hooks'
import { Form, Formik } from 'formik'
import Input from '#root/src/components/ui/form/input'
import { Typography } from '@mui/material'
import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react'
import * as Yup from 'yup'
import { requiredMessage } from '#root/src/config/validation-messages'
import ParticipantsSelector from '#root/src/components/screens/dashboard/project/_components/participants-selector'
import { useSelector } from 'react-redux'
import { selectAuthUser } from '#root/src/redux/slices/meta.slice'
import {
    useCreateBoardGqlMutation,
    useUpdateBoardGqlMutation
} from '#root/src/redux/api/board.api'
import { ProjectProviderContext } from '#root/src/providers/project-provider'
import { empty, pluck } from '#root/src/helpers/functions'
import { requestHandler, usePrefetch } from '#root/src/redux/api-service'
import CustomButton from '#root/src/components/ui/button/custom-button'

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
    const user = useSelector(selectAuthUser)
    const notify = useNotify()
    const formRef = useRef()
    const { project } = useContext(ProjectProviderContext)
    const [createBoardGql] = useCreateBoardGqlMutation()
    const [updateBoardGql] = useUpdateBoardGqlMutation()
    const prefetchParticipantsOnlineStatuse = usePrefetch(
        'getOwnerParticipantsOnlineStatus'
    )

    const [initialValues, setInitialValues] = useState({
        id: null,
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
            const request = item?.id ? updateBoardGql : createBoardGql

            request({
                ...values,
                private: Boolean(values.private),
                participants: pluck(values.participants, 'id'),
                id_project: project.id
            }).then((result) => {

                setSubmitting(false)
                prefetchParticipantsOnlineStatuse(user.id, {
                    force: true
                })
                modalHandler()
            })
        },
        [user, modalHandler, item, project, updateBoardGql, createBoardGql]
    )

    if ((item && !initialValues?.id))
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
                isSubmitting,
                handleChange,
                values,
                errors,
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

                    <CustomButton
                        onClick={submitForm}
                        loading={isSubmitting}
                        label="Сохранить"
                    />
                </Form>
            )}
        </Formik>
    )
}

export default AddEditModal
