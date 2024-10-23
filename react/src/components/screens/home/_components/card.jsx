import { Box } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            background: '#fff',
            padding: '24px',
            borderRadius: '16px',
            position: 'relative'
        }
    })
)

const Card = ({ children, ...props }) => {
    const classList = useStyles()

    return (
        <Box className={`${classList.root} ${props.className}`}>{children}</Box>
    )
}

export default Card
