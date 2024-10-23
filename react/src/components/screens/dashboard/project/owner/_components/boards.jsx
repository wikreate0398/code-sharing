import { Box, Typography, Alert } from '@mui/material'
import Icon from '#root/src/components/ui/icon'
import { declination, empty, spaceBetweenProps } from '#root/src/helpers/functions'
import { withStyles } from '@mui/styles'
import { useRouter } from "#root/renderer/hooks"
import { useCallback, useState } from 'react'
import AddEditModal from '#root/src/components/screens/dashboard/project/board/_components/add-edit-modal'
import PlusBtn from '#root/src/components/ui/plus-btn'
import Avatar from '#root/src/components/ui/avatar'
import { boardRoute } from '#root/src/config/routes'
import Loader from '#root/src/components/ui/loader'
import AvatarGroup from '#root/src/components/ui/avatar-group'

const styles = {
    root: {},

    'card-inner': {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px'
    },

    card: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '8px',
        backgroundColor: '#F4F5F7',
        padding: '20px',

        '& .name': {
            marginBottom: '30px',
            fontSize: '18px',
            cursor: 'pointer'
        }
    }
}

const Boards = withStyles(styles)(({ classes, boards, isLoading }) => {
    const [open, setOpen] = useState(false)
    const handler = useCallback(() => setOpen(!open), [open])

    if (isLoading) return <Loader />

    return (
        <Box>
            <Box {...spaceBetweenProps()} mb="15px">
                <Typography variant="subtitle-15">Boards</Typography>
                <PlusBtn onClick={handler} />
                <AddEditModal open={open} handler={handler} />
            </Box>
            {!empty(boards) ? (
                <Box className={classes['card-inner']}>
                    {boards.map((board) => (
                        <BoardCard key={board.id} board={board} />
                    ))}
                </Box>
            ) : (
                <Alert severity="info">Нет досок</Alert>
            )}
        </Box>
    )
})

const BoardCard = withStyles(styles)(({ classes, board }) => {
    const [open, setOpen] = useState(false)
    const handler = useCallback(() => setOpen(!open), [open])

    const { push } = useRouter()
    const { id, id_project, name, participants } = board

    return (
        <Box className={classes.card}>
            <Typography
                variant="subtitle-18"
                component="h4"
                className="name"
                onClick={() => push(boardRoute(id_project, id))}
            >
                {name}
            </Typography>

            <Box>
                {!empty(participants) && (
                    <Typography variant="small-gray">
                        {participants.length} &nbsp;
                        {declination(
                            participants.length,
                            'member',
                            'members',
                            'members'
                        )}
                    </Typography>
                )}
                <Box {...spaceBetweenProps()} mt="10px">
                    <AvatarGroup max={3} className="avatars" size={24}>
                        {participants.map(({ id, name }) => (
                            <Avatar key={id} pointer name={name} />
                        ))}
                    </AvatarGroup>
                    <Icon pointer name="pencil" onClick={handler} v2 />
                    <AddEditModal open={open} item={board} handler={handler} />
                </Box>
            </Box>
        </Box>
    )
})

export default Boards
