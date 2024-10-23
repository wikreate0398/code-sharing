import {useParams, useSearchParams} from "#root/renderer/hooks";
import React, { useCallback, useEffect, useState } from 'react'
import {useCreateTaskCommentMutation} from "#root/src/redux/api/task/task.comment.api";
import {useGetBoardParticipantsQuery} from "#root/src/redux/api/participant.api";
import {Box} from "@mui/material";
import Icon from "#root/src/components/ui/icon";
import {makeStyles} from "@mui/styles";
import { flexStartProps, isFnc, spaceBetweenProps } from '#root/src/helpers/functions'
import SendIcon from "#root/src/components/ui/svg-icons/icons/SendIcon";
import EditableArea, { EditableAreaState } from '#root/src/components/ui/editable-area/index.jsx'

const useCommentAreaStyles = makeStyles(() => ({
    root: {
        ...spaceBetweenProps(),
        maxWidth: '100%',
        position: 'relative',
        '& .adornment': {
            position: 'absolute',
            right: '15px',
            bottom: '17px',
            ...flexStartProps('center'),
            gap: '12px'
        },

        '& .textarea': {
            width: '100%',
            borderRadius: '8px',
            border: '1px solid #DDDEE4',
            padding: '11px 14px',
            paddingRight: 65,
            resize: 'none',
            fontSize: '13px',
            transition: '0.1s',

            '&:focus': {
                borderColor: '#4260F2'
            }
        }
    },
}))

const NewCommentArea = ({id_parent = null, id_list, disableCommentArea, ...props}) => {
    const { id_board, id_project } = useParams()
    const classes = useCommentAreaStyles()
    const query = useSearchParams()

    const [createTaskComment] = useCreateTaskCommentMutation()
    const { data } = useGetBoardParticipantsQuery(id_board, {
        refetchOnMountOrArgChange: false
    })
    const handleClose = () => {
        disableCommentArea()
    }

    const handleSend = useCallback((value) => {
        if (!Boolean(value)) return

        createTaskComment({
            id_list,
            id_parent,
            comment: value,
            id_project,
            id_board,
            id_task: query.get('t')
        }).then((res) => {
            let status = res.data?.status
            if (status) handleClose()
        })
    }, [createTaskComment, id_list, id_parent, id_board, id_project])

    return <CommentArea mentionData={data} handleSend={handleSend} handleClose={handleClose} mt="8px" {...props}/>
}

export const CommentArea = ({value: defValue = '', mentionData, handleClose, handleSend, ...props}) => {
    const classes = useCommentAreaStyles()
    const [value, setValue] = useState('')

    useEffect(() => {
        setValue(defValue)
    }, [defValue])

    return (
        <Box className={classes.root} {...props}>
            <EditableAreaState isEditMode={true}>
                {({ isEditMode, disableEditMode }) => {
                    return (
                        <>
                            <EditableArea
                                className="textarea"
                                value={defValue}
                                mt="10px"
                                placeholder="Напишите коментарий"
                                hasMention={true}
                                onChange={setValue}
                                users={mentionData}
                            />

                            <Box className="adornment">
                                <Icon
                                    name="close"
                                    onClick={() => {
                                        disableEditMode()
                                        if (isFnc(handleClose)) handleClose()
                                    }}
                                    width={18}
                                    height={18}
                                    pointer
                                />
                                <SendIcon active={Boolean(value)}
                                          onClick={() => {
                                              if (Boolean(value)) {
                                                  handleSend(value)
                                                  disableEditMode()
                                              }
                                          }}/>
                            </Box>
                        </>
                    )
                }}
            </EditableAreaState>
        </Box>
    )
}

export default NewCommentArea