'use client'

import { Modal, ModalBody } from '@/components/ui/modal'
import {
    notFound,
    useParams,
    useRouter,
    useSearchParams
} from 'next/navigation'
import {
    useDeleteTaskMutation,
    useLazyGetTaskQuery,
    useUpdateTaskMutation
} from '@/redux/api/task.api'
import TaskHeader from '@/components/screens/dashboard/project/board/task/_components/task-header'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { boardRoute } from '@/config/routes'
import Checklist from '@/components/screens/dashboard/project/board/task/_components/checklist'
import Description from '@/components/screens/dashboard/project/board/task/_components/description'
import { Form, Formik } from 'formik'
import Participants from '@/components/screens/dashboard/project/board/task/_components/participants'
import {
    confirmAlert,
    pluck,
    spaceBetweenProps,
    flexStartProps
} from '@/helpers/functions'
import { useDispatch, useSelector } from 'react-redux'
import { useActions } from '@/helpers/hooks'
import Columns from '@/components/screens/dashboard/project/board/task/_components/columns'
import { selectTaskState } from '@/redux/slices/meta.slice'
import { Box, Button } from '@mui/material'
import Icon from '@/components/ui/icon'
import { styled } from '@mui/styles'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const Task = () => {
    const { push } = useRouter()
    const dispatch = useDispatch()
    const { setOpenTask } = useActions()
    const { id_project, id_board } = useParams()
    const open = useSelector(selectTaskState)
    const query = useSearchParams()
    const [trigger, result] = useLazyGetTaskQuery({
        refetchOnMountOrArgChange: true
    })

    const idTask = useMemo(() => parseInt(query.get('t')), [query])

    useEffect(() => {
        if (idTask) {
            dispatch(setOpenTask(true))
            trigger(idTask)
        }
    }, [idTask])

    const handleOpen = useCallback(
        (status) => {
            dispatch(setOpenTask(status))
            if (!status) {
                push(boardRoute(id_project, id_board))
            }
        },
        [id_project, id_board]
    )

    if (result?.isError) notFound()

    return (
        <Modal
            width={570}
            minHeight={450}
            open={open}
            onClose={() => handleOpen(false)}
            loading={result.status !== 'fulfilled'}
        >
            {result.status === 'fulfilled' && <Inner data={result.data} />}
        </Modal>
    )
}

const defInitialValues = {
    id: null,
    name: '',
    comment: '',
    list: [],
    participants: [],
    columns: []
}

const Inner = ({ data }) => {
    const formRef = useRef()
    const [updateTask] = useUpdateTaskMutation()
    const { id_board, id_column } = useParams()
    const [initialValues, setInitialVal] = useState(defInitialValues)

    useEffect(() => {
        const { id, name, comment, list, participants, columns_relations } =
            data
        setInitialVal({
            id,
            name,
            comment,
            list,
            participants: pluck(participants, 'id'),
            columns: pluck(columns_relations, 'id_column')
        })
    }, [data])

    const handleSubmit = useCallback(
        (values) => {
            updateTask({ id_column, id_board, ...values })
        },
        [data, id_column, id_board]
    )

    if (initialValues.id === null) return null

    return (
        <ModalBody>
            <Formik
                innerRef={formRef}
                enableReinitialize
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, submitForm }) => (
                    <Form>
                        <TaskHeader
                            id={data.id}
                            created_at={data.created_at}
                            name={values.name}
                            author={data.author}
                            setFieldValue={setFieldValue}
                            submitForm={submitForm}
                        />
                        <Checklist list={data.list} id_task={data.id} />
                        <Description
                            hasMention={true}
                            comment={values.comment}
                            setFieldValue={setFieldValue}
                            submitForm={submitForm}
                        />
                        <Columns selectedColumns={values.columns} />
                        <Footer
                            id_task={data.id}
                            url={data.url}
                            participants={data.participants}
                        />
                    </Form>
                )}
            </Formik>
        </ModalBody>
    )
}

const Footer = memo(({ id_task, url, participants }) => {
    return (
        <Box {...spaceBetweenProps()} mt="50px">
            <Participants data={participants} />
            <Box {...flexStartProps('center')} gap="12px">
                <Share url={url} />
                <Delete id_task={id_task} />
            </Box>
        </Box>
    )
})

const Btn = styled(Button)(() => ({
    '&.MuiButtonBase-root': {
        border: '1px solid #CACCD4',
        borderRadius: '8px',
        padding: '8px',
        minWidth: 'auto'
    }
}))

const Delete = memo(({ id_task }) => {
    const { id_board, id_project } = useParams()
    const { push } = useRouter()
    const [deleteTask] = useDeleteTaskMutation()

    const handleDelete = useCallback(() => {
        if (confirmAlert()) {
            deleteTask({ id: id_task, id_board })
            push(boardRoute(id_project, id_board))
        }
    }, [id_task, deleteTask, id_project, id_board])

    return (
        <Btn onClick={handleDelete}>
            <Icon name="trash" width={14} height={16} pointer />
        </Btn>
    )
})

const Share = memo(({ url }) => {
    const { id_board } = useParams()

    return (
        <CopyToClipboard
            text={`${window.location.origin}/t/${url}-${id_board}`}
        >
            <Btn>
                <Icon name="share" width={14} height={16} pointer />
            </Btn>
        </CopyToClipboard>
    )
})

export default Task
