import React, { memo, useCallback, useContext, useRef, useState } from 'react'
import { Box, TextareaAutosize, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Icon from '@/components/ui/icon'
import {
    empty,
    flexStartProps,
    spaceBetweenProps,
    wrapURLs,
    wrapLogins
} from '@/helpers/functions'
import { ListCommentsCtxProvider } from '@/components/screens/dashboard/project/board/task/_components/list-comments/provider'
import { useCreateTaskCommentMutation } from '@/redux/api/task.comment.api'
import { useParams, useSearchParams } from 'next/navigation'
import moment from 'moment'
import Avatar from '@/components/ui/avatar'
import CommentBtn from '@/components/screens/dashboard/project/board/task/_components/comment-btn'
import Mention from '@/components/ui/mention'
import { useGetBoardParticipantsQuery } from '@/redux/api/participant.api'

const useCommentAreaStyles = makeStyles(() => ({
    root: {
        ...spaceBetweenProps(),
        width: '100%',
        position: 'relative',
        marginTop: '8px',
        '& .adornment': {
            position: 'absolute',
            right: '8px',
            ...flexStartProps('center'),
            gap: '8px'
        },

        '& .textarea': {
            width: '100%',
            borderRadius: '8px',
            border: '1px solid #DDDEE4',
            padding: '9px 14px',
            resize: 'none',
            fontSize: '13px'
        }
    }
}))

const NewCommentArea = () => {
    const { id_board, id_project } = useParams()
    const classes = useCommentAreaStyles()
    const query = useSearchParams()
    const { disableCommentArea, id_list } = useContext(ListCommentsCtxProvider)
    const [value, setValue] = useState('')
    const [createTaskComment] = useCreateTaskCommentMutation()
    const { data } = useGetBoardParticipantsQuery(id_board, {
        refetchOnMountOrArgChange: false
    })
    const ref = useRef()

    const handleClose = () => {
        setValue('')
        disableCommentArea()
    }

    const handleSend = useCallback(() => {
        createTaskComment({
            id_list,
            comment: value,
            id_project,
            id_board,
            id_task: query.get('t')
        }).then(() => {
            handleClose()
        })
    }, [createTaskComment, value, id_list, id_board, id_project])

    const handleSelect = useCallback(
        (updatedText) => {
            if (!ref.current) return

            setValue(updatedText)
            ref.current.value = updatedText
        },
        [ref, value]
    )

    return (
        <Box className={classes.root}>
            <TextareaAutosize
                className="textarea"
                onChange={(e) => setValue(e.target.value)}
                placeholder="Напишите коментарий"
                autoCorrect="off"
                ref={ref}
                minRows={1}
            />
            <Mention
                data={data}
                inputRef={ref}
                onSelect={handleSelect}
                value={value}
            />
            <Box className="adornment">
                <Icon
                    name="close"
                    onClick={handleClose}
                    width={15}
                    height={15}
                    pointer
                />
                <Icon
                    name="envelope"
                    width={21}
                    height={23}
                    pointer
                    onClick={handleSend}
                />
            </Box>
        </Box>
    )
}

const useStyles = makeStyles(() => ({
    root: {
        margin: '5px 0 5px 36px'
    },

    item: {
        padding: '10px 8px 8px 47px',
        marginLeft: '-35px',
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            width: '2px',
            left: '30px',
            top: '8px',
            bottom: '8px',
            backgroundColor: '#FFC700'
        },

        '&:hover': {
            backgroundColor: '#F4F5F7',
            borderRadius: '4px',
            cursor: 'pointer',

            '& .actions': {
                opacity: 1
            }
        },

        '& .comment': {
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            lineHeight: '17px',
            fontSize: '13px'
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
        }
    }
}))

const ListComments = memo(({ comments }) => {
    const { open } = useContext(ListCommentsCtxProvider)

    const classes = useStyles()

    if (!open && empty(comments)) return null

    const totalComments = comments.length
    return (
        <Box className={classes.root}>
            {comments.map((data, k) => (
                <CommentItem
                    key={data.id}
                    data={data}
                    isLast={k + 1 === totalComments}
                />
            ))}

            {open && <NewCommentArea />}
        </Box>
    )
})

const CommentItem = memo(({ data, isLast }) => {
    const { enableCommentArea } = useContext(ListCommentsCtxProvider)
    const { id_board } = useParams()
    const { data: users } = useGetBoardParticipantsQuery(id_board, {
        refetchOnMountOrArgChange: false
    })

    const classes = useStyles()
    const { user, comment, created_at } = data

    return (
        <Box className={classes.item}>
            <Box {...flexStartProps('center')} gap="5px" mb="8px">
                <Avatar name={user.name} size={16} />
                <Typography
                    fontSize="12px"
                    dangerouslySetInnerHTML={{ __html: user.name }}
                />
                <Typography variant="small-gray">
                    {moment(created_at).format('DD.MM.YYYY')}
                </Typography>
            </Box>
            <Typography
                component="p"
                className="comment"
                dangerouslySetInnerHTML={{
                    __html: wrapLogins(wrapURLs(comment), users)
                }}
            />
            {isLast && (
                <Box className="actions">
                    <CommentBtn onClick={enableCommentArea} />
                </Box>
            )}
        </Box>
    )
})

export default ListComments
