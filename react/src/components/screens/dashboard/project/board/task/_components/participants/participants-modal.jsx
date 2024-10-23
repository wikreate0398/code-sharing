import Avatar from '#root/src/components/ui/avatar'
import { useParams} from "#root/renderer/hooks";
import { useGetBoardParticipantsQuery } from '#root/src/redux/api/participant.api'
import {
    Typography,
    Box,
    ListItem,
    List,
    ListItemButton,
    DialogTitle,
    Dialog as MuiDialog
} from '@mui/material'
import { makeStyles, styled } from '@mui/styles'
import { useCallback, useEffect, useState } from 'react'
import { useFormikContext } from 'formik'

const useStyles = makeStyles(() => ({
    root: {}
}))

const SaveBtn = styled(ListItemButton)(() => ({
    '&.MuiListItemButton-root': {
        justifyContent: 'center',
        color: '#fff',
        backgroundColor: '#4281DB',

        '&:hover': {
            backgroundColor: '#4281DB !important'
        }
    }
}))

const Dialog = styled(MuiDialog)(() => ({
    '& .MuiPaper-root': {
        width: '200px'
    }
}))

const ParticipantsModal = ({ handleClose }) => {
    const classes = useStyles()

    const { values, setFieldValue, submitForm } = useFormikContext()
    const [selected, setSelected] = useState([])

    useEffect(() => {
        setSelected(values.participants)
    }, [values.participants])

    const { data, isLoading } = useGetBoardParticipantsQuery(
        useParams().id_board,
        {
            refetchOnMountOrArgChange: true
        }
    )

    const handleSelect = useCallback(
        (id) => {
            setSelected((selected) => {
                if (selected.includes(id)) {
                    return selected.filter((v) => v !== id)
                } else {
                    return [...selected, id]
                }
            })
        },
        [selected]
    )

    const handleSave = useCallback(() => {
        setFieldValue('participants', selected)
        submitForm()
        handleClose()
    }, [selected, setFieldValue, submitForm, handleClose])

    return (
        <Dialog
            onClose={handleClose}
            open={!isLoading}
            className={classes.root}
        >
            <DialogTitle sx={{ textAlign: 'center' }}>Участники</DialogTitle>
            <List sx={{ pt: 0 }}>
                {data?.map(({ login, name, id }) => (
                    <ListItem disableGutters key={id}>
                        <ListItemButton
                            onClick={() => handleSelect(id)}
                            sx={{ gap: '10px' }}
                            selected={selected.includes(id)}
                        >
                            <Avatar name={name} />
                            <Box>
                                <Typography component="p" mb="3px">
                                    {name}
                                </Typography>
                                <Typography variant="small-gray">
                                    @{login}
                                </Typography>
                            </Box>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <SaveBtn className={classes.save} onClick={handleSave}>
                Сохранить
            </SaveBtn>
        </Dialog>
    )
}

export default ParticipantsModal
