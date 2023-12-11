import { NextResponse } from 'next/server'
import { projectsRoute, taskRoute } from '@/config/routes'

const adminRoutes = (request, hasToken, pathname) => {
    let redirect = null

    if (hasToken && pathname.startsWith('/dashboard')) {
        redirect = '/cp'
    }
    if (!hasToken && pathname.startsWith('/cp')) {
        redirect = '/'
    } else if (hasToken && pathname === '/') {
        redirect = '/cp'
    }

    if (redirect) {
        return NextResponse.redirect(new URL(redirect, request.url))
    }
}

export function middleware(request) {
    const { pathname } = request.nextUrl
    const hasToken = request.cookies.has('token')
    const hasAdmin = request.cookies.has('admin')

    let redirect = null

    if (hasAdmin && hasToken) {
        return adminRoutes(request, hasToken, pathname)
    }

    if (
        (pathname === '/' && hasToken) ||
        (pathname.startsWith('/cp') && hasToken)
    ) {
        redirect = projectsRoute()
    } else if (
        !hasToken &&
        (pathname.startsWith('/dashboard') || pathname.startsWith('/cp'))
    ) {
        redirect = '/'
    } else if (
        hasToken &&
        pathname.startsWith('/auth') &&
        !pathname.includes('logout')
    ) {
        redirect = projectsRoute()
    }

    if (redirect) {
        return NextResponse.redirect(new URL(redirect, request.url))
    }
}

export const config = {
    matcher: ['/', '/auth/:path*', '/dashboard/:path*', '/cp/:path*']
}
