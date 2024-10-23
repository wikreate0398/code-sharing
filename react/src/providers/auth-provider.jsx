
import { createContext } from 'react'
import { useUser } from '#root/src/helpers/hooks'
import { useGetTimerQuery } from '#root/src/redux/api/traking.api.js'
import { useGetOwnerParticipantsOnlineStatusQuery } from '#root/src/redux/api/participant.api'
import { useSelector } from 'react-redux'
import { selectAuthUser } from '#root/src/redux/slices/meta.slice'

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
    const user = useSelector(selectAuthUser)
    useGetOwnerParticipantsOnlineStatusQuery(user.id)
    return null
}

export default AuthProvider
