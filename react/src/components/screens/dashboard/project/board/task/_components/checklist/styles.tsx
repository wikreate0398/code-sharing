import { makeStyles } from '@mui/styles'
import { flexStartProps, spaceBetweenProps } from '#root/src/helpers/functions'
import { Theme } from '@mui/system'

export default makeStyles((theme: Theme) => ({
    root: {
        marginBottom: '32px'
    },

    item: () => ({
        ...spaceBetweenProps(),
        gap: '15px',
        borderRadius: '8px',
        position: 'relative',
        backgroundColor: '#fff',

        border: '1px solid transparent',

        '&.editing': {
            //paddingRight: '9px'
        },

        '& .name': {
            lineHeight: '17px',
            fontSize: '13px',
            width: '100%',
            wordWrap: 'break-word',
            color: '#191919',

            '&.checked': {
                color: '#868B9F'
            },

            '&.lineThrough': {
                color: '#868B9F',
                textDecoration: 'line-through'
            }
        },

        '& .actions': {
            ...flexStartProps('center'),
            gap: '8px',
            position: 'absolute',
            top: 0,
            bottom: 0,
            margin: 'auto',
            right: '10px',
            opacity: 0,
            cursor: 'pointer',
            '& svg:hover': {
                '& circle, & path': {
                    fill: theme.palette.neutral[800]
                }
            }
        },

        '& ~ .divider': {
            width: 'calc(100% - 37px)',
            borderBottom: '0.5px solid #E8E9EEED',
            marginLeft: 37
        },

        '&:hover': {
            // backgroundColor: '#F4F5F7',
            // border: '1px solid rgba(66, 96, 242, 1)',
            // boxShadow: '0px 0px 0px 3px rgba(232, 240, 254, 1)',
            cursor: 'pointer',
            zIndex: 1,
            '& .actions': {
                opacity: 1
            },
            // '& .checkbox': {
            //     boxShadow: '0px 1px 3px 0px #0000001A'
            // },

            boxShadow: '0px 1px 3px 0px #0000001A',

            '& ~ .hideDivider': {
                opacity: 0
            }
        }
    }),

    addCheckbox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '12px',
        gap: '10px',
        border: `1px solid #E8E9EEED`,
        borderRadius: 10,
        '& p': {
            color: '#9499A4'
        }
    },

    addCheckboxInput: {
        '& textarea': {
            flex: 1,
            padding: 0
        },
        '&.editingRoot': {
            border: '1px solid #4260F2',
            boxShadow: '0px 0px 0px 3px #E8F0FE',

            '& .editing': {
                border: '1px solid transparent',
                boxShadow: 'none'
            }
        }
    },

    disabledCheckbox: {
        width: 16,
        height: 16,
        borderRadius: 4,
        backgroundColor: '#E8E9EEED',
        alignSelf: 'flex-start',
        cursor: 'default'
    },

    checklist_body: {

        // alignItems: 'center',
        padding: '13px 45px 13px 12px',
        border: `1px solid transparent`,
        borderRadius: 10,
        transition: '0.1s',

        '& .checkbox': {
            position: 'relative',
            top: '1px',
        },

    }
}))
