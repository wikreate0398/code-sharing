import { Box } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            width: '144px',
            position: 'relative',
            padding: '10px 0px',
            border: '1px solid rgba(153, 153, 153, 1)',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '500',
            display: 'inline-block',
            cursor: 'pointer',
            textAlign: 'center',
            '& input': {
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
                left: 0,
                top: 0
            }
        }
    })
)

const ChooseFileBtn = ({ handleChange }) => {
    const classList = useStyles()
    return (
        <Box className={classList.root}>
            Choose File
            <input
                type="file"
                name="files"
                accept="image/*"
                multiple
                onChange={handleChange}
            />
        </Box>
    )
}

export default ChooseFileBtn
