import { useParams } from 'next/navigation'
import React, { useCallback } from 'react'
import { useCreateTaskMutation } from '@/redux/api/task.api'
import { Box, Typography } from '@mui/material'
import Icon from '@/components/ui/icon'
import EditableArea, { EditableAreaState } from '@/components/ui/editable-area'
import { withStyles } from '@mui/styles'

const styles = {
    add: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignContent: 'center',
        gap: '8px',
        marginTop: '15px',
        cursor: 'pointer'
    },

    task: {
        marginTop: '10px',
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '4px',
        boxShadow: '0px 1px 1px 0px #0000001A'
    },

    name: {}
}

const AddTask = withStyles(styles)(({ classes, id_column }) => {
    const { id_board } = useParams()
    const [createTask] = useCreateTaskMutation()

    const save = useCallback(
        (name) => {
            createTask({ name, id_column, id_board })
        },
        [id_board, id_column]
    )

    return (
        <EditableAreaState>
            {({ isEditMode, value, enableEditMode, disableEditMode }) => (
                <>
                    {!isEditMode ? (
                        <Box className={classes.add} onClick={enableEditMode}>
                            <Icon name="plus" v2 />
                            <Typography variant="small-gray" fontSize="13px">
                                Добавить задачу
                            </Typography>
                        </Box>
                    ) : (
                        <Box className={classes.task}>
                            <EditableArea
                                value={''}
                                save={save}
                                triggOnEnter
                                useSaveBtn
                                className={classes.name}
                            />
                        </Box>
                    )}
                </>
            )}
        </EditableAreaState>
    )
})

export default AddTask
