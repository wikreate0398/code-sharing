import type { UserProps } from '#root/src/types/User'

interface ChecklistProps {
    id: string | number
    comments: {
        comment: string
        created_at: string
        id: string | number
        id_list: string | number
        id_task: string | number
        id_user: string | number
        updated_at: string
        user: UserProps
    }[]
    deleted_at: string | null
    id_task: string | number
    name: string
    position: string | number
    state: string | number
}

export type { ChecklistProps }
