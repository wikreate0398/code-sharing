import Loader from '@/components/ui/loader'
import { Box, Grid, IconButton, Stack, Typography } from '@mui/material'
import Icon from '@/components/ui/icon'
import {
    diffTime,
    empty,
    flexCenterProps,
    flexStartProps,
    objValues,
    spaceBetweenProps
} from '@/helpers/functions'
import { useTheme, withStyles } from '@mui/styles'
import ProjectAvatar from '@/components/ui/project-avatar'
import { useSelector } from 'react-redux'
import AddEditModal from '@/components/screens/dashboard/projects/add-edit-modal'
import React, { memo, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { boardRoute, projectRoute } from '@/config/routes'
import { selectOnlineStatuses, selectTimer } from '@/redux/slices/meta.slice'
import classNames from 'classnames'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import PlayIcon from '@mui/icons-material/PlayArrowRounded'
import PauseIcon from '@mui/icons-material/PauseRounded'
import AddIcon from '@mui/icons-material/Add'
import { usePinProjectMutation } from '@/redux/api/project.api'
import { groupBy, orderBy } from 'lodash/collection'
import { ARCHIVE_DAYS } from '@/config/const'
import useStyles from '@/components/screens/dashboard/projects/styles'
import AvatarGroup from '@/components/ui/avatar-group'
import Avatar from '@/components/ui/avatar'
import { useTimerController } from '@/hooks/useTimerController'
import SubmitBtn from '@/components/ui/form/submit-button'

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
            <Items
                data={orderBy(
                    projects,
                    ['pin', 'updated_at'],
                    ['desc', 'desc']
                )}
            />
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
            <SubmitBtn onClick={handleOpenAddModal}>
                <AddIcon /> Новый проект
            </SubmitBtn>

            <AddEditModal open={open} handler={handleOpenAddModal} />
        </Stack>
    )
}

const Items = ({ data }) => {
    const timer = useSelector(selectTimer)

    return (
        <>
            {data.map((project) => {
                return (
                    <ProjectItem
                        key={project.id}
                        play={timer?.[project.id]?.play}
                        project={project}
                    />
                )
            })}
        </>
    )
}

const ProjectItem = withStyles(styles)(({ classes, play, project }) => {
    const s = useStyles()
    const { push } = useRouter()
    const [open, setOpen] = useState(false)
    const handler = useCallback(() => setOpen(!open), [open])

    const { id, id_owner, name, bg, boards } = project
    const user = useSelector((state) => state.meta.user)

    const handlePush = () =>
        push(!empty(boards) ? boardRoute(id, boards[0].id) : projectRoute(id))

    let participants = [
        { id: 1, name: 'John' },
        {
            id: 2,
            name: 'Daniel'
        }
    ]

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
                        isOwner={user.id === id_owner}
                        handler={handler}
                        project={project}
                    />
                </Stack>

                <Typography className={s.projectName}>{name}</Typography>

                <Box {...spaceBetweenProps()}>
                    <ReactionIcons />

                    <OnlineParticipants id={id} id_user={user.id} />
                </Box>
            </Stack>

            <AddEditModal item={project} open={open} handler={handler} />
        </Grid>
    )
})

const OnlineParticipants = memo(({ id, id_user }) => {
    const online = useSelector(selectOnlineStatuses)

    const data = groupBy(objValues(online), 'id_working_project')
    const users = objValues(data?.[id] || []).filter((v) => v.id !== id_user)

    if (empty(users)) return null

    return (
        <AvatarGroup sx={{ zIndex: 2 }} size={22}>
            {users.map(({ id, name }) => (
                <Avatar
                    key={id}
                    size={22}
                    pointer
                    name={name}
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

    const { isTimerRunning, onStartTimer, onStopTimer } =
        useTimerController(projectId)

    const iconBtnStyle = {
            padding: '3px'
        },
        gray = theme.palette.neutral.gray

    return (
        <Box {...flexStartProps('center')} gap="4px">
            <IconButton
                onClick={(e) => {
                    e.stopPropagation()
                    if (isTimerRunning) onStopTimer()
                    else onStartTimer()
                }}
                sx={{
                    color: isTimerRunning ? theme.palette.primary.green : gray,
                    ...iconBtnStyle
                }}
            >
                {isTimerRunning ? <PauseIcon /> : <PlayIcon />}
            </IconButton>

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

const ReactionIcons = () => {
    const s = useStyles()

    const reactions = [
        {
            value: '4',
            icon: 'fire-red',
            color: '#FA1010'
        },
        {
            value: '8',
            icon: 'in-progress'
        },
        {
            value: '2',
            icon: 'message'
        }
    ]

    return (
        <Box {...flexCenterProps('center')} gap="10px">
            {reactions.map(({ value, icon, color }, i) => {
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
