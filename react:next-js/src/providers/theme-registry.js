'use client'

import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import theme from '@/config/theme'
import { SnackbarProvider } from 'notistack'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/redux/store'
import { SnackbarUtilsConfigurator } from '@/config/snack-actions'
import ErrorBoundary from '@/components/ui/error-boundary'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers'
import 'moment/locale/ru'
import { CssBaseline } from '@mui/material'

const ThemeRegistry = ({ children }) => {
    return (
        <ErrorBoundary>
            <LocalizationProvider dateAdapter={AdapterMoment} locale="ru">
                <SnackbarProvider>
                    <SnackbarUtilsConfigurator />
                    <ReduxProvider store={store}>
                        <ThemeProvider theme={theme}>
                            <StyledEngineProvider injectFirst>
                                <CssBaseline />
                                {children}
                            </StyledEngineProvider>
                        </ThemeProvider>
                    </ReduxProvider>
                </SnackbarProvider>
            </LocalizationProvider>
        </ErrorBoundary>
    )
}

export default ThemeRegistry
