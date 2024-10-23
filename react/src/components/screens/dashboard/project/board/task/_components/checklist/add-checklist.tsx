//@ts-nocheck TODO: fix ts

import React from 'react'
import { useParams } from '#root/renderer/hooks'
import { useCreateChecklistMutation } from '#root/src/redux/api/task/task.checklist.api'
import { useGetBoardParticipantsQuery } from '#root/src/redux/api/participant.api'
import EditableArea, {
    EditableAreaState
} from '#root/src/components/ui/editable-area'
import classNames from 'classnames'
import { Stack, Typography } from '@mui/material'
import Icon from '#root/src/components/ui/icon'
import useStyles from '#root/src/components/screens/dashboard/project/board/task/_components/checklist/styles'
import EnterIcon from '#root/src/components/ui/svg-icons/icons/enter-icon'

const AddChecklist = ({ id_group, id_task }) => {
    const classes = useStyles()
    const { id_project, id_board } = useParams()
    const [createChecklist] = useCreateChecklistMutation()
    const { data: users } = useGetBoardParticipantsQuery(id_board, {
        refetchOnMountOrArgChange: false
    })

    return (
        <EditableAreaState>
            {({ isEditMode, enableEditMode, disableEditMode }) => {
                if (isEditMode)
                    return (
                        <EditableArea
                            disableBorderRadius
                            value=""
                            saveOnClickOutside
                            save={(name) => {
                                if (!name) {
                                    disableEditMode()
                                    return
                                }
                                return createChecklist({
                                    id_project,
                                    id_task,
                                    id_group,
                                    name,
                                    state: 1
                                })
                            }}
                            triggOnEnter
                            hasMention
                            users={users}
                            bodyClassName={classNames(
                                classes.addCheckbox,
                                classes.addCheckboxInput
                            )}
                            startIcon={
                                <div className={classes.disabledCheckbox} />
                            }
                            endIcon={<EnterIcon />}
                        />
                    )

                return (
                    <Stack
                        className={classNames(classes.addCheckbox)}
                        onClick={enableEditMode}
                        flexDirection="row"
                        alignItems="center"
                        gap="10px"
                        mt="15px"
                    >
                        <Icon pointer name="plus" size="11,11" v2 />{' '}
                        <Typography variant="subtitle-13" component="p">
                            Добавить задачу
                        </Typography>
                    </Stack>
                )
            }}
        </EditableAreaState>
    )
}

export default AddChecklist
