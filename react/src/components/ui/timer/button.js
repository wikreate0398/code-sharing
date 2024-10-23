import { styled } from '@mui/styles'
import { Button } from '@mui/material'
import { flexStartProps } from '#root/src/helpers/functions.js'

const StartStopTimerButton = styled(Button)(() => ({
    '&.MuiButtonBase-root': {
        background: '#000',
        borderRadius: '8px',
        padding: '11px',
        width: '100%',
        color: '#fff',
        zIndex: 11,
        fontSize: '14px',
        lineHeight: '14px',
        fontWeight: 500,
        display: 'flex',
        gap: '10px',

        '&.stop-mode': {
            justifyContent: 'space-between'
        },

        '&:hover': {
            background: '#000'
        },

        '& .counter': {
            fontWeight: 500,
            whiteSpace: 'nowrap'
        },

        '& .stop': {
            ...flexStartProps('center'),
            gap: '10px'
        },


        '& .task-name': {
            fontSize: '11px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            maxWidth: '133px',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            borderRight: '1px solid rgba(255,255,255,.32)',
            paddingRight: '9px',

            '&:hover': {
                color: 'rgba(255,255,255,.7)'
            },
        },

        '& .square': {
            position: 'relative',
            width: '9px',
            height: '9px',
            '&:after': {
                content: '""',
                width: '100%',
                height: '100%',
                background: '#FF0000',
                zIndex: 22,
                display: 'block',
                position: 'relative',
                borderRadius: '1px'
            }
        },

        '& .counter-section': {
            '&:hover': {
                '& .square': {
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        width: '15px',
                        height: '15px',
                        background: 'rgba(255,255,255,.2)',
                        borderRadius: '1px',
                        zIndex: 1,
                        left: '-3px',
                        top: '-3px'
                    }
                }
            }
        },

        '&.sm': {
            width: 'auto',
            lineHeight: '12px',
            padding: '7px 11px',

            '& .counter': {
                fontSize: '12px',
                width: '55px',
            },
        },
    }
}))

export default StartStopTimerButton