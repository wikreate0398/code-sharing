import { Modal } from '#root/src/components/ui/modal'
import { notFound, useParams, useRouter } from '#root/renderer/hooks'
import React, { useCallback } from 'react'
import { boardRoute } from '#root/src/config/routes'
import { useDispatch, useSelector } from 'react-redux'
import { useActions } from '#root/src/helpers/hooks'
import { selectTaskState } from '#root/src/redux/slices/meta.slice'
import { Stack } from '@mui/material'
import useStyles from '#root/src/components/screens/dashboard/project/board/task/styles'
import TaskDetails from '#root/src/components/screens/dashboard/project/board/task/_components/task-details'
import TaskDetailsGeneral from '#root/src/components/screens/dashboard/project/board/task/_components/task-details-general'
import classNames from 'classnames'
import { useFetchTaskInfo } from '#root/src/components/screens/dashboard/project/board/task/hooks'
import { isNull } from '#root/src/helpers/functions'

const Task = () => {
    const { push } = useRouter()
    const dispatch = useDispatch()
    const { setOpenTask } = useActions()
    const { id_project, id_board } = useParams()
    const open = useSelector(selectTaskState)
    const { result, isFulfilled, isError } = useFetchTaskInfo()

    const handleOpen = useCallback(
        (status) => {
            dispatch(setOpenTask(status))
            if (!status) {
                push(boardRoute(id_project, id_board), {
                    overwriteLastHistoryEntry: false
                })
            }
        },
        [id_project, id_board]
    )

    if (isError || (isFulfilled && isNull(result.data))) {
        notFound()
        return 
    }

    return (
        <Modal
            width="100%"
            maxWidth={960}
            height="fit-content"
            open={open}
            onClose={() => handleOpen(false)}
            loading={!isFulfilled}
        >
            {isFulfilled && <Inner data={result.data} />}
        </Modal>
    )
}

const Inner = ({ data }) => {
    const classes = useStyles()
    return (
        <Stack flexDirection="row" className={classes.root}>
            <Stack className={classNames(classes.leftSide, '')}>
                <TaskDetailsGeneral data={data} />
            </Stack>

            <TaskDetails task={data} />
        </Stack>
    )
}

export default Task
