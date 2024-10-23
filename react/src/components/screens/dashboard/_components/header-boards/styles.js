import { makeStyles } from '@mui/styles'

export default makeStyles((theme) => ({
    root: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        minHeight: 52,
        borderBottom: `0.5px solid ${theme.palette.colors.border}`
    },
    leftPannel: {
        flex: 3,
        alignItems: 'center',
        flexDirection: 'row',
        gap: '15px'
    },
    rightPannel: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        gap: '8px'
    },
    onlineMembers: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: '4px',
        paddingRight: 4
    }
}))
