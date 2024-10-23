import { createStyles, makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            '& .MuiFormLabel-root': {
                top: '6px'
            }
        },
        title: {
            fontSize: '14px',
            lineHeight: '16px',
            color: '#000000',
            marginBottom: '6px'
        }
    })
)

export default useStyles
