
import { useRouter } from "#root/renderer/hooks"
import { useClienSideLogout } from '#root/src/helpers/hooks'
import { useEffect } from 'react'
import { useLogoutMutation } from '#root/src/redux/api/auth.api'

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
