import { projectsRoute } from '#root/src/config/routes'
import {navigate} from "vike/client/router";
import {hasCookies} from "#root/src/helpers/cookies.js";

const adminRoutes = (hasToken, pathname) => {
    let redirectTo = null

    if (hasToken && pathname.startsWith('/dashboard')) {
        redirectTo = '/cp'
    }

    if (!hasToken && pathname.startsWith('/cp')) {
        redirectTo = '/'
    } else if (hasToken && pathname === '/') {
        redirectTo = '/cp'
    }

    return redirectTo
}

export default function guard(pageContext, Component) {
    const pathname = pageContext.urlPathname
    const hasToken = hasCookies('token')
    const hasAdmin = hasCookies('admin')

    let redirectTo = null

    if (hasAdmin && hasToken) {
        redirectTo = adminRoutes(hasToken, pathname)
        if (Boolean(redirectTo)) {
            navigate(redirectTo)
            return null
        }
    } else {
        if (
            (pathname === '/' && hasToken) ||
            (pathname.startsWith('/cp') && hasToken)
        ) {
            redirectTo = projectsRoute()
        } else if (
            !hasToken &&
            (pathname.startsWith('/dashboard') || pathname.startsWith('/cp'))
        ) {
            redirectTo = '/'
        } else if (
            hasToken &&
            pathname.startsWith('/auth') &&
            !pathname.includes('logout')
        ) {
            redirectTo = projectsRoute()
        }

        if (redirectTo !== null) {
            navigate(redirectTo)
            return
        }
    }

    return Component
}
