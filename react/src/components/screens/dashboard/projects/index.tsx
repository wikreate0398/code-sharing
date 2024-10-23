
import React, { FC, useCallback, useState } from 'react'
import AddEditModal from '#root/src/components/screens/dashboard/projects/_modal/add-edit-modal'
import { Stack, Typography } from '@mui/material'
import ProjectsList from '#root/src/components/screens/dashboard/projects/projects-list'
import { useGetUserProjectsGqlQuery } from '#root/src/redux/api/project.api'
import { useSelector } from 'react-redux'
import { selectAuthUser } from '#root/src/redux/slices/meta.slice'
import { diffTime } from '#root/src/helpers/functions'
import _ from 'lodash'
import Icon from '#root/src/components/ui/icon'
import useStyles from './styles'
import { TabItem, Tabs } from '#root/src/components/ui/tabs'
import IconBtn from '#root/src/components/ui/button/icon-button'
import ContainerLoader from '#root/src/components/ui/loader/container-loader'
import { ARCHIVE_DAYS } from '#root/src/config/const'
import InfoPannel from '#root/src/components/screens/dashboard/projects/_components/info-pannel'

const Projects: FC = () => {
    const classes = useStyles()

    const [open, setOpen] = useState(false)
    const handleOpenAddModal = useCallback(() => setOpen(!open), [open])
    const user = useSelector(selectAuthUser)

    const {
        archive,
        actual,
        tasks,
        isLoading: loading
    } = useGetUserProjectsGqlQuery(undefined, {
        refetchOnMountOrArgChange: true,
        selectFromResult: ({ data, ...props }) => {
            const archive = []
            const actual = []
            const tasks = []

            const { linkedColumns } = user

            const projects = _.orderBy(
                data || [],
                ['pin', 'updated_at'],
                ['desc', 'desc']
            )

            _.forEach(
                projects,
                ({ tasks: projectTasks, ...project }, projectKey) => {
                    const totalActions = projectTasks.reduce(
                        (acc, current) => {
                            const {
                                total_urgent_tasks: U,
                                total_comments_count: C
                            } = acc

                            const { comments_count: c, urgent: u } =
                                current || {}

                            return {
                                total_urgent_tasks: U + Number(u),
                                total_comments_count: C + Number(c)
                            }
                        },
                        {
                            total_urgent_tasks: 0,
                            total_comments_count: 0
                        }
                    )

                    const final = {
                        total_tasks: projectTasks?.length ?? 0,
                        ...project,
                        ...totalActions
                    }

                    if (diffTime(project.updated_at, 'day') >= ARCHIVE_DAYS) {
                        archive.push(final)
                    } else {
                        actual.push(final)

                        if (projectTasks.length > 0) {
                            projectTasks.forEach((task) => {
                                const obj = task.columns_relations.find((v) =>
                                    linkedColumns.includes(
                                        parseInt(v.id_column)
                                    )
                                )

                                if (obj) {
                                    const { id_board, id_column, position } =
                                        obj
                                    tasks.push({
                                        ...task,
                                        id_board,
                                        id_column,
                                        project_position: projectKey + 1,
                                        task_position: position,
                                        project
                                    })
                                }
                            })
                        }
                    }
                }
            )

            return { archive, actual, tasks, ...props }
        }
    })

    const [type, setType] = useState('actual')

    const name = user?.name || user?.login

    const isActual = type === 'actual'

    if (loading) return <ContainerLoader overlay />

    return (
        <>
            <Stack className={classes.root}>
                <Stack className={classes.projectsRoot}>
                    <Typography
                        component="h3"
                        className={classes.title}
                        mb="30px"
                    >
                        Здравствуйте, {name}
                    </Typography>

                    <ProjectTabs
                        type={type}
                        hasArchive={archive.length > 0}
                        handleClick={(val) => setType(val)}
                        handleOpenAddModal={handleOpenAddModal}
                    />
                    <AddEditModal open={open} handler={handleOpenAddModal} />

                    {isActual ? (
                        <ProjectsList isLoading={loading} projects={actual} />
                    ) : (
                        <ProjectsList isLoading={loading} projects={archive} />
                    )}
                </Stack>

                <InfoPannel tasks={tasks} />
            </Stack>
        </>
    )
}

const ProjectTabs = ({ type, handleClick, handleOpenAddModal, hasArchive }) => {
    const classes = useStyles()

    return (
        <Tabs mb="15px" fontSize={14}>
            <TabItem
                active={type === 'actual'}
                onClick={() => handleClick('actual')}
            >
                Проекты
            </TabItem>
            {hasArchive && <TabItem
                active={type === 'archive'}
                onClick={() => handleClick('archive')}
            >
                Архив
            </TabItem>}

            <Stack
                flexDirection="row"
                gap="12px"
                alignItems="center"
                sx={{ marginLeft: 'auto', cursor: 'pointer' }}
                onClick={handleOpenAddModal}
            >
                <Typography
                    className={classes.description}
                    sx={{ fontWeight: '400!important' }}
                >
                    Новый проект
                </Typography>
                <IconBtn>
                    <Icon name="plus" pointer size="10,10" />
                </IconBtn>
            </Stack>
        </Tabs>
    )
}

export default Projects
