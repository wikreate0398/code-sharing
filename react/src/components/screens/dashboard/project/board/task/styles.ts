import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/system'

export default makeStyles((theme: Theme) => ({
    root: {
        // width: '100%',
        // maxWidth: 960,
        minHeight: 450,
        maxHeight: '85vh',
        height: 'fit-content'
    },
    leftSide: {
        flex: 1,
        flexDirection: 'column',
        padding: '42px 48px',
        overflow: 'scroll'
    },
    rightSide: {
        width: 310,
        gap: '20px',
        overflow: 'auto',
        padding: '48px 24px 32px',
        flexDirection: 'column',
        backgroundColor: theme.palette.neutral[200]
    },

    datePicker: {
        '& .MuiTabs-root': {
            display: 'none'
        },
        '& .MuiPickersToolbar-root': {
            display: 'none',
            backgroundColor: theme.palette.neutral[200],
            color: 'transparent',
            '& span.MuiTypography-overline': {
                display: 'none'
            }
        }
    }
}))
