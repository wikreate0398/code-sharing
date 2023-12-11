import { createStyles, makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            '& .MuiFormLabel-root': {
                top: '6px'
            }
        }
    })
)

export default useStyles
