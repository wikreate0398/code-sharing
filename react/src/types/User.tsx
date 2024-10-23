interface UserProps {
    admin: 0
    avatar: string | null
    created_at: string
    deleted_at: string | null
    email: string
    email_verified_at: string | null
    id: string | number
    id_working_project: string | number
    login: string | null
    name: string | null
    network_provider: string | null
    tz: string | null
    updated_at: string
}

interface ParticipantsProps {
    id: number|string
    name: string
    login: string
    avatar_url: string|null
}

export type { UserProps, ParticipantsProps }
