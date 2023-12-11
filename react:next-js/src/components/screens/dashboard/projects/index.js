'use client'

import React, { useCallback, useMemo, useState } from 'react'
import AddEditModal from '@/components/screens/dashboard/projects/add-edit-modal'
import { Stack, Typography } from '@mui/material'
import ProjectsList from '@/components/screens/dashboard/projects/projects-list'
import { useGetProjectsQuery } from '@/redux/api/project.api'
import { useSelector } from 'react-redux'
import { selectUser } from '@/redux/slices/meta.slice'
import { diffTime } from '@/helpers/functions'
import forEach from 'lodash/forEach'
import Icon from '@/components/ui/icon'
import useStyles from './styles'
import { TabItem, Tabs } from '@/components/ui/tabs'
import IconBtn from '@/components/ui/button/icon-button'
import ContainerLoader from '@/components/ui/loader/container-loader'
import { ARCHIVE_DAYS } from '@/config/const'
import InfoPannel from '@/components/screens/dashboard/projects/_components/info-pannel'

const Projects = () => {
    const s = useStyles()

    const [open, setOpen] = useState(false)
    const handleOpenAddModal = useCallback(() => setOpen(!open), [open])
    const user = useSelector(selectUser)

    const { data: projects, isLoading: loading } = useGetProjectsQuery()

    const { archive, actual } = useMemo(() => {
        const archive = []
        const actual = []

        forEach(projects, (project) => {
            if (diffTime(project.updated_at, 'day') >= ARCHIVE_DAYS) {
                archive.push(project)
            } else {
                actual.push(project)
            }
        })

        return { archive, actual }
    }, [projects])

    const [type, setType] = useState('actual')

    const name = user?.name || user?.login

    const isActual = type === 'actual'

    if (loading) return <ContainerLoader overlay />

    return (
        <>
            <Stack className={s.root}>
                <Stack className={s.projectsRoot}>
                    <Typography component="h3" className={s.title} mb="30px">
                        Здравствуйте, {name}
                    </Typography>

                    <ProjectTabs
                        type={type}
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

                <InfoPannel login={user?.login} />
            </Stack>
        </>
    )
}

const ProjectTabs = ({ type, handleClick, handleOpenAddModal }) => {
    const s = useStyles()

    return (
        <Tabs mb="15px" fontSize={14}>
            <TabItem
                active={type === 'actual'}
                onClick={() => handleClick('actual')}
            >
                Проекты
            </TabItem>
            <TabItem
                active={type === 'archive'}
                onClick={() => handleClick('archive')}
            >
                Архив
            </TabItem>

            <Stack
                flexDirection="row"
                gap="12px"
                alignItems="center"
                sx={{ marginLeft: 'auto', cursor: 'pointer' }}
                onClick={handleOpenAddModal}
            >
                <Typography
                    className={s.description}
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
