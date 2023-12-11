'use client'

import { useRouter } from 'next/navigation'
import { useClienSideLogout } from '@/helpers/hooks'
import { useEffect } from 'react'
import { useLogoutMutation } from '@/redux/api/auth.api'

const Logout = () => {
    const { push } = useRouter()
    const clientSideLogout = useClienSideLogout()
    const [logout] = useLogoutMutation()

    const systemLogout = () => {
        clientSideLogout()
        push('/')
    }

    useEffect(() => {
        logout().then(systemLogout).catch(systemLogout)
    }, [])

    return null
}

export default Logout
