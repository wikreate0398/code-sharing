import React, { useCallback } from 'react'
import { Stack } from '@mui/material'
import useStyles from '#root/src/components/screens/dashboard/projects/_modal/styles'
import AddParticipant from '#root/src/components/screens/dashboard/projects/_modal/participants/_components/add-participant'
import ParticipantsList from '#root/src/components/screens/dashboard/projects/_modal/participants/_components/participants-list'
import ParticipantInfo from '#root/src/components/screens/dashboard/projects/_modal/participants/_components/participant-info'
import {
    useAddProjectParticipantMutation,
    useGetProjectParticipantsQuery
} from '#root/src/redux/api/participant.api'
import { useAddEditProjectContext } from '#root/src/components/screens/dashboard/projects/_modal/context'

const Participants = ({ children: header }) => {
    const classes = useStyles()
    const [addParticipantReq] = useAddProjectParticipantMutation()

    const { id_project, setSelectedParticipantId } = useAddEditProjectContext()
    const { data = [] } = useGetProjectParticipantsQuery(id_project, {
        refetchOnMountOrArgChange: true
    })

    const onSelect = useCallback(
        (id_participant, onSuccess = () => null) => {
            addParticipantReq({ id_project, id_participant }).then(() => {
                setSelectedParticipantId(null)
                onSuccess && onSuccess()
            })
        },
        [addParticipantReq, id_project, setSelectedParticipantId]
    )

    return (
        <Stack flexDirection="row" className={classes.largeModal}>
            <Stack className={classes.modalLeftPanel}>
                {header}
                <AddParticipant
                    id_project={id_project}
                    handleSelect={onSelect}
                    currentAdded={data}
                />
                <ParticipantsList />
            </Stack>
            <Stack className={classes.modalRightPanel}>
                <ParticipantInfo />
            </Stack>
        </Stack>
    )
}

export default Participants
