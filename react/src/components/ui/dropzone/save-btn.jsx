import { Box } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            width: '144px',
            padding: '10px 0px',
            border: '1px solid #3B70CA',
            borderRadius: '6px',
            backgroundColor: '#3B70CA',
            color: '#fff',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transitionDuration: '0.2s',
            textAlign: 'center',
            '&:hover': {
                backgroundColor: '#305ca5',
                transitionDuration: '0.2s'
            }
        }
    })
)

const SaveBtn = ({ handleClick, ...props }) => {
    const classList = useStyles()
    return (
        <Box value="Save" className={classList.root} {...props}>
            Save
        </Box>
    )
}

export default SaveBtn
