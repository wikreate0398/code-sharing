import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/system'

export default makeStyles((theme: Theme) => ({
    root: {
        maxWidth: 875,
        position: 'relative'
    },

    filtersRoot: {
        width: '100%',
        gap: '14px'
    },

    filterCard: {
        cursor: 'pointer',
        alignItems: 'center',
        flexDirection: 'row',
        gap: '8px',
        border: 'none !important',
        borderRadius: 8,
        flex: 1,
        height: 40,
        padding: '0 12px',
        transition: '0.2s',
        backgroundColor: theme.palette.neutral[200],
        '& p, & .value': {
            color: '#000',
            fontSize: '13px',
            lineHeight: '16px'
        },
        '& .react-datepicker-wrapper': {
            flex: 1
        },

        '&:not(.disable):hover': {
            border: 'none !important',
            backgroundColor: theme.palette.neutral[100]
        }
    },

    menuRoot: {
        width: 300
    },

    card: {
        padding: '24px',
        borderRadius: 12,
        border: '1px solid #E8E9EEED'
    },

    cardTitle: {
        color: '#191919',
        fontSize: '18px',
        fontWeight: 600,
        lineHeight: '24px',
        letterSpacing: '-2.5%',
        whiteSpace: 'nowrap'
    },

    statsRoot: {
        padding: '12px 0',
        gap: '12px'
    },

    statsDescription: {
        color: '#9499A4',
        fontSize: '13px',
        lineHeight: '16px',
        whiteSpace: 'nowrap',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '6px',
        '& .project-color': {
            width: 6,
            height: 6,
            borderRadius: 2
        }
    }
}))
