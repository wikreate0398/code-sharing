import { AvatarGroup as MuiAvatarGroup } from '@mui/material'
import { styled } from '@mui/styles'

const CustomAvatarGroup = styled(MuiAvatarGroup)(({ size, fz }) => ({
    '& .MuiAvatar-root': {
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${fz}px`
    }
}))

const AvatarGroup = ({ children, size = 24, fz = 11, ...props }) => {
    return (
        <CustomAvatarGroup {...props} size={size} fz={11}>
            {children}
        </CustomAvatarGroup>
    )
}

export default AvatarGroup
