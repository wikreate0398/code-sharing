import { createStyles, makeStyles } from '@mui/styles'
import { flexStartProps } from '#root/src/helpers/functions'

const useStyles = makeStyles((theme) =>
    createStyles({
        link: {
            ...flexStartProps('center'),
            background: '#000',
            color: '#fff',
            gap: '4px',
            padding: '10px 28px',
            textDecoration: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
        }
    })
)

export default useStyles
