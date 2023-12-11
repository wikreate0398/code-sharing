import DashboardLayout from '@/components/layouts/dashboard-layout'
import AuthProvider from '@/providers/auth-provider'

const Layout = (props) => {
    return (
        <AuthProvider>
            <DashboardLayout>{props.children}</DashboardLayout>
        </AuthProvider>
    )
}

export default Layout
