import { Box } from '@mui/material'
import { withStyles } from '@mui/styles'
import classNames from 'classnames'
import { flexCenterProps } from '@/helpers/functions'

const styles = {
    root: ({ size = 42, r = 8, bg, color = null }) => ({
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${r}px`,
        color,
        backgroundColor: bg
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
    const getFirstCharacters = (text = '') => {
        if (!text) return ''
        const result =
            text.split(' ')?.length > 1 ? text.match(/\b(\w)/g).join('') : text
        return result.slice(0, 2)
    }

    return (
        <Box
            className={classNames(className, classes.root)}
            {...flexCenterProps('center')}
            {...props}
        >
            <Box fontSize={`${nameSize}px`} className={classes.name}>
                {getFirstCharacters(name)}
            </Box>
        </Box>
    )
})

export default ProjectAvatar
