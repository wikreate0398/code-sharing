import { Box } from '@mui/material'
import { withStyles } from '@mui/styles'
import classNames from 'classnames'
import { flexCenterProps, getCharactersFromBegin } from '#root/src/helpers/functions'

const styles = {
    root: ({ size = 42, r = 8, bg, color = null }) => ({
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${r}px`,
        color,
        backgroundColor: bg,
        cursor: 'pointer'
    }),
    name: {
        color: '#FFFFFF',
        fontWeight: 600,
        letterSpacing: '-1px'
    }
}

const ProjectAvatar = withStyles(styles)(({
    classes,
    className,
    name,
    r,
    nameSize = 13,
    ...props
}) => {
    return (
        <Box
            className={classNames(className, classes.root)}
            {...flexCenterProps('center')}
            {...props}
        >
            <Box fontSize={`${nameSize}px`} className={classes.name}>
                {getCharactersFromBegin(name)}
            </Box>
        </Box>
    )
})

export default ProjectAvatar
