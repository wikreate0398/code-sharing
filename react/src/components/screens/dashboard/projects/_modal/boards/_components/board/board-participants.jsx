import React from 'react'
import useStyles from '#root/src/components/screens/dashboard/projects/_modal/styles'
import { useAddEditProjectContext } from '#root/src/components/screens/dashboard/projects/_modal/context'
import {
    useAddBoardParticipantGqlMutation,
    useDeleteBoardParticipantGqlMutation
} from '#root/src/redux/api/board.api'
import FormGroup from '#root/src/components/screens/dashboard/projects/_modal/_components/form-group'
import { Stack, Typography } from '@mui/material'
import Icon from '#root/src/components/ui/icon'
import ParticipantItem from '#root/src/components/screens/dashboard/projects/_modal/participants/_components/participant-item'
import AddParticipant from '#root/src/components/screens/dashboard/projects/_modal/participants/_components/add-participant'

const BoardParticipants = ({ id_board, isPrivate, participants }) => {
    const classes = useStyles()
    const { id_project } = useAddEditProjectContext()

    const [deleteBoardParticipant] = useDeleteBoardParticipantGqlMutation()

    const handleDeleteBoardParticipant = async (id_participant) => {
        await deleteBoardParticipant({
            id_board,
            id_participant,
            id_project
        })
    }

    if (!isPrivate)
        return (
            <FormGroup>
                <Stack className={classes.participantNote}>
                    <Icon name="info_blue" size="14,14" pointer />
                    <Typography
                        variant="subtitle-12"
                        sx={{ color: 'rgba(10, 42, 153, 1)' }}
                    >
                        Все участники проекта имеют доступ к просмотру задач в
                        доске
                    </Typography>
                </Stack>
            </FormGroup>
        )

    return (
        <FormGroup label="УЧАСТНИКИ">
            <Stack className={classes.boardInfoCard}>
                <AddParticipantBox participants={participants} />
                <Stack className={classes.boardInfoCardInner}>
                    {participants?.map((item) => {
                        let id = item?.id

                        return (
                            <ParticipantItem
                                key={id}
                                item={item}
                                onDelete={() =>
                                    handleDeleteBoardParticipant(id)
                                }
                            />
                        )
                    })}
                </Stack>
            </Stack>
        </FormGroup>
    )
}

const AddParticipantBox = ({ participants }) => {
    const { id_project, selectedBoardId } = useAddEditProjectContext()

    const [addBoardParticipant] = useAddBoardParticipantGqlMutation()

    const handleAddBoardParticipant = async (id_participant, onSuccess) => {
        await addBoardParticipant({
            id_board: selectedBoardId,
            id_participant,
            id_project
        }).then(() => {
            onSuccess && onSuccess()
        })
    }

    return (
        <AddParticipant
            handleSelect={handleAddBoardParticipant}
            currentAdded={participants}
            id_board={selectedBoardId}
            sx={{ margin: '0!important' }}
            noBorder={!participants?.length}
        />
    )
}

export default BoardParticipants
