
import { Box } from '@mui/material'
import Header from '#root/src/components/layouts/header'
import classNames from 'classnames'
import { makeStyles } from '@mui/styles'
import { HEADER_HEIGHT, HEADER_MARGINS } from '#root/src/config/const'

const useStyles = makeStyles(() => ({
    root: {
        padding: '15px',
        // backgroundColor: '#fafafa',
        minHeight: '100vh'
    },

    wrapper: {
        minHeight: `calc(100vh - ${HEADER_HEIGHT}px - ${HEADER_MARGINS}px)`,
        display: 'flex',
        flexDirection: 'column',

        '&.blur': {
            filter: 'blur(3px)'
        }
    }
}))

const DashboardLayout = ({ children }) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Header />
            <Wrapper>{children}
            </Wrapper>
        </Box>
    )
}

const Wrapper = ({ children }) => {
    const classes = useStyles()

    return <Box className={classNames(classes.wrapper)}>{children}</Box>
}

export default DashboardLayout
