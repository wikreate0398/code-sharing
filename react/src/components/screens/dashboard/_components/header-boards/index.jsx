import React, { memo, useCallback, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useFetchBoardsQuery } from '#root/src/redux/api/board.api'
import ProjectAvatar from '#root/src/components/ui/project-avatar'
import AddEditModal from '#root/src/components/screens/dashboard/project/board/_components/add-edit-modal'
import AddEditProjectModal from '#root/src/components/screens/dashboard/projects/_modal/add-edit-modal'
import { empty, flexStartProps, numberEq, objValues } from '#root/src/helpers/functions'
import { useParams, useRouter, useSearchParams } from '#root/renderer/hooks'
import { boardRoute, projectRoute } from '#root/src/config/routes'
import { useProjectContext } from '#root/src/providers/project-provider'
import { TabItem, Tabs } from '#root/src/components/ui/tabs'
import Icon from '#root/src/components/ui/icon'
import IconBtn from '#root/src/components/ui/button/icon-button'
import useStyles from './styles'
import PencilIcon from '#root/src/components/ui/svg-icons/icons/pencil-icon'
import { useSelector } from 'react-redux'
import { selectOnlineStatuses, selectAuthUser } from '#root/src/redux/slices/meta.slice'
import _ from 'lodash'
import Avatar from '#root/src/components/ui/avatar'
import StopTimer from '#root/src/components/ui/timer/stop-timer.jsx'
import { useTimerController } from '#root/src/hooks/useTimerController.js'

const HeaderBoards = ({ project }) => {
    const classes = useStyles()
    const { isOwner } = useProjectContext()
    const { push } = useRouter()
    const { id_board } = useParams()

    const [openProjectModal, setOpenProjectModal] = useState(false)
    const handleOpenAddModal = useCallback(
        () => setOpenProjectModal((old) => !old),
        []
    )

    const { id: id_project } = project

    return (
        <Stack className={classes.root}>
            <Stack className={classes.leftPannel}>
                <ProjectAvatar
                    size={24}
                    bg={project.bg}
                    name={project?.name}
                    onClick={() => push(projectRoute(id_project))}
                />

                <BoardsItems id_project={id_project} isOwner={isOwner} id_board={id_board}/>
            </Stack>

            <Stack className={classes.rightPannel}>
                <Timer />

                <OnlineMembers id_project={id_project}/>

                {isOwner && (
                    <>
                        {/*<CustomButton*/}
                        {/*    size="small"*/}
                        {/*    label="Share"*/}
                        {/*    sx={{ width: 'fit-content' }}*/}
                        {/*/>*/}
                        <IconBtn onClick={handleOpenAddModal}>
                            <PencilIcon size={11} />
                        </IconBtn>
                    </>
                )}

                <AddEditProjectModal
                    open={openProjectModal}
                    handler={handleOpenAddModal}
                    initialTab={'board'}
                    item={project}
                    id_board={id_board}
                />
            </Stack>
        </Stack>
    )
}

const Timer = memo(() => {
    const query = useSearchParams()

    const { activeTimer } = useTimerController()

    if (query.has('t') && numberEq(query.get('t'), activeTimer?.id_task)) return null

    return  <StopTimer withTaskName sm />
})

const BoardsItems = memo(({isOwner, id_project, id_board}) => {
    const [open, setOpen] = useState(false)
    const handler = useCallback(() => setOpen(!open), [open])
    const { push } = useRouter()
    const { data: boards, isLoading } = useFetchBoardsQuery(parseInt(id_project))
    if (isLoading) return null

    return (
        <>
            <Tabs sx={{
                borderBottom: 'none!important'
            }}>
                {boards.map(({ id, id_project, name }) => {
                    return (
                        <TabItem
                            key={id}
                            sx={{
                                whiteSpace: 'nowrap'
                            }}
                            active={parseInt(id_board) === id}
                            onClick={() => push(boardRoute(id_project, id))}
                        >
                            {name}
                        </TabItem>
                    )
                })}
            </Tabs>

            {isOwner && (
                <>
                    <Box
                        onClick={handler}
                        style={{
                            cursor: 'pointer',
                            alignItems: 'center'
                        }}
                        {...flexStartProps()}
                        gap="8px"
                    >
                        <IconBtn>
                            <Icon pointer name="plus" v2 />
                        </IconBtn>
                        {empty(boards) ? (
                            <Typography ml="3px" variant="small-gray">
                                Добавить доску
                            </Typography>
                        ) : null}
                    </Box>

                    <AddEditModal open={open} handler={handler} />
                </>
            )}
        </>
    )
})


const OnlineMembers = memo(({id_project}) => {
    const classes = useStyles()
    const online = useSelector(selectOnlineStatuses)

    const data = _.groupBy(objValues(online), 'id_working_project')
    const me = useSelector(selectAuthUser)

    const users = objValues(data?.[id_project] || []).filter(
        (v) => v.id !== me.id
    )

    return (
        <Stack className={classes.onlineMembers}>
            {users.map(({ id, name, login, avatar, working_task }) => (
                <Avatar
                    tooltip={{
                        title: (
                            <>

                                {name} | {working_task.name}
                            </>
                        ),
                        arrow: true,
                        placement: 'bottom'
                    }}
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
        </Stack>
    )
})


export default HeaderBoards
