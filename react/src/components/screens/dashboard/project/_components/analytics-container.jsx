import { Box } from '@mui/material'
import { spaceBetweenProps } from '#root/src/helpers/functions'
import { withStyles } from '@mui/styles'

const styles = {
    root: {
        margin: '25px 0',
        ...spaceBetweenProps(),
        paddingBottom: '25px',
        borderBottom: '1px solid #0000001a'
    }
}

const AnalyticsContainer = withStyles(styles)(({ classes, children }) => {
    return <Box className={classes.root}>{children}</Box>
})

export default AnalyticsContainer
