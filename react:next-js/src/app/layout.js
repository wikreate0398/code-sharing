import './styles/global.css'

import ThemeRegistry from '@/providers/theme-registry'

export const metadata = {
    title: 'Itway',
    description: 'Визуальное управление проектами'
}

export const revalidate = 0

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head></head>
            <body>
                <ThemeRegistry>{children}</ThemeRegistry>
            </body>
        </html>
    )
}
