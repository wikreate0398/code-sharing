import { makeStyles } from '@mui/styles'
import { flexStartProps } from '@/helpers/functions'
import { Box } from '@mui/material'
import classNames from 'classnames'

const useStyles = makeStyles(() => ({
    root: {
        borderBottom: '1px solid #E8EBED',
        ...flexStartProps('center'),

        '& .item': {
            textDecoration: 'none',
            padding: '16px 10px',
            color: '#98A2A7',
            fontSize: ({ fontSize }) => `${fontSize}px`,
            cursor: 'pointer',

            '&.active': {
                color: '#000',
                position: 'relative',
                '&:after': {
                    content: '""',
                    bottom: '-1px',
                    left: 0,
                    position: 'absolute',
                    height: '2px',
                    width: '100%',
                    borderRadius: '8px',
                    backgroundColor: '#000'
                }
            }
        }
    }
}))

export const Tabs = ({ children, fontSize = 12, ...props }) => {
    const classes = useStyles({ fontSize })
    return (
        <Box className={classes.root} {...props}>
            {children}
        </Box>
    )
}

export const TabItem = ({ children, active, ...props }) => {
    return (
        <Box className={classNames('item', { active })} {...props}>
            {children}
        </Box>
    )
}
