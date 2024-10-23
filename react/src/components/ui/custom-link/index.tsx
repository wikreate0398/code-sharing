import React from 'react'
import { Button, ButtonProps } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Icon from '#root/src/components/ui/icon'
import { Theme } from '@mui/system'
import CircularProgress from '@mui/material/CircularProgress'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 0,
        fontSize: 12,
        lineHeight: '16px',
        fontWeight: 500,
        width: 'fit-content',
        color: theme.palette.neutral[700],
        '&:hover': {
            color: theme.palette.neutral[800],
            background: 'transparent'
        },
        '& .MuiButton-startIcon': {
            marginRight: 6,
            marginLeft: 0
        }
    }
}))

interface Props extends ButtonProps {
    onClick: (e) => void
    label: string
    loading?: boolean
    icon?: React.ReactNode
}

const CustomLink = ({
    onClick,
    label,
    icon = <Icon pointer name="plus" size="8,8" v2 />,
    sx,
    loading,

    ...rest
}: Props) => {
    const classes = useStyles()

    return (
        <Button
            onClick={onClick}
            startIcon={
                loading ? (
                    <CircularProgress
                        variant="indeterminate"
                        size={10}
                        thickness={4}
                        value={80}
                        sx={{
                            color: '#4281db'
                        }}
                    />
                ) : (
                    icon
                )
            }
            sx={sx}
            className={classes.root}
            disabled={loading}
            {...rest}
        >
            {label}
        </Button>
    )
}

export default CustomLink
