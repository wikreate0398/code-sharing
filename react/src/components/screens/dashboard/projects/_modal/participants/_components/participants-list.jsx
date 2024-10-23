import React from 'react'
import useStyles from '#root/src/components/screens/dashboard/projects/_modal/styles'
import { useAddEditProjectContext } from '#root/src/components/screens/dashboard/projects/_modal/context'
import { useGetProjectParticipantsQuery } from '#root/src/redux/api/participant.api'
import { Stack } from '@mui/material'
import ContainerLoader from '#root/src/components/ui/loader/container-loader'
import ParticipantItem from '#root/src/components/screens/dashboard/projects/_modal/participants/_components/participant-item'

const ParticipantsList = () => {
    const classes = useStyles()
    const { id_project, selectedParticipantId, setSelectedParticipantId } =
        useAddEditProjectContext()

    const {
        data = []
    } = useGetProjectParticipantsQuery(id_project)

    return (
        <Stack className={classes.leftPanellist}>
            {(data || []).map((item) => {
                let id = item?.id
                return (
                    <ParticipantItem
                        key={item?.id}
                        item={item}
                        onSelect={() => setSelectedParticipantId(id)}
                        isSelected={selectedParticipantId === id}
                        sx={{ padding: '0 32px' }}
                    />
                )
            })}
        </Stack>
    )
}

export default ParticipantsList
