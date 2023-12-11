import ProjectProvider from '@/providers/project-provider'

const Layout = ({ children }) => {
    return <ProjectProvider>{children}</ProjectProvider>
}

export default Layout
