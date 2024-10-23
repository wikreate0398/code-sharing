import React from 'react'
import useStyles from '#root/src/components/screens/dashboard/projects/_modal/styles'
import {
    useAddColumnResponsibleGqlMutation,
    useDeleteColumnResponsibleGqlMutation
} from '#root/src/redux/api/column.api'
import { IconButton, Stack } from '@mui/material'
import Avatar from '#root/src/components/ui/avatar'
import Icon from '#root/src/components/ui/icon'
import AddParticipant from '#root/src/components/screens/dashboard/projects/_modal/participants/_components/add-participant'

const ColumnParticipants = ({ responsible, id_column }) => {
    const classes = useStyles()
    const [addColumnParticipants] = useAddColumnResponsibleGqlMutation()
    const [deleteColumnParticipants] = useDeleteColumnResponsibleGqlMutation()

    const onAddParticipant = async (id_responsible, onSuccess = () => null) => {
        addColumnParticipants({ id_column, id_responsible }).then(() => {
            onSuccess && onSuccess()
        })
    }

    const onDeleteParticipant = async (id_responsible) => {
        await deleteColumnParticipants({ id_column, id_responsible })
    }

    return (
        <>
            <Stack className={classes.columnParticipants}>
                {responsible.map((p) => {
                    const { id, name, login, avatar_url } = p
                    return (
                        <Stack
                            key={id}
                            flexDirection="row"
                            className={classes.columnParticipantItem}
                        >
                            <Avatar
                                name={name}
                                login={login}
                                pointer
                                src={avatar_url}
                                showName
                                size={22}
                                sx={{
                                    borderRadius: 7
                                }}
                            />
                            <IconButton
                                onClick={() => onDeleteParticipant(id)}
                                sx={{ marginLeft: 'auto' }}
                            >
                                <Icon
                                    name="delete-grey"
                                    width={14}
                                    height={16}
                                    pointer
                                    v2
                                />
                            </IconButton>
                        </Stack>
                    )
                })}
            </Stack>

            <AddParticipant
                handleSelect={onAddParticipant}
                id_column={id_column}
                currentAdded={responsible}
                anchor="bottom"
                size="small"
                label="Добавить"
                noBorder
                sx={{
                    background: 'white',
                    marginLeft: '50px!important',
                    marginBottom: '8px'
                }}
            />
        </>
    )
}

export default ColumnParticipants
