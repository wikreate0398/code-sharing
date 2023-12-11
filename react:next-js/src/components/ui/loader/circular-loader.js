import Box from '@mui/material/Box'
import CircularProgress, {
    circularProgressClasses
} from '@mui/material/CircularProgress'
import { flexCenterProps } from '@/helpers/functions'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
    container: ({ height, overlay, bg }) => ({
        ...flexCenterProps('center'),
        height: overlay ? '100%' : `${height}px`,
        ...(overlay
            ? {
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  width: '100%',
                  backgroundColor: bg,
                  zIndex: 10
              }
            : {})
    })
}))

export default function CircularLoader({
    size = 40,
    boxHeight,
    overlay = false
}) {
    const classes = useStyles({ height: boxHeight, overlay })
    if (boxHeight) {
        return (
            <Box className={classes.container}>
                <Loader size={size} />
            </Box>
        )
    }
    return <Loader size={size} />
}

const Loader = ({ size, ...props }) => {
    return (
        <Box sx={{ position: 'relative' }}>
            <CircularProgress
                variant="determinate"
                sx={{
                    color: (theme) =>
                        theme.palette.grey[
                            theme.palette.mode === 'light' ? 200 : 800
                        ]
                }}
                size={size}
                thickness={4}
                {...props}
                value={100}
            />
            <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={{
                    color: '#4281db',
                    animationDuration: '550ms',
                    position: 'absolute',
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round'
                    }
                }}
                size={size}
                thickness={4}
                {...props}
            />
        </Box>
    )
}
