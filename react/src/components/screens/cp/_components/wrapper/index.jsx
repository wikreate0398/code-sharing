import { Box } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'
import Aside from '../aside'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'grid',
            gridTemplateColumns: '250px 1fr',
            gap: '28px',
            padding: '20px',
            background: '#fff',
            minHeight: 'calc(100vh - 40px)'
        },
        content: {
            margin: '27px 0',
            height: 'calc(100vh - 40px - 54px)',
            overflowY: 'auto'
        }
    })
)

const Wrapper = ({ children }) => {
    const classList = useStyles()

    return (
        <Box className={classList.root}>
            <Aside />
            <Box className={classList.content}>{children}</Box>
        </Box>
    )
}

export default Wrapper
