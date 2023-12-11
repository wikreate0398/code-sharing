'use client'

import Echo from 'laravel-echo'
import { isClient } from '@/helpers/functions'
import http from '@/services/rest/rest'

const websocket = () => {
    if (window.Echo !== undefined) return window.Echo

    window.Pusher = require('pusher-js')
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: '456',
        authEndpoint: `${process.env.API_URL}broadcasting/auth`,
        auth: {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                Accept: 'application/json'
            }
        },
        wsHost:
            window.location.protocol === 'http'
                ? window.location.hostname
                : new URL(process.env.API_BASE).host,
        wsPort: 6001,
        wssport: 6001,
        transports: ['websocket'],
        enabledTransports: ['ws', 'wss'],
        forceTLS: false,
        disableStats: true,
        cluster: 'eu'
    })

    http.interceptors.request.use(
        (config) => {
            if (isClient()) {
                config.headers['X-Socket-ID'] = window.Echo.socketId()
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    return window.Echo
}

export default websocket
