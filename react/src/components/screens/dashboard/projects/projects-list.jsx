import Loader from '#root/src/components/ui/loader'
import { Box, Grid, IconButton, Stack, Typography } from '@mui/material'
import Icon from '#root/src/components/ui/icon'
import {
    diffTime,
    empty,
    flexCenterProps,
    flexStartProps, numberEq,
    objValues,
    spaceBetweenProps
} from '#root/src/helpers/functions'
import { useTheme, withStyles } from '@mui/styles'
import ProjectAvatar from '#root/src/components/ui/project-avatar'
import { useSelector } from 'react-redux'
import AddEditModal from '#root/src/components/screens/dashboard/projects/_modal/add-edit-modal'
import React, { memo, useCallback, useState } from 'react'
import { useRouter } from "#root/renderer/hooks"
import { boardRoute, projectRoute } from '#root/src/config/routes'
import { selectOnlineStatuses, selectTimer } from '#root/src/redux/slices/meta.slice'
import classNames from 'classnames'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import PlayIcon from '@mui/icons-material/PlayArrowRounded'
import PauseIcon from '@mui/icons-material/PauseRounded'
import AddIcon from '@mui/icons-material/Add'
import { usePinProjectMutation } from '#root/src/redux/api/project.api'
import _ from 'lodash'
import { ARCHIVE_DAYS, FREE_TRACKING, TASK_TRACKING } from '#root/src/config/const'
import useStyles from '#root/src/components/screens/dashboard/projects/styles'
import AvatarGroup from '#root/src/components/ui/avatar-group'
import Avatar from '#root/src/components/ui/avatar'
import { useTimerController } from '#root/src/hooks/useTimerController'
import CustomButton from '#root/src/components/ui/button/custom-button'

const styles = {
    root: {
        marginTop: '20px'
    },

    item: {
        marginBottom: '10px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        padding: '8px 20px 8px 8px',

        '&.play': {
            border: '2px solid #48C64B'
        },

        '& .name': {
            fontSize: '16px'
        },

        '& .left': {
            cursor: 'pointer'
        }
    }
}

const ProjectsList = withStyles(styles)(({ classes, isLoading, projects }) => {
    const s = useStyles()

    if (isLoading) return <Loader />

    if (empty(projects)) return <EmptyState />

    return (
        <Grid container className={s.projectsList} spacing="10px">
            <Items data={projects} />
        </Grid>
    )
})

const EmptyState = () => {
    const s = useStyles()
    const [open, setOpen] = useState(false)
    const handleOpenAddModal = useCallback(() => setOpen(!open), [open])

    return (
        <Stack className={s.emptyState}>
            <Typography className={s.emptyStateMessage}>
                У вас нет активных <br /> проектов
            </Typography>

            <CustomButton
                onClick={handleOpenAddModal}
                label="Новый проект"
                icon={<AddIcon />}
            />

            <AddEditModal open={open} handler={handleOpenAddModal} />
        </Stack>
    )
}

const Items = ({ data }) => {
    const { activeTimer } =  useTimerController()

    return (
        <>
            {data.map((project) => {
                return (
                    <ProjectItem
                        key={project.id}
                        play={numberEq(activeTimer?.id_project, project.id) && Boolean(activeTimer?.play)}
                        project={project}
                    />
                )
            })}
        </>
    )
}

const ProjectItem = withStyles(styles)(({ play, project }) => {
    const s = useStyles()
    const { push } = useRouter()
    const [open, setOpen] = useState(false)
    const handler = useCallback(() => setOpen(!open), [open])

    const {
        id,
        id_owner,
        name,
        bg,
        boards,
        total_tasks,
        total_urgent_tasks,
        total_comments_count
    } = project
    const user = useSelector((state) => state.meta.user)

    const handlePush = () =>
        push(!empty(boards) ? boardRoute(id, boards[0].id) : projectRoute(id))

    return (
        <Grid item xs={6}>
            <Stack
                className={classNames(s.project, { ['play']: play })}
                onClick={(e) => {
                    e.stopPropagation()
                    handlePush()
                }}
            >
                <Stack
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    marginBottom="45px"
                >
                    <ProjectAvatar
                        size={41}
                        nameSize={22}
                        bg={bg}
                        name={name}
                    />

                    <ActionBtns
                        isOwner={Number(user.id) === Number(id_owner)}
                        handler={handler}
                        project={project}
                    />
                </Stack>

                <Typography className={s.projectName}>{name}</Typography>

                <Box {...spaceBetweenProps()}>
                    <ReactionIcons
                        total_urgent_tasks={total_urgent_tasks}
                        total_comments_count={total_comments_count}
                        total_tasks={total_tasks}
                    />

                    <OnlineParticipants id={parseInt(id)} id_user={user.id} />
                </Box>
            </Stack>

            <AddEditModal item={project} open={open} handler={handler} />
        </Grid>
    )
})

const OnlineParticipants = memo(({ id, id_user }) => {
    const online = useSelector(selectOnlineStatuses)

    const data = _.groupBy(objValues(online), 'id_working_project')
    const users = objValues(data?.[id] || []).filter((v) => v.id !== id_user)

    if (empty(users)) return null

    return (
        <AvatarGroup sx={{ zIndex: 2 }} size={22}>
            {users.map(({ id, name, login, avatar }) => (
                <Avatar
                    key={id}
                    size={22}
                    src={avatar}
                    pointer
                    name={name}
                    login={login}
                    sx={{
                        borderColor: '#f2f3f4'
                    }}
                />
            ))}
        </AvatarGroup>
    )
})

const ActionBtns = ({ isOwner, handler, project }) => {
    const [pinProject] = usePinProjectMutation()

    const { id: projectId, updated_at, pin } = project

    const theme = useTheme()

    const iconBtnStyle = {
            padding: '3px'
        },
        gray = theme.palette.neutral.gray

    return (
        <Box {...flexStartProps('center')} gap="4px">
            {isOwner && (
                <>
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation()
                            handler()
                        }}
                        sx={iconBtnStyle}
                    >
                        <Icon
                            name="pencil"
                            pointer
                            width={21}
                            height={21}
                            style={{ padding: '4px' }}
                        />
                    </IconButton>
                </>
            )}

            {diffTime(updated_at, 'day') < ARCHIVE_DAYS && (
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation()
                        pinProject(projectId)
                    }}
                    sx={iconBtnStyle}
                >
                    <BookmarkIcon
                        sx={{
                            color: pin ? theme.palette.colors.bookmark : gray
                        }}
                    />
                </IconButton>
            )}
        </Box>
    )
}

const ReactionIcons = ({
    total_urgent_tasks,
    total_comments_count,
    total_tasks
}) => {
    const s = useStyles()

    const reactions = [
        {
            value: total_urgent_tasks,
            icon: 'fire-red',
            color: '#FA1010'
        },
        {
            value: total_tasks,
            icon: 'in-progress'
        },
        {
            value: total_comments_count,
            icon: 'message'
        }
    ]

    return (
        <Box {...flexCenterProps('center')} gap="10px">
            {reactions.map(({ value, icon, color }, i) => {
                if (!value) return
                return (
                    <Box key={i} {...flexCenterProps('center')} gap="2px">
                        <Icon
                            name={icon}
                            size="14,14"
                            style={{
                                marginRight: '2px',
                                position: 'relative',
                                top: '1px'
                            }}
                        />
                        <Typography
                            sx={{ color: `${color || '#848484'}!important` }}
                            className={s.description}
                        >
                            {value}
                        </Typography>
                    </Box>
                )
            })}
        </Box>
    )
}

export default memo(ProjectsList)
