import { createStyles, makeStyles } from '@mui/styles'
import { alpha } from '@mui/material'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: ({ overlay }) => ({
            width: '100%',
            background: overlay || alpha('#fff', 0.5)
        }),

        fullPageOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: '10000'
        },

        inner: {
            position: 'relative'
        }
    })
)

export default useStyles
