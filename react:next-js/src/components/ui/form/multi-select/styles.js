import { createStyles, makeStyles } from '@mui/styles'
import { flexStartProps } from '@/helpers/functions'

const useStyles = makeStyles((theme) =>
    createStyles({
        wrapper: {
            ...flexStartProps('flex-start'),
            flexWrap: 'wrap',
            border: '1px solid #D6D9E0',
            borderRadius: '12px',
            minHeight: '50px',
            background: '#fff',
            padding: ({ hasSelected }) => (hasSelected ? '9px' : 'unset'),
            gap: '9px'
        },
        input: {
            width: ({ hasSelected }) => (hasSelected ? 'auto' : '100%'),
            minWidth: 'auto',

            '& input': {
                padding: ({ hasSelected }) =>
                    hasSelected ? '4px 0 !important' : '15px 20px !important'
            },

            '& fieldset': {
                border: 'none',
                minWidth: '30px'
            }
        },
        formGroup: {
            position: 'relative',
            zIndex: 2,
            borderRadius: '8px'
        },
        dropdown: {
            position: 'absolute',
            top: 'calc(100% - 10px)',
            padding: '24px 20px 20px 20px',
            left: 0,
            width: '100%',
            overflow: 'auto',
            zIndex: 1,
            boxShadow: 'none !important',
            border: '1px solid #D6D9E0',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px !important'
        },
        selectedItem: {
            background: '#4E22FF !important',
            padding: '9px 10px !important',
            borderRadius: '8px !important',
            cursor: 'pointer',
            transition: '150ms',

            '&:hover': {
                opacity: '.8'
            },

            '& > span': {
                color: '#fff',
                fontSize: '16px',
                lineHeight: '16px',
                fontWeight: 400,
                padding: '5px 0',
                marginRight: '6px'
            },

            '& img': {
                margin: '0 !important'
            }
        },
        dropdownWrapper: {
            ...flexStartProps('flex-start'),
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '15px',

            '& span': {
                marginRight: 0
            }
        },
        dropdownLabel: {
            color: '###',
            opacity: '56%',
            lineHeight: '16px'
        },
        dropdownCreate: {
            ...flexStartProps('center'),
            marginTop: '10px',
            gap: '6px',

            '& .MuiChip-root': {
                background: '#4E22FF1A !important'
            },

            '& span': {
                marginRight: 0,
                color: '#4E22FF'
            }
        }
    })
)

export default useStyles
