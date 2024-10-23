import { Component } from 'react'
import { Alert } from '@mui/material'

class ErrorBoundary extends Component {
    state = {
        error: null,
        ErrorComponent: null
    }

    static getDerivedStateFromError(error) {
        console.log(error, '##')
        return { error }
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, errorInfo);
    }

    render() {
        // Return children components in case of no error

        const renderDefault = () => {
            return (
                <Alert variant="error">Произошла ошибка. Повторите позже</Alert>
            )
        }

        const { error } = this.state

        if (error) {
            return this?.props?.ErrorComponent ? (
                <this.props.ErrorComponent error={error} />
            ) : (
                renderDefault()
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
