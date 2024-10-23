import { Box } from '@mui/material'
import Avatar from '#root/src/components/ui/avatar'
import { Avatar as MuiAvatar, Badge } from '@mui/material'
import Icon from '#root/src/components/ui/icon'
import { flexStartProps } from '#root/src/helpers/functions'
import { styled, withStyles } from '@mui/styles'
import { useState } from 'react'
import ParticipantsModal from '#root/src/components/screens/dashboard/project/board/task/_components/participants/participants-modal'
import AvatarGroup from '#root/src/components/ui/avatar-group'

const styles = {}

const NewAvatarIcon = styled(MuiAvatar)(() => ({
    '&.MuiAvatar-root': {
        bgcolor: '#fff',
        border: '1px dashed #CACCD4 !important',
        width: `34px`,
        height: `34px`,
        marginLeft: '-8px',
        cursor: 'pointer',
        zIndex: 1,
        '& img': {
            width: '16px',
            height: 'auto'
        }
    }
}))

const AddParticipant = () => {
    const [open, setOpen] = useState(false)

    return (
        <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={<Icon name="add-ellipse" width={14} height={14} />}
        >
            <NewAvatarIcon src="/img/usr.svg" onClick={() => setOpen(true)} />
            {open && <ParticipantsModal handleClose={() => setOpen(false)} />}
        </Badge>
    )
}

const Participants = withStyles(styles)(({ data }) => {
    return (
        <Box {...flexStartProps('center')}>
            <AvatarGroup sx={{ zIndex: 2 }} size={34}>
                {data.map(({ id, name }) => (
                    <Avatar key={id} size={34} pointer name={name} />
                ))}
            </AvatarGroup>
            <AddParticipant />
        </Box>
    )
})

export default Participants
