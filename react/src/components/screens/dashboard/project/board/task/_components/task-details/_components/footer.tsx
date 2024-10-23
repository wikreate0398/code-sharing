import React, { memo, useCallback, useState } from 'react'
import { Box } from '@mui/material'
import {
    confirmAlert,
    flexStartProps,
    spaceBetweenProps
} from '#root/src/helpers/functions'
import { useUpdateTask } from '#root/src/components/screens/dashboard/project/board/task/hooks'
import IconBtn from '#root/src/components/ui/button/icon-button'
import FireIcon from '#root/src/components/ui/svg-icons/icons/fire-icon'
import ArchiveIcon from '#root/src/components/ui/svg-icons/icons/archive-icon'
import { useParams, useRouter } from "#root/renderer/hooks"
import { useDeleteTaskMutation } from '#root/src/redux/api/task/task.api'
import { boardRoute } from '#root/src/config/routes'
import TrashIcon from '#root/src/components/ui/svg-icons/icons/trash-icon'
import { CopyToClipboard } from 'react-copy-to-clipboard/src/Component'
import Icon from '#root/src/components/ui/icon'

interface FooterProps {
    id: number
    url: string
    urgent: boolean
    archive: boolean
}

const Footer = memo(({ id, url, urgent, archive }: FooterProps) => {
    return (
        <Box {...spaceBetweenProps()} mt="50px" marginTop="auto">
            <Urgent id={id} urgent={Boolean(urgent)} />
            <Box {...flexStartProps('center')} gap="12px">
                <Share url={url} />
                <Archive id={id} archive={archive} />
                <Delete id={id} />
            </Box>
        </Box>
    )
})

interface UrgentProps {
    id: number
    urgent: boolean
}

const Urgent = memo(({ id, urgent }: UrgentProps) => {
    const updateTask = useUpdateTask()
    return (
        <IconBtn
            size="big"
            active={Boolean(urgent)}
            tooltip={{
                title: 'Горящая задача', arrow: true, placement: 'top'
            }}
            activeProps={{
                btnColor: 'urgent',
                iconColor: '#fff'
            }}
            onClick={() => updateTask({ id, urgent: !urgent })}
        >
            <FireIcon />
        </IconBtn>
    )
})

interface ArchiveProps {
    id: number
    archive: boolean
}

const Archive = memo(({ id, archive }: ArchiveProps) => {
    const updateTask = useUpdateTask()

    return (
        <IconBtn
            size="big"
            active={Boolean(archive)}
            tooltip={{
                title: 'Архив', arrow: true, placement: 'top'
            }}
            onClick={() => updateTask({ id, archive: !archive })}
        >
            <ArchiveIcon />
        </IconBtn>
    )
})

interface DeleteProps {
    id: number
}

const Delete = memo(({ id }: DeleteProps) => {
    const { id_board, id_project } = useParams()
    const { push } = useRouter()
    const [deleteTask] = useDeleteTaskMutation()

    const handleDelete = useCallback(() => {
        if (confirmAlert()) {
            deleteTask({ id, id_board })
            push(boardRoute(id_project, id_board))
        }
    }, [id, deleteTask, id_project, id_board])

    return (
        <IconBtn size="big"
                 onClick={handleDelete}
                 tooltip={{
                     title: 'Удалить', arrow: true, placement: 'top'
                 }}>
            <TrashIcon />
        </IconBtn>
    )
})

interface ShareProps {
    url: string
}

const Share = memo(({ url }: ShareProps) => {
    const { id_board } = useParams()
    const [copied, setCopied] = useState(false)

    return (
        <Box>
            <CopyToClipboard
                text={`${window.location.origin}/t/${url}-${id_board}`}
                onCopy={() => setCopied(true)}
            >
                <IconBtn size="big"
                         tooltip={{
                            title: copied ? 'Скопировано!' : 'Поделиться',
                             arrow: true,
                             placement: 'top',
                             onClose: () => {
                                 setTimeout(() => setCopied(false), 100)
                             }
                        }}>
                    <Icon name="share" width={14} height={16} pointer />
                </IconBtn>
            </CopyToClipboard>
        </Box>
    )
})

export default Footer
