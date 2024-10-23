import React, { memo } from 'react'
import { Box, Typography } from '@mui/material'
import Icon from '#root/src/components/ui/icon'
import EditableArea, { EditableAreaState } from '#root/src/components/ui/editable-area'
import { withStyles } from '@mui/styles'
import { ClassNameMap } from '@mui/styles/withStyles/withStyles'
import { useCreateTask } from '#root/src/components/screens/dashboard/project/board/kanban/hooks'

const styles = {
    add: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignContent: 'center',
        gap: '8px',
        marginTop: '5px',
        cursor: 'pointer'
    },

    task: {
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '4px',
        boxShadow: '0px 1px 1px 0px #0000001A'
    },

    name: {}
}

interface Props {
    id_column: number
    classes: ClassNameMap
    createTaskMode?: boolean
    toggleCreateTask?: () => void
}

const AddTask = withStyles(styles)(memo(({ classes, id_column, createTaskMode, toggleCreateTask }: Props) => {
    const { onCreate } = useCreateTask(id_column)

    return (
        <EditableAreaState value={createTaskMode} toggleState={toggleCreateTask}>
            {({ isEditMode, enableEditMode }) => (
                <>
                    {!isEditMode ? (
                        <Box
                            className={classes.add}
                            onClick={enableEditMode}
                            data-no-dnd="true"
                        >
                            <Icon name="plus" v2 />
                            <Typography variant="small-gray" fontSize="13px">
                                Добавить задачу
                            </Typography>
                        </Box>
                    ) : (
                        <Box className={classes.task} data-no-dnd="true">
                            <EditableArea
                                value={''}
                                save={onCreate}
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
}, (prev, next) => {
    return prev.id_column === next.id_column
}))

export default AddTask
