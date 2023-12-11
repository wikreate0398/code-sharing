'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { taskRoute } from '@/config/routes'

const SeoTask = ({ task, slug }) => {
    const { push } = useRouter()

    useEffect(() => {
        if (task?.id) {
            const id_board = slug.split('-')[1]
            push(taskRoute(task.id_project, id_board, task.id))
        }
    }, [slug, task])

    return null
}

export default SeoTask
