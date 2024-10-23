import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ModalBody } from '#root/src/components/ui/modal'
import * as Yup from 'yup'
import { minimumSymbols, requiredMessage } from '#root/src/config/validation-messages'
import { useNotify } from '#root/src/helpers/hooks'
import {
    useCreateProjectMutation, useDeleteProjectGqlMutation,
    useLazyGetEditProjectGqlQuery,
    useUpdateProjectMutation
} from '#root/src/redux/api/project.api'
import { requestHandler } from '#root/src/redux/api-service'
import { Form, Formik } from 'formik'
import Input from '#root/src/components/ui/form/input'
import Textarea from '#root/src/components/ui/form/textarea'
import { Stack } from '@mui/material'
import useStyles from '#root/src/components/screens/dashboard/projects/_modal/styles'
import { useAddEditProjectContext } from '#root/src/components/screens/dashboard/projects/_modal/context'
import FormInner from '#root/src/components/ui/form/form-inner'
import CustomButton from '#root/src/components/ui/button/custom-button'
import { useTheme } from '@mui/styles'
import DeleteButton from '#root/src/components/ui/button/delete-button.jsx'

const ProjectInfo = ({ handler, children: header }) => {
    const classes = useStyles()

    return (
        <Stack className={classes.regularModal}>
            {header}
            <ModalBody className={classes.modalForm}>
                <ModalContent modalHandler={handler} />
            </ModalBody>
        </Stack>
    )
}

const ValidationSchema = Yup.object().shape({
    name: Yup.string().min(2, minimumSymbols(2)).required(requiredMessage)
})

const ModalContent = ({ modalHandler }) => {
    const notify = useNotify()
    const theme = useTheme()
    const formRef = useRef()
    const [updateProject] = useUpdateProjectMutation()
    const [createProject] = useCreateProjectMutation()
    const [deleteProjectGql] = useDeleteProjectGqlMutation()
    const { id_project, setIdProject, isEditMode, setTab } =
        useAddEditProjectContext()

    const [trigger, { isFetching, isLoading }] = useLazyGetEditProjectGqlQuery()

    const [initialValues, setInitialValues] = useState({
        name: '',
        link: '',
        description: '',
        bg: '#fff'
    })

    useEffect(() => {
        if (id_project) {
            trigger(id_project).then(({ data }) => {
                setInitialValues(data.project)
            })
        }

        return () => {
            formRef?.current?.resetForm()
        }
    }, [id_project])

    const handleSubmit = useCallback(
        (values, { setSubmitting }) => {
            setSubmitting(true)
            const request = isEditMode ? updateProject : createProject
            request(values).then((result) =>
                requestHandler({
                    result,
                    onFinishRequest: () => {
                        setSubmitting(false)
                    },
                    on200Http: ({ message, status, project }) => {
                        notify(message, status)
                        if (status && !isEditMode) {
                            setTab('participant')
                            setIdProject(project.id)
                            //modalHandler()
                        }
                    }
                })
            )
        },
        [
            modalHandler,
            isEditMode,
            setTab,
            setIdProject,
            updateProject,
            createProject
        ]
    )

    return (
        <Formik
            innerRef={formRef}
            validationSchema={ValidationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            enableReinitialize
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
                <FormInner
                    loading={
                        isFetching ||
                        isLoading ||
                        (isEditMode && !initialValues.name)
                    }
                >
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

                        <Stack gap="12px" mt="80px">
                            {isEditMode && (
                                <DeleteButton name="Удалить проект"
                                              bg={theme.palette.neutral[100]}
                                              handler={() => {
                                                  deleteProjectGql(id_project).then(() => {
                                                      modalHandler()
                                                  })
                                              }}/>
                            )}

                            <CustomButton
                                onClick={submitForm}
                                loading={isSubmitting}
                                label="Сохранить"
                            />
                        </Stack>
                    </Form>
                </FormInner>
            )}
        </Formik>
    )
}

export default ProjectInfo
