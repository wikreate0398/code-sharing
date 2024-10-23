import { makeStyles } from '@mui/styles'
import { flexStartProps } from '../../../helpers/functions'

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

export default useStyles
