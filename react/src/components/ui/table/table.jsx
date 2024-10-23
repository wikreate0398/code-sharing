import { Box } from '@mui/material'
import classNames from 'classnames'
import useStyles from '#root/src/components/ui/table/styles'

const Table = ({
    version = 1,
    children,
    responsive = true,
    maxHeight,
    height = false,
    overflowY,
    xs = false,
    className = '',
    tableLayout = 'auto',
    ...props
}) => {
    const classes = useStyles({ version })

    const classesList = classNames({
        [className]: className !== '',
        ['invisible_scroll']: true
    })

    const styles = {
        overflowY: overflowY || overflowY === true ? 'scroll' : false,
        height: height ?? 'auto'
    }

    return (
        <Box
            className={classesList}
            maxHeight={maxHeight}
            style={styles}
            {...props}
        >
            <Box
                component="table"
                className={classes.table}
                tablelayout={tableLayout}
            >
                {children}
            </Box>
        </Box>
    )
}

export default Table
