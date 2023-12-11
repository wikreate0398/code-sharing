import { Avatar as MuiAvatar, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import { flexStartProps } from '@/helpers/functions'
import { makeStyles } from '@mui/styles'

function stringToColor(string) {
    let hash = 0
    let i

    for (i = 0; i < string?.length; i += 1) {
        hash = string?.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'
    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff
        color += `00${value.toString(16)}`.slice(-2)
    }

    return color
}

function stringAvatar({ name, color, bg, value, size, fz, pointer }) {
    return {
        sx: {
            bgcolor: bg || stringToColor(name),
            color,
            width: `${size}px`,
            height: `${size}px`,
            cursor: pointer ? 'pointer' : 'default',
            fontSize: `${fz}px`
        },
        children: value || `${name?.charAt(0).toUpperCase()}`
    }
}

const count = (size) => {
    if (size <= 40) {
        return {
            minWidth: '8px',
            height: '8px',
            bottom: '14%',
            right: '14%'
        }
    }

    const dim = ((size - 40) / 100) * 8 + 8

    const pos = 14 - ((size - 40) / 100) * 14

    return {
        minWidth: `${dim}px`,
        height: `${dim}px`,
        bottom: `${pos}%`,
        right: `${pos}%`
    }
}

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        borderRadius: '50%',
        // minWidth: '8px',
        // height: '8px',
        // bottom: '14%',
        // right: '14%',

        '&::after': {
            position: 'absolute',
            top: '-1px',
            left: '-1px',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.5s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""'
        }
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1
        },
        '100%': {
            transform: 'scale(2)',
            opacity: 0
        }
    }
}))

const useStyles = makeStyles(() => ({
    avatar: ({ borderRadius = 8, ...sx }) => ({
        borderRadius,
        ...sx
    })
}))

const Avatar = ({
    name = '',
    value = null,
    showName = false,
    color = null,
    bg = null,
    nameSize = 13,
    src = null,
    size = 24,
    fz = 11,
    pointer = false,
    online = false,
    sx,
    ...props
}) => {
    const classes = useStyles(sx)

    const inner = () => {
        const strAvatarProps = stringAvatar({
            name,
            value,
            color,
            bg,
            size,
            fz,
            pointer
        })

        return (
            <>
                <MuiAvatar
                    {...props}
                    src={src}
                    {...strAvatarProps}
                    classes={{
                        root: classes.avatar
                    }}
                />
                {showName && name && (
                    <Box fontSize={`${nameSize}px`}>{name}</Box>
                )}
            </>
        )
    }

    return (
        <BangeWrapp size={size} online={online}>
            {showName ? (
                <Box {...flexStartProps('center')} gap="8px">
                    {inner()}
                </Box>
            ) : (
                inner()
            )}
        </BangeWrapp>
    )
}

const BangeWrapp = ({ children, online, size }) => {
    if (!online) return children
    return (
        <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            invisible={!online}
            size={size}
            sx={{
                '& .MuiBadge-badge': {
                    ...count(size)
                }
            }}
        >
            {children}
        </StyledBadge>
    )
}

export default Avatar
