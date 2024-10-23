import React, {memo, useCallback, useMemo } from 'react'
import { useParams, useRouter } from '#root/renderer/hooks'
import { taskRoute } from '#root/src/config/routes'
import { useProjectContext } from '#root/src/providers/project-provider'
import { estimateTime, extractTagsByIds, spaceBetweenProps } from '#root/src/helpers/functions'
import { Box, Stack, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import Icon from '#root/src/components/ui/icon/index'
import TagsList from '#root/src/components/ui/tags-list/index'
import AvatarGroup from '#root/src/components/ui/avatar-group/index'
import Avatar from '#root/src/components/ui/avatar/index'

const useStyles = makeStyles(() => ({
    details: {
        fontSize: '12px',
        color: '#9EA2B2',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    },

    statusLine: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '3.5px',
        height: '100%',
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px'
    },

    name: {
        color: '#333',
        fontWeight: 500,
        fontSize: '13px',
        lineHeight: '15px',
        wordWrap: 'anywhere',
        marginRight: '25px',
        cursor: 'pointer',

        '&:hover': {
            color: 'rgba(60, 146, 246, 1)'
        }
    }
}))

export const getColumnTaskStyle = (isDragging = false, draggableStyle = {}) => ({
    // some basic styles to make the items look a bit nicer
    position: 'relative',
    display: 'flex',
    gap: '8px',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden',
    userSelect: "none",
    padding: '12px 10px 8px 15px',
    margin: `0 0 10px 0`,
    borderRadius: '8px',
    boxShadow: '0px 1px 1px 0px #0000001A',

    // change background colour if dragging
    background: isDragging ? "#fefefe" : "#fff",

    // styles we need to apply on draggables
    ...draggableStyle
});

export const ColumnTask = memo(({ data }) => {
    const { push } = useRouter()

    const { id_board, id_project } = data

    const openTask = useCallback(
        () => {
            push(taskRoute(id_project, id_board, data.uid))
        },
        [id_project, id_board, data]
    )

    const { project } = useProjectContext()
    const { taskTags } =  project || {}

    const {
        uid,
        name,
        participants,
        urgent,
        estimate_time,
        comments_count,
        tags: tagsIds
    } = data

    const tags = useMemo(() =>
        extractTagsByIds(taskTags, tagsIds), [taskTags, tagsIds])

    return (
        <ColumnTaskInner
            tags={tags}
            name={name}
            participants={participants}
            uid={uid}
            urgent={urgent}
            estimate_time={estimate_time}
            comments_count={comments_count}
            openTask={openTask}
        />
    )
}, (p, n) => {
    return JSON.stringify(p.data)===JSON.stringify(n.data)
})

export const ColumnTaskInner = memo((data) => {
    const {
        name,
        uid,
        tags,
        participants,
        openTask,
        urgent: isUrgent,
        estimate_time,
        comments_count
    } = data

    return (
        <>
            <Urgent isUrgent={isUrgent}/>
            <Name name={name} isUrgent={isUrgent} openTask={openTask}/>

            <TagsList tags={tags} marginBottom={0} />

            <Footer
                uid={uid}
                estimate_time={estimate_time}
                comments_count={comments_count}
                participants={participants}
            />
        </>
    )
})

const Urgent = memo(({isUrgent}) => {
    const theme = useTheme()
    const classes = useStyles()

    return (
        <Box
            className={classes.statusLine}
            style={{
                backgroundColor: isUrgent
                    ? theme.palette.colors.urgent
                    : 'transparent'
            }}
        />
    )
}, (prev, next) => {
    return  prev.isUrgent === next.isUrgent
})

const Name = memo(({name, openTask, isUrgent}) => {
    const classes = useStyles()
    return (
        <Box
            className={classes.name}
            data-no-dnd="true"
            onClick={openTask}
        >
            {Boolean(isUrgent) && (
                <Icon
                    name="fire-red"
                    size="14,14"
                    style={{
                        marginRight: '4px',
                        position: 'relative',
                        top: '1px'
                    }}
                />
            )}
            {name}
        </Box>
    )
}, (prev, next) => {
    return prev.isUrgent === next.isUrgent && prev.name === next.name
})

export const Footer = memo(
    ({ uid, estimate_time, comments_count, participants }) => {
        const classes = useStyles()

        return (
            <Box {...spaceBetweenProps()} sx={{ minHeight: 22 }}>
                <Stack flexDirection="row" alignItems="center" gap="11px">
                    <Typography className={classes.details}>#{uid}</Typography>
                    <ColumnTaskEstimateTime time={estimate_time} />
                    {Boolean(comments_count) && (
                        <Typography className={classes.details}>
                            <Icon name="comments" width={12} height={12} />{' '}
                            {comments_count}
                        </Typography>
                    )}
                </Stack>

                <ColumnTaskParticipants participants={participants} />
            </Box>
        )
    }
)

const ColumnTaskEstimateTime = memo(({ time }) => {
    const classes = useStyles()
    if (!time) return null

    return (
        <Typography className={classes.details}>
            <Icon name="clock" width={12} height={12} /> {estimateTime(time)}
        </Typography>
    )
})

const ColumnTaskParticipants = memo(({ participants }) => {
    return (
        <AvatarGroup sx={{ zIndex: 2 }} size={22}>
            {participants.map(({ id, name }) => (
                <Avatar key={id} size={22} pointer name={name} />
            ))}
        </AvatarGroup>
    )
})

export default ColumnTask