import { makeStyles } from '@mui/styles'
import { HEADER_HEIGHT, HEADER_MARGINS } from '@/config/const'

export default makeStyles((theme) => ({
    add: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: '16px 0',
        fontSize: '14px',
        fontWeight: 'bold',
        borderRadius: '8px',
        border: '1px dashed #BABABA',
        margin: '24px 0 10px',
        cursor: 'pointer'
    },
    plus: {
        color: '#E9E9E9',
        fontWeight: 'bold',
        fontSize: '20px',
        marginRight: '6px'
    },
    title: () => ({
        fontSize: '28px',
        fontWeight: 600,
        lineHeight: '28px',
        letterSpacing: '-0.025em'
    }),
    description: {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '20px',
        letterSpacing: '-0.025em',
        color: '#ABABAB'
    },
    root: {
        maxWidth: '950px',
        margin: '50px auto',
        gap: '50px',
        width: '100%',
        flex: 1,
        flexDirection: 'row'
    },
    projectsRoot: {
        flex: 2,
        maxWidth: '570px'
    },
    projectsList: {},
    project: {
        backgroundColor: '#f2f3f4',
        borderRadius: '12px',
        padding: '20px',
        height: '100%',
        cursor: 'pointer',
        border: '2px solid #f2f3f4',
        '&.play': {
            borderColor: '#48C64B'
        },
        '&:hover': {
            backgroundColor: '#efeff0'
        }
    },
    projectName: {
        fontSize: '18px',
        fontWeight: 600,
        lineHeight: '22px',
        letterSpacing: '-0.2px',
        textAlign: 'left',
        color: '#000000',
        marginBottom: '8px',
        marginTop: 'auto'
    },
    infoPannelWrapper: {
        maxHeight: `calc(100vh - ${HEADER_HEIGHT}px - ${HEADER_MARGINS}px - 100px)`
    },
    infoPannel: {
        flex: 1,
        position: 'sticky',
        top: '50px',
        gap: '12px'
    },
    workingProgressRoot: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F7B2',
        borderRadius: '12px',
        padding: '24px',
        gap: '40px'
    },
    workingProgress: {
        gap: '4px',
        '& $description': {
            fontSize: '13px'
        }
    },
    progress: {
        fontSize: '20px',
        fontWeight: 600,
        lineHeight: '28px',
        color: '#000000'
    },

    tasksRoot: {
        flex: 1,
        height: '100px',
        backgroundColor: '#F3F4F7B2',
        borderRadius: '12px',
        padding: '20px 10px',
        '&:hover': {
            backgroundColor: '#efeff0'
        }
    },
    tasksRootText: {
        fontSize: '15px',
        fontWeight: 500,
        lineHeight: '18px',
        letterSpacing: '-0.2px',
        textAlign: 'left',
        color: '#000000',
        paddingLeft: '10px'
    },
    tasksAmount: {
        fontSize: '13px',
        fontWeight: 500,
        lineHeight: '16px',
        letterSpacing: '-0.2px',
        textAlign: 'left',
        padding: '2px 5px',
        borderRadius: '5px',
        color: '#00000099',
        background: '#E8E8EF'
    },
    tasksList: {
        gap: '10px',
        overflow: 'auto'
    },
    taskCard: {
        flexDirection: 'row',
        gap: '10px',
        alignItems: 'flex-start',
        background: '#fff',
        borderRadius: '6px',
        padding: '16px 14px 10px'
    },
    taskContent: {
        flex: 1
    },
    taskTitle: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '17px',
        textAlign: 'left',
        color: '#000000',
        marginBottom: '6px'
    },
    taskNotes: {
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '14px',
        textAlign: 'left'
    },
    taskTag: {
        width: 'fit-content',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '14px',
        letterSpacing: '-0.002em'
    },
    emptyState: {
        flexDirection: 'column',
        gap: '24px',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        minHeight: '250px',
        '& button': {
            maxWidth: '358px',
            '& svg': {
                marginRight: '4px',
                width: '17px'
            }
        }
    },
    emptyStateMessage: {
        fontSize: '20px',
        fontWeight: 500,
        lineHeight: '23px',
        textAlign: 'center',
        color: '#000000'
    }
}))
