import React, { memo, useContext, useEffect, useMemo, useState } from 'react'
import { Box, styled, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import {
    empty,
    flexStartProps,
    wrapURLs,
    wrapLogins, confirmAlert, declination
} from '#root/src/helpers/functions'
import { ListCommentsCtxProvider } from '#root/src/components/screens/dashboard/project/board/task/_components/list-comments/provider'
import { useParams } from "#root/renderer/hooks"
import moment from 'moment'
import Avatar from '#root/src/components/ui/avatar'
import NewCommentArea, {
    CommentArea
} from '#root/src/components/screens/dashboard/project/board/task/_components/list-comments/new-comment'
import { useGetBoardParticipantsQuery } from '#root/src/redux/api/participant.api'
import Icon from '#root/src/components/ui/icon'
import { useSelector } from 'react-redux'
import { selectAuthUser } from '#root/src/redux/slices/meta.slice.js'
import {
    useDeleteTaskCommentMutation,
    useUpdateTaskCommentMutation
} from '#root/src/redux/api/task/task.comment.api.js'
import classNames from 'classnames'
import { useNotify } from '#root/src/helpers/hooks.js'
import { CopyToClipboard } from 'react-copy-to-clipboard/src/Component'

const useStyles = makeStyles((theme) => ({
    root: {
        margin: '5px 0 5px 36px'
    },

    item: {
        padding: '10px 75px 10px 10px',
        minHeight: 51,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: '10px',

        '&.child': {
            //marginLeft: '23px'
        },

        '&:hover': {
            cursor: 'pointer',
            background: theme.palette.neutral[100],
            transition: "background-color 0.2s ease",

            '& .actions': {
                opacity: 1
            }
        },

        '&.editing': {
            background: 'transparent',
            padding: '0 10px',
            minHeight: 'auto',
        },

        '& .comment': {
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            lineHeight: '17px',
            fontSize: '12px',
            color: '#191919'
        },

        '& .actions': {
            ...flexStartProps('center'),
            gap: '8px',
            position: 'absolute',
            top: 0,
            bottom: 0,
            margin: 'auto',
            right: '10px',
            opacity: 0,
            '& svg:hover': {
                '& circle, & path': {
                    fill: theme.palette.neutral[800]
                }
            }
        },

        '& .checkbox': {
            marginTop: '2.5px'
        }
    },

    childs: {}
}))

const More = styled(Typography)(() => ({
    color: '#4260F2',
    fontWeight: 500,
    cursor: 'pointer',
    marginLeft: '32px'
}))

const ListComments = memo(({ comments }) => {
    const { open, disableCommentArea, id_list } = useContext(ListCommentsCtxProvider)

    const classes = useStyles()

    const commentsItems = useMemo(() => {
        const childs = {}
        const parents = []
        comments.forEach((child) => {
            const id_parent = child.id_parent
            if (Boolean(id_parent)) {
                if (!childs?.[id_parent]) {
                    childs[id_parent] = []
                }
                childs[id_parent].push(child)
            } else {
                parents.push(child)
            }
        })

        return parents.map((comment) => ({
            ...comment,
            childs: childs?.[comment.id] || []
        }))
    }, [comments])

    if (!open && empty(comments)) return null

    return (
        <Box className={classes.root}>
            {commentsItems.map((data, k) => (
                <CommentItem
                    key={data.id}
                    data={data}
                />
            ))}

            {open && <NewCommentArea id_list={id_list}
                                     disableCommentArea={disableCommentArea}/>}
        </Box>
    )
})

const CommentItem = memo(({ data }) => {
    const [updateTaskComment] = useUpdateTaskCommentMutation()

    const [isEditMode, setEditMode] = useState(false)
    const [isReplyMode, setReplyMode] = useState(false)

    const { id_board } = useParams()
    const { data: users } = useGetBoardParticipantsQuery(id_board, {
        refetchOnMountOrArgChange: false
    })

    const classes = useStyles()
    const {id, id_list, user, id_parent, comment, created_at, childs } = data

    const isParent = id_parent === null

    return (
        <>
            <Box className={classNames(classes.item, {editing: isEditMode, child: !isParent})}>
                {isEditMode ? (
                    <CommentArea value={comment}
                                 mentionData={users}
                                 handleClose={() => setEditMode(false)}
                                 handleSend={(text) => {
                                     updateTaskComment({id, text}).then(() => {
                                         setEditMode(false)
                                     })
                                 }}/>
                ) : (
                    <>
                        <Box {...flexStartProps('center')} gap="6px" mb="3px">
                            <Avatar
                                name={user.name}
                                size={18}
                                sx={{
                                    borderRadius: 6
                                }}
                            />
                            <Typography
                                fontSize="12px"
                                dangerouslySetInnerHTML={{ __html: user.name }}
                            />
                            <Typography variant="small-gray">
                                {moment(created_at).fromNow()}
                            </Typography>
                        </Box>

                        <Typography
                            ml="23px"
                            component="p"
                            className="comment"
                            dangerouslySetInnerHTML={{
                                __html: wrapLogins(wrapURLs(comment), users)
                            }}
                        />
                        <Actions id={id}
                                 comment={comment}
                                 isParent={isParent}
                                 id_author={user.id}
                                 enableEdit={() => setEditMode(true)}
                                 enableReply={() => setReplyMode(true)}/>
                    </>
                )}
            </Box>

            {isParent && !empty(childs) && <Childs items={childs}/>}

            {isReplyMode && <NewCommentArea id_parent={id}
                                            ml="33px"
                                            id_list={id_list}
                                            disableCommentArea={() => setReplyMode(false)}/>}
        </>
    )
})

const MIN_LENGTH = 2
const Childs = memo(({items}) => {
    const classes = useStyles()
    const [showMore, setShowMore] = useState(false)

    const showFullList = showMore || items.length <= MIN_LENGTH
    const hideComentsCount = items.length-MIN_LENGTH

    useEffect(() => {
        if (showMore && items.length <= MIN_LENGTH) setShowMore(false)
    }, [items, showMore])

    return (
        <Box className={classes.childs} ml="23px">
            {(showFullList ? items : items.slice(0, MIN_LENGTH)).map((data, k) => (
                <CommentItem key={data.id} data={data} />
            ))}

            {(!showMore && items.length > MIN_LENGTH || showMore) && (
                <More variant="p-12"
                      onClick={() => setShowMore(!showMore)}>
                    {showMore ? "Скрыть" : `Еще ${hideComentsCount} ${declination(hideComentsCount, 'Ответ','Ответа', 'Ответов')}`}
                </More>
            )}
        </Box>
    )
})

const Actions = memo(({id, comment, id_author, isParent, enableEdit, enableReply}) => {
    const authUser = useSelector(selectAuthUser)
    const [deleteTaskComment] = useDeleteTaskCommentMutation()
    const [copied, setCopied] = useState(false)

    if (!isParent && Number(authUser.id) !== Number(id_author)) return null

    return (
        <Box className="actions">
            <CopyToClipboard
                text={comment}
                onCopy={() => setCopied(true)}
            >
                <Icon name="copy" pointer tooltip={{
                    title: copied ? 'Скопировано!' : 'Cкопировать',
                    placement: 'top',
                    onClose: () => {
                        setTimeout(() => setCopied(false), 100)
                    }
                }}/>
            </CopyToClipboard>

            {isParent && <Icon name="reply"
                               tooltip={{
                                   title: 'Ответить',
                                   placement: 'top'
                               }}
                               onClick={enableReply} pointer/>}
            {
                Number(authUser.id) === Number(id_author) && (
                    <>
                        <Icon name="pencil-v2"
                              onClick={enableEdit}
                              pointer
                              tooltip={{
                                  title: 'Изменить',
                                  placement: 'top'
                              }}/>
                        <Icon name="trash" tooltip={{
                            title: 'Удалить',
                            placement: 'top'
                        }} onClick={() => {
                            if (confirmAlert()) deleteTaskComment(id)
                        }} pointer size="12.5,14"/>
                    </>
                )
            }
        </Box>
    )
})

export default ListComments
