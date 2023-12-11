'use client'

import { createContext } from 'react'
import { useUser } from '@/helpers/hooks'
import { useGetTimerQuery } from '@/redux/api/time.traking.api'
import { useGetOwnerParticipantsOnlineStatusQuery } from '@/redux/api/participant.api'
import { useSelector } from 'react-redux'
import { selectUser } from '@/redux/slices/meta.slice'

const AuthProviderContext = createContext()

const AuthProvider = ({ children }) => {
    const user = useUser()
    useGetTimerQuery()

    if (!user) return null

    return (
        <AuthProviderContext.Provider value={{}}>
            <MetaApp />
            {children}
        </AuthProviderContext.Provider>
    )
}

const MetaApp = () => {
    const user = useSelector(selectUser)
    useGetOwnerParticipantsOnlineStatusQuery(user.id)
    return null
}

export default AuthProvider
