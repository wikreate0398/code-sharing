import { Box, Stack, Typography, IconButton } from '@mui/material'
import React, { memo, useCallback, useEffect, useState } from 'react'
import {
    useCreateChecklistGroupMutation,
    useDeleteChecklistGroupMutation,
    useMoveChecklistMutation,
    useUpdateChecklistGroupMutation
} from '#root/src/redux/api/task/task.checklist.api.js'
import CustomLink from '#root/src/components/ui/custom-link'
import ChecklistItem from '#root/src/components/screens/dashboard/project/board/task/_components/checklist/checklist-item'
import useStyles from '#root/src/components/screens/dashboard/project/board/task/_components/checklist/styles'
import AddChecklist from '#root/src/components/screens/dashboard/project/board/task/_components/checklist/add-checklist'
import DeleteIcon from '#root/src/components/ui/svg-icons/icons/delete-icon'
import EditableArea, {
    EditableAreaState
} from '#root/src/components/ui/editable-area'
import { flexStartProps, preventEventByLinkClick } from '#root/src/helpers/functions'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const Checklist = ({
    name: initialName = 'Чеклист',
    list = [],
    id_task,
    id: id_group,
    isPersistent,
    isFirst
}) => {
    const classes = useStyles()
    const [moveChecklist] = useMoveChecklistMutation()
    const [createChecklistGroup, createReqState] =
        useCreateChecklistGroupMutation()
    const [deleteChecklistGroup] = useDeleteChecklistGroupMutation()
    const [updateChecklistGroup] = useUpdateChecklistGroupMutation()
    const [name, setName] = useState(initialName)

    let isLoading = createReqState?.isLoading

    useEffect(() => {
        if (initialName) setName(initialName)
    }, [initialName])

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const source = result.source;
        const destination = result.destination;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) return;

        moveChecklist({id_task, id_group, from: list[source.index].id, to: list[destination.index].id,})
    }

    const onChangeGroupName = useCallback(
        (name) => {
            updateChecklistGroup({
                id: id_group,
                id_task,
                name
            })
        },
        [id_group, id_task]
    )

    const onCreateGroup = useCallback(() => {
        createChecklistGroup({
            id_task: Number(id_task),
            name: 'Новый список'
        })
    }, [id_task])

    const onDeleteGroup = useCallback(() => {
        deleteChecklistGroup({ id: id_group, id_task })
    }, [id_group, id_task])

    return (
        <Box className={classes.root}>
            <Stack
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                mb="12px"
            >
                <EditableAreaState>
                    {({ isEditMode, enableEditMode }) => {
                        if (isEditMode)
                            return (
                                <EditableArea
                                    value={name}
                                    triggOnEnter
                                    saveOnClickOutside
                                    save={(value) => onChangeGroupName(value)}
                                    onChange={(name) => setName(name)}
                                    width={225}
                                />
                            )

                        return (
                            <Typography
                                variant="subtitle-14"
                                component="p"
                                onClick={(e) =>
                                    preventEventByLinkClick(e, enableEditMode)
                                }
                            >
                                {name}
                            </Typography>
                        )
                    }}
                </EditableAreaState>

                <Box {...flexStartProps('center')} gap="10px">
                    {isFirst && (
                        <CustomLink
                            loading={isLoading}
                            label="Новый список"
                            onClick={onCreateGroup}
                        />
                    )}

                    {!isPersistent && (
                        <IconButton sx={{ padding: '3px' }} onClick={onDeleteGroup}>
                            <DeleteIcon />
                        </IconButton>
                    )}
                </Box>
            </Stack>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={`list-${id_group}`}>
                    {(provided) => (
                        <Box mt="5px" ref={provided.innerRef} {...provided.droppableProps}>
                            {list.map((v, k) => (
                                <Draggable draggableId={`list-${v.id}`} key={v.id} index={k}>
                                    {(itemProvided) => (
                                        <ChecklistItem
                                            provided={itemProvided}
                                            index={k}
                                            item={v}
                                            id_group={id_group}
                                        />
                                    )}
                                </Draggable>
                            ))}

                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>

            <AddChecklist id_group={id_group} id_task={id_task} />
        </Box>
    )
}

export default memo(Checklist, (p, n) =>{
    return JSON.stringify(p.list) === JSON.stringify(n.list)
        && p.isPersistent === n.isPersistent
        && p.isFirst === n.isFirst
        && p.id === n.id
        && p.name === n.name
})
