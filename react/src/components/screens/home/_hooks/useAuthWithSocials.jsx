import { useContext } from 'react'
import {
    AUTH_STEP_SIGNUP,
    AuthContextProvider
} from '#root/src/components/screens/home/_components/context'
import { useAuthWithSocialsMutation } from '#root/src/redux/api/auth.api'
import { requestHandler } from '#root/src/redux/api-service'
import { useGoogleLogin } from '@react-oauth/google'
import { tz } from '#root/src/helpers/functions'

const clientID = import.meta.env.VITE_YANDEX_CLIENT_ID

function getYandexAuthUrl(clientID, redirectUrl) {
    return `https://oauth.yandex.ru/authorize?response_type=token&client_id=${clientID}&redirect_uri=${encodeURIComponent(redirectUrl)}&display=popup}`
}

const useAuthWithSocials = () => {
    const { setStep, setForm, saveAuthCred } = useContext(AuthContextProvider)
    const [authWithSocials] = useAuthWithSocialsMutation()

    const handleAuth = async ({ access_token, provider = 'google' }) => {
        await authWithSocials({
            access_token,
            provider,
            tz: tz()
        }).then((result) =>
            requestHandler({
                result,
                on200Http: (res) => {
                    if ('error' in res) return
                    const { token, user, reg_data } = res || {}

                    if (token) return saveAuthCred(user, token)

                    let social = {
                        ...reg_data,
                        social_token: access_token,
                        network_provider: provider
                    }

                    setForm((f) => ({ ...f, ...social }))
                    setStep(AUTH_STEP_SIGNUP)
                }
            })
        )
    }

    const onGoogleSuccess = (r) =>
        handleAuth({ access_token: r.access_token, provider: 'google' })

    const signInWithGoogle = useGoogleLogin({
        onSuccess: onGoogleSuccess,
        onError: (errorResponse) => {
            alert(
                'Произошли неполадки. Воспользуйтесь другим способом атворизации'
            )
        },
        ux_mode: 'popup'
    })

    const signInWithYandex = ({ onSuccess = null }) => {
        let currentUrl = `${window.location.origin}/socials/yandex`
        let requestUrl = getYandexAuthUrl(clientID, currentUrl)

        let h = 650
        let w = 550
        let y = window.top.outerHeight / 2 + window.top.screenY - h / 2
        let x = window.top.outerWidth / 2 + window.top.screenX - w / 2

        let winRef = window.open(
            requestUrl,
            'popup',
            `width=${w},,height=${h},top=${y},left=${x}`
        )
        winRef.focus()

        let monitorIframe = setInterval(function () {
            try {
                if (!winRef || winRef?.closed) {
                    clearInterval(monitorIframe)
                    return
                }

                let parts = winRef.location?.href.split('#')
                let queryPartUrl =
                    parts.length > 1 && parts[1] !== 'frame' ? parts[1] : null
                let qParams = new URLSearchParams(`?${queryPartUrl}`)
                let access_token = qParams?.get('access_token')

                if (queryPartUrl?.includes('access_token') && access_token) {
                    clearInterval(monitorIframe)
                    winRef.close()

                    // request
                    let params = { access_token, provider: 'yandex' }
                    onSuccess ? onSuccess(params) : handleAuth(params)
                }
            } catch (e) {
                console.log('access token not received yet...')
            }
        }, 1000)
    }

    return { signInWithGoogle, signInWithYandex }
}

export default useAuthWithSocials
