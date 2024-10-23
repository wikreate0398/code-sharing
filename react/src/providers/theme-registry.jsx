import theme from '#root/src/config/theme'
import { SnackbarProvider } from 'notistack'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '#root/src/redux/store'
import { SnackbarUtilsConfigurator } from '#root/src/config/snack-actions.jsx'
import ErrorBoundary from '#root/src/components/ui/error-boundary'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { GoogleOAuthProvider } from '@react-oauth/google'
import moment from 'moment'
import 'moment/locale/ru'
import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material'
import React from 'react'

moment.locale('ru', {
    months: 'Январь_Февраль_Март_Апрель_Май_Июнь_Июлб_Август_Сентябрь_Октябрь_Ноябрь_Декабрь'.split(
        '_'
    ),
    monthsShort:
        'янв._февр._март_апр._май_июн_июл._авг_сен._окт._ноя._дек.'.split('_'),
    monthsParseExact: true,
    weekdays:
        'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split(
            '_'
        ),
    weekdaysShort: 'вс._пн._вт._ср._чт._пт._сб.'.split('_'),
    weekdaysMin: 'Вс_Пн_Вт_Ср_Чт_Пт_Сб'.split('_'),
    weekdaysParseExact: true
})

const ThemeRegistry = ({ children }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment} locale="ru">
            <SnackbarProvider>
                <SnackbarUtilsConfigurator />
                <ReduxProvider store={store}>
                    <ThemeProvider theme={theme}>
                        <StyledEngineProvider injectFirst>
                            <CssBaseline />
                            <GoogleOAuthProvider
                                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                            >
                                <ErrorBoundary>{children}</ErrorBoundary>
                            </GoogleOAuthProvider>
                        </StyledEngineProvider>
                    </ThemeProvider>
                </ReduxProvider>
            </SnackbarProvider>
        </LocalizationProvider>
    )
}

export default ThemeRegistry
