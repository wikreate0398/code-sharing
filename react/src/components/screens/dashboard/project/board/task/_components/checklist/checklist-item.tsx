import React, { memo, useCallback } from 'react'
import { useParams} from "#root/renderer/hooks";
import { useUpdateChecklistMutation } from '#root/src/redux/api/task/task.checklist.api'
import { useGetBoardParticipantsQuery } from '#root/src/redux/api/participant.api'
 import { EditableAreaState } from '#root/src/components/ui/editable-area'
import { Box } from '@mui/material'
 import classNames from 'classnames'
import useStyles from '#root/src/components/screens/dashboard/project/board/task/_components/checklist/styles'
import { CommentsListState } from '#root/src/components/screens/dashboard/project/board/task/_components/list-comments/provider'
import ListComments from '#root/src/components/screens/dashboard/project/board/task/_components/list-comments'
import type { ChecklistProps } from '#root/src/types/Checklist'
import ChecklistBody from '#root/src/components/screens/dashboard/project/board/task/_components/checklist/checklist-body'
import CommentIcon from '#root/src/components/ui/svg-icons/icons/comment-icon'
import DragIcon from '#root/src/components/ui/svg-icons/icons/drag-icon'

interface Props {
    item: ChecklistProps
    index: number
    id_group: string
    provided: mixed
}

const ChecklistItem = memo(({ item, index, id_group, provided }: Props) => {
    const { id_project } = useParams()
    const [updateChecklist] = useUpdateChecklistMutation()

    const { id_board } = useParams()
    const { data: users } = useGetBoardParticipantsQuery(id_board, {
        refetchOnMountOrArgChange: false
    })

     const handleOnSave = useCallback(
        (name) =>
            updateChecklist({
                id: item.id,
                id_group,
                id_project,
                name
            }),
        [id_project, item, index, id_group]
    )

    const classes = useStyles()

    return (
        <Box ref={provided.innerRef}
             {...provided.draggableProps}
             {...provided.dragHandleProps}>
            <EditableAreaState>
                {({ isEditMode, enableEditMode }) => (
                    <CommentsListState id_list={item.id}>
                        {({ open: isOpenCommentArea, enableCommentArea }) => (
                            <>
                                <Box
                                    className={classNames(classes.item, {
                                        editing: isEditMode
                                    })}
                                    component="div"
                                >
                                    <ChecklistBody
                                        handleOnSave={handleOnSave}
                                        id_board={id_board as string}
                                        id_group={id_group}
                                        isEditMode={isEditMode}
                                        users={users}
                                        enableEditMode={enableEditMode}
                                        item={item}
                                    />

                                    {!isEditMode && (
                                        <Box className="actions">
                                            {!isOpenCommentArea && (
                                                <CommentIcon
                                                    onClick={enableCommentArea}
                                                />
                                            )}
                                            <DragIcon />
                                        </Box>
                                    )}
                                </Box>

                                <ListComments
                                    // @ts-ignore
                                    comments={item.comments}
                                    id_group={id_group}
                                />

                                {!isOpenCommentArea && (
                                    <Box
                                        className={classNames("divider", {
                                            hideDivider: !item.comments?.length
                                        })}
                                    />
                                )}
                            </>
                        )}
                    </CommentsListState>
                )}
            </EditableAreaState>
        </Box>
    )
})

export default ChecklistItem
