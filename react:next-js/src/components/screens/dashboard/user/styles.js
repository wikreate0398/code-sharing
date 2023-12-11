import { makeStyles } from '@mui/styles'

export default makeStyles((theme) => ({
    root: {
        maxWidth: '684px',
        paddingTop: '60px',
        margin: '0 auto',
        width: '100%',
        gap: '30px'
    },
    title: {
        fontSize: '28px',
        fontWeight: 600,
        lineHeight: '28px',
        letterSpacing: '-0.025em'
    },
    divider: {
        width: '100%',
        borderTop: '1px solid #C2CCD6'
    },
    content: {
        flexDirection: 'row',
        gap: '40px'
    },
    form: {
        flex: 2
    },
    multiselectInputWrapper: {
        backgroundColor: 'transparent'
    },
    avatarWrapper: {
        position: 'relative',
        height: 'fit-content'
    },
    uploadBtn: {
        position: 'absolute',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        gap: '5px',
        alignItems: 'center',
        bottom: 10,
        width: 'calc(100% - 29px)',
        left: 0,
        right: 0,
        margin: '0 auto',
        zIndex: 2,
        color: '#FFFFFF',
        fontSize: '14px',
        lineHeight: '16px',
        fontWeight: 400,
        borderRadius: '12px',
        minHeight: 32,
        backdropFilter: 'blur(10px)',
        '&:hover': {
            backdropFilter: 'blur(12px)'
        }
    },
    group: {
        flexDirection: 'column',
        paddingBottom: '48px',
        '& $divider': {
            margin: '13px 0 24px'
        }
    },
    groupTitle: {
        fontSize: '13px',
        lineHeight: '12px',
        fontWeight: 500,
        color: '#9499A4',
        letterSpacing: '0.3px',
        textTransform: 'uppercase'
    },
    modalTitle: {
        fontSize: '24px',
        lineHeight: '28px',
        fontWeight: 600,
        textAlign: 'center',
        color: '#000000'
    },
    modalBody: {
        maxWidth: 320,
        margin: '0 auto',
        padding: '37px 0 0',
        '& button': {
            flex: 1,
            width: '100%'
        }
    },
    // 259 37 65
    formError: {
        color: '#d32f2f',
        fontSize: '14px',
        lineHeight: '20px',
        marginTop: '6px'
    },
    groupBody: {
        flexDirection: 'column',
        gap: '24px'
    },

    deleteBtn: {
        width: 'fit-content',
        padding: '15px 20px',
        background: '#F3F4F7',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '16px',
        gap: '8px',
        color: theme.palette.colors.delete
    },
    textSocialAuth: {
        fontSize: '14px',
        lineHeight: '18px',
        color: '#7E828C',
        marginBottom: '-8px'
    },

    socialAuthBtns: {
        flex: 1,
        padding: '10px 32px',
        border: '1px solid #C1C6D0',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '16px',
        gap: '8px'
    },
    button: {
        width: 'fit-content',
        minWidth: 115
    }
}))
