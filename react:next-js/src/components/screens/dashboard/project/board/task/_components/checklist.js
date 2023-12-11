import { Box, Button, Checkbox, Typography } from '@mui/material'
import { makeStyles, styled } from '@mui/styles'
import {
    empty,
    flexStartProps,
    preventEventByLinkClick,
    spaceBetweenProps,
    wrapLogins,
    wrapURLs
} from '@/helpers/functions'
import Icon from '@/components/ui/icon'
import { useFormikContext } from 'formik'
import EditableArea, { EditableAreaState } from '@/components/ui/editable-area'
import React, { memo, useCallback } from 'react'
import classNames from 'classnames'
import { DndContext } from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable
} from '@dnd-kit/sortable'
import {
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import ListComments from '@/components/screens/dashboard/project/board/task/_components/list-comments'
import { CommentsListState } from '@/components/screens/dashboard/project/board/task/_components/list-comments/provider'
import CommentBtn from '@/components/screens/dashboard/project/board/task/_components/comment-btn'
import {
    useCreateChecklistMutation,
    useMarkChecklistMutation,
    useMoveChecklistMutation,
    useUpdateChecklistMutation
} from '@/redux/api/task.checklist.api'
import { useParams } from 'next/navigation'
import { useGetBoardParticipantsQuery } from '@/redux/api/participant.api'

const useStyles = makeStyles(() => ({
    root: {},

    item: () => ({
        ...spaceBetweenProps(),
        gap: '15px',
        padding: '7px 45px 7px 9px',
        borderRadius: '8px',
        position: 'relative',
        backgroundColor: '#fff',

        '&.editing': {
            paddingRight: '9px'
        },

        '& .name': {
            lineHeight: '17px',
            fontSize: '13px',
            width: '100%',
            wordWrap: 'break-word',

            '&.checked': {
                color: '#868B9F'
            },

            '&.lineThrough': {
                color: '#868B9F',
                textDecoration: 'line-through'
            }
        },

        '& .actions': {
            ...flexStartProps('center'),
            gap: '8px',
            position: 'absolute',
            top: 0,
            bottom: 0,
            margin: 'auto',
            right: '10px',
            opacity: 0
        },

        '& .checkbox': {
            marginTop: '2.5px'
        },

        '&:hover': {
            backgroundColor: '#F4F5F7',
            cursor: 'pointer',
            '& .actions': {
                opacity: 1
            }
        }
    })
}))

const AddBtn = styled(Button)(() => ({
    '&.MuiButtonBase-root': {
        backgroundColor: '#EDEDEE',
        color: 'rgba(0,0,0,.56)',
        fontSize: '12px',
        padding: '8px 0',
        width: '100%',
        borderRadius: '8px',
        marginTop: '15px'
    }
}))

const Checklist = memo(({ list, id_task }) => {
    const [moveChecklist] = useMoveChecklistMutation()

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            scrollBehavior: 'Cypress' in window ? 'auto' : undefined,
            sortableKeyboardCoordinates
        })
    )

    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Typography variant="subtitle-16" component="p" mb="10px">
                Чеклист
            </Typography>

            <Box>
                <DndContext
                    sensors={sensors}
                    onDragEnd={({ active, over }) => {
                        if (over && active.id !== over?.id) {
                            const activeIndex = list.findIndex(
                                ({ id }) => id === active.id
                            )
                            const overIndex = list.findIndex(
                                ({ id }) => id === over.id
                            )

                            moveChecklist({
                                id_task,
                                from: list[activeIndex].id,
                                to: list[overIndex].id
                            })
                        }
                    }}
                >
                    <SortableContext items={list}>
                        {list.map((v, k) => (
                            <ChecklistItem key={v.id} index={k} item={v} />
                        ))}
                    </SortableContext>
                </DndContext>
            </Box>

            <AddItem />
        </Box>
    )
})

const AddItem = () => {
    const { id_project, id_board } = useParams()
    const [createChecklist] = useCreateChecklistMutation()
    const { values } = useFormikContext()
    const { data: users } = useGetBoardParticipantsQuery(id_board, {
        refetchOnMountOrArgChange: false
    })

    return (
        <EditableAreaState>
            {({ isEditMode, enableEditMode, disableEditMode }) => (
                <>
                    {isEditMode && (
                        <EditableArea
                            value=""
                            save={(name) => {
                                if (!name) {
                                    disableEditMode()
                                    return
                                }
                                return createChecklist({
                                    id_project,
                                    id_task: values.id,
                                    name,
                                    state: 1
                                })
                            }}
                            triggOnEnter
                            hasMention
                            users={users}
                            useSaveBtn
                        />
                    )}

                    {!isEditMode && (
                        <AddBtn onClick={enableEditMode}>+ Добавить</AddBtn>
                    )}
                </>
            )}
        </EditableAreaState>
    )
}

const nextState = (state) => {
    const states = [1, 2, 3]
    const index = states.findIndex((v) => v === parseInt(state))

    if (states[index + 1] !== undefined) return states[index + 1]
    return states[0]
}

const ChecklistItem = memo(({ item, index }) => {
    const { id_project } = useParams()
    const [updateChecklist] = useUpdateChecklistMutation()

    const { id_board } = useParams()
    const { data: users } = useGetBoardParticipantsQuery(id_board, {
        refetchOnMountOrArgChange: false
    })

    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: item.id
    })

    const handleOnSave = useCallback(
        (name) => updateChecklist({ id: item.id, id_project, name }),
        [id_project, item, index]
    )

    const classes = useStyles()

    return (
        <EditableAreaState>
            {({ isEditMode, enableEditMode }) => (
                <Box
                    ref={setNodeRef}
                    style={{
                        transition,
                        transform: CSS.Translate.toString(transform),
                        zIndex: isDragging ? 999 : 'unset',
                        position: 'relative'
                    }}
                >
                    <CommentsListState id_list={item.id}>
                        {({ open: isOpenCommentArea, enableCommentArea }) => (
                            <>
                                <Box
                                    className={classNames(classes.item, {
                                        editing: isEditMode
                                    })}
                                >
                                    <ChecklistBody
                                        handleOnSave={handleOnSave}
                                        id_board={id_board}
                                        isEditMode={isEditMode}
                                        users={users}
                                        enableEditMode={enableEditMode}
                                        item={item}
                                    />

                                    {!isEditMode && (
                                        <Box className="actions">
                                            {!isOpenCommentArea &&
                                                empty(item.comments) && (
                                                    <CommentBtn
                                                        onClick={
                                                            enableCommentArea
                                                        }
                                                    />
                                                )}
                                            <Icon
                                                ref={setActivatorNodeRef}
                                                {...listeners}
                                                {...attributes}
                                                name="handle"
                                                width={13}
                                                height={13}
                                                pointer
                                                v2
                                            />
                                        </Box>
                                    )}
                                </Box>

                                {!isDragging && (
                                    <ListComments comments={item.comments} />
                                )}
                            </>
                        )}
                    </CommentsListState>
                </Box>
            )}
        </EditableAreaState>
    )
})

const ChecklistBody = memo(
    ({ item, id_board, users, handleOnSave, isEditMode, enableEditMode }) => {
        const [markChecklist] = useMarkChecklistMutation()

        return (
            <Box {...flexStartProps('start')} width="100%" gap="10px">
                <Checkbox
                    disableRipple
                    className="checkbox"
                    onChange={() => {
                        markChecklist({
                            id: item.id,
                            id_board,
                            state: nextState(item.state)
                        })
                    }}
                    checked={[2, 3].includes(parseInt(item.state))}
                    icon={<Icon name="unchecked" width={14} height={14} />}
                    checkedIcon={<Icon name="checked" width={14} height={14} />}
                    size="small"
                />

                {isEditMode ? (
                    <EditableArea
                        className="name"
                        value={item.name}
                        save={handleOnSave}
                        triggOnEnter
                        hasMention
                        users={users}
                        useSaveBtn
                    />
                ) : (
                    <Box
                        className={classNames('name', {
                            checked: parseInt(item.state) === 2,
                            lineThrough: parseInt(item.state) === 3
                        })}
                        onClick={(e) =>
                            preventEventByLinkClick(e, enableEditMode)
                        }
                        dangerouslySetInnerHTML={{
                            __html: wrapLogins(wrapURLs(item.name), users)
                        }}
                    />
                )}
            </Box>
        )
    }
)

export default Checklist
