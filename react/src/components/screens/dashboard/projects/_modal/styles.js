import { makeStyles } from '@mui/styles'

export default makeStyles((theme) => ({
    // MODAL
    regularModal: {
        width: 350
    },
    largeModal: {
        width: 710,
        minHeight: 500,
        maxHeight: '85vh',
        height: 'fit-content'
    },
    modalHeader: {
        padding: '32px 32px 0'
    },
    tabItem: {
        '&.item': {
            paddingTop: 0,
            paddingBottom: '12px'
        }
    },
    tabItemDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed!important'
    },
    modalForm: {
        padding: '18px 32px 40px'
    },
    modalTitle: {
        textAlign: 'left'
    },
    modalLeftPanel: {
        flex: 1,
        maxWidth: 345,
        flexDirection: 'column',
        maxHeight: '85vh',
        minHeight: 500
    },
    modalRightPanel: {
        flex: 1,

        maxHeight: '85vh',
        minHeight: 500,
        overflow: 'auto',
        padding: '32px 40px 40px',
        flexDirection: 'column',
        backgroundColor: theme.palette.neutral[200]
    },
    userInfoBox: {
        position: 'relative',
        height: '100%',
        justifyContent: 'center',
        flex: 1,
        borderBottom: '1px solid #c2ccd680',
        '&.active': {
            borderColor: 'transparent'
        },
        '&.noBorder': {
            borderColor: 'transparent'
        }
    },
    notFoundText: {
        height: 56,
        lineHeight: '56px',
        padding: '0 10px'
    },
    addParticipantBox: {
        borderBottom: '1px solid transparent',
        '&.active': {
            borderColor: '#00000080'
        },
        '&.large': {
            height: 56,
            margin: '0 32px'
        },
        '&.small': {
            height: 30,
            padding: '3px 0'
        }
    },
    addParticipantBtn: {
        minWidth: 'auto',
        border: '1px dashed #6C78854D',
        '&.large': {
            width: 36,
            height: 36,
            borderRadius: '12px'
        },
        '&.small': {
            width: 22,
            height: 22,
            borderRadius: '7px'
        }
    },
    addParticipantText: {
        cursor: 'pointer',
        fontSize: 13,
        lineHeight: '15px',
        color: theme.palette.neutral.text
    },
    participantDrowdown: {
        position: 'fixed',
        pointerEvents: 'none',
        opacity: 0,
        minHeight: 'auto',
        padding: '0 10px',
        overflow: 'auto',
        zIndex: 12,

        // to fit min 4 items in one scroll
        maxHeight: 224,
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0px 6px 15px 0px #00000038',
        transition: '0.2s',
        '&.bottom': {
            transform: 'translateY(10px)'
        },
        '&.top': {
            transform: 'translateY(-110%)'
        },
        '&.active': {
            opacity: 1,
            transform: 'translateY(0px)',
            pointerEvents: 'all',
            '&.top': {
                transform: 'translateY(-100%)'
            }
        }
    },
    participantBox: {
        minHeight: 56,
        gap: '15px',
        alignItems: 'center',
        flexDirection: 'row',
        cursor: 'pointer',
        backgroundColor: '#fff',
        '&.isSelected': {
            backgroundColor: '#E8F5FF'
        },
        '&:last-of-type $participantBoxInfo': {
            borderBottom: 'none'
        }
    },
    participantBoxInfo: {
        flex: 1,
        gap: '3px',
        height: '100%',
        padding: '10px 0',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #c2ccd680',
        '&.column': {
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center'
        }
    },
    participantBoxInner: {
        gap: '3px'
    },
    participantName: {
        fontWeight: 500
    },
    participantLogin: {
        fontSize: 12,
        lineHeight: '14px',
        color: '#959EA7'
    },
    leftPanellist: {
        overflow: 'auto',
        // maxHeight: 450,
        flex: 1,
        marginBottom: '12px',
        position: 'relative',
        flexDirection: 'column'
    },
    infoBoxRoot: {
        gap: 0
    },
    form: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    userName: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: '20px',
        color: '#000000',
        marginBottom: 27
    },
    formGroup: {
        gap: '12px',
        marginBottom: 20
    },
    formGroupText: {
        fontSize: 10,
        fontWeight: 500,
        lineHeight: '12px',
        letterSpacing: '0.3px',
        textTransform: 'uppercase',
        color: theme.palette.neutral[700]
    },
    paymentIntervalBox: {
        backgroundColor: '#E8E9EE',
        borderRadius: '6px',
        padding: '4px',
        width: '100%',
        gap: '10px',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        cursor: 'pointer'
    },
    paymentIntervalText: {
        flex: 1,
        height: 28,
        fontSize: 12,
        fontWeight: 500,
        textAlign: 'center',
        lineHeight: '28px',
        opacity: 0.6,
        borderRadius: '6px',
        transition: '0.2s',
        backgroundColor: 'transparent',
        '&.active': {
            opacity: 1,
            backgroundColor: 'white',
            boxShadow: '0px 3px 1px 0px #0000000A, 0px 3px 8px 0px #0000001F'
        }
    },

    removeBtn: {
        height: 38,
        padding: '0 14px',
        background: '#fff',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '14px',
        borderRadius: '8px',
        gap: '8px',
        justifyContent: 'space-between',
        color: theme.palette.colors.delete,

        '&.neutral': {
            background: theme.palette.neutral[100]
        }
    },

    endAdornmentText: {
        color: '#979797',
        fontWeight: 600,
        fontSize: '16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center'
    },
    boardInfoCard: {
        background: 'white',
        borderRadius: 8,
        padding: '0 12px',
        gap: 0
    },
    participantNote: {
        background: 'white',
        borderRadius: 8,
        padding: '18px',
        gap: 8,
        flexDirection: 'row'
    },
    boardInfoCardInner: {
        maxHeight: 170,
        overflow: 'scroll',
        '& $participantBox': {
            '&:last-of-type': {}
        }
    },
    boardColumnItem: {
        minHeight: 56,
        gap: '15px',
        alignItems: 'center',
        flexDirection: 'row',
        cursor: 'pointer'
    },

    boardColumnInfo: {
        flex: 1,
        gap: '3px',
        height: '100%',
        padding: '10px 0',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        '&.column': {
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center'
        }
    },
    boardColumnInner: {
        gap: '3px'
    },
    boardColumnName: {
        fontWeight: 500
    },
    columnParticipantsNumber: {
        fontSize: 12,
        lineHeight: '14px',
        color: '#959EA7'
    },
    columnParticipants: {
        paddingLeft: '50px',
        gap: '2px',
        maxHeight: 135,
        overflow: 'auto'
    },
    columnParticipantsName: {
        fontSize: 12,
        lineHeight: '14px',
        color: '#000'
    },
    columnParticipantItem: {
        width: '100%',
        gap: '9px',
        height: '30px',
        alignItems: 'center'
    },

    emojiComponent: {
        width: 36,
        height: 36,
        background: '#F3F4F7',
        borderRadius: 12,
        cursor: 'pointer',
        justifyContent: 'center',
        alignItems: 'center',
        transition: '0.2 ease',
        '&.empty': {
            background: 'transparent',
            border: '1px dashed #6C78854D'
        },
        '&.active': {
            background: 'transparent',
            borderColor: 'rgba(108, 120, 133, 1)',
            '& svg path': {
                fill: 'rgba(108, 120, 133, 1)'
            }
        }
    }
}))
