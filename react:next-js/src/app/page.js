'use client'

import dynamic from 'next/dynamic'

const HomeScreen = dynamic(() => import('@/components/screens/home'), {
    ssr: false
})

export default function HomePage() {
    return <HomeScreen />
}
