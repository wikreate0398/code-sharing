import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import ProjectAvatar from '@/components/ui/project-avatar'
import Image from 'next/image'
import { decomposeColor } from '@mui/material/styles'
import { flexCenterProps, spaceBetweenProps } from '@/helpers/functions'
import Avatar from '@/components/ui/avatar'
import Icon from '@/components/ui/icon'
import useStyles from '@/components/screens/dashboard/projects/styles'

const TasksList = () => {
    const s = useStyles()

    const tasks = [
        {
            id: 1,
            priority: 'urgent',
            title: 'Cannot add media manually if there are no images or data',
            projectName: 'Fimex',
            bg: '#F10000',
            tags: [
                { label: 'Bug', color: '#971F32' },
                { label: 'Priority', color: '#242479' }
            ]
        },
        {
            id: 2,
            priority: 'urgent',
            title: 'Concept Redesign',
            projectName: 'itway',
            bg: '#0069FF',
            tags: []
        },
        {
            id: 3,
            priority: 'urgent',
            title: 'Concept Redesign',
            projectName: 'itway',
            bg: '#0069FF',
            tags: []
        },
        {
            id: 4,
            priority: 'urgent',
            title: 'Concept Redesign',
            projectName: 'itway',
            bg: '#0069FF',
            tags: []
        },
        {
            id: 5,
            priority: 'urgent',
            title: 'Concept Redesign',
            projectName: 'itway',
            bg: '#0069FF',
            tags: []
        },
        {
            id: 6,
            priority: 'urgent',
            title: 'Concept Redesign',
            projectName: 'itway',
            bg: '#0069FF',
            tags: []
        },
        {
            id: 7,
            priority: 'urgent',
            title: 'Concept Redesign',
            projectName: 'itway',
            bg: '#0069FF',
            tags: []
        },
        {
            id: 8,
            priority: 'urgent',
            title: 'Concept Redesign',
            projectName: 'itway',
            bg: '#0069FF',
            tags: []
        },
        {
            id: 9,
            priority: 'urgent',
            title: 'Concept Redesign',
            projectName: 'itway',
            bg: '#0069FF',
            tags: []
        },
        {
            id: 2,
            priority: 'urgent',
            title: 'Concept Redesign',
            projectName: 'itway',
            bg: '#0069FF',
            tags: []
        },
        {
            id: 99,
            priority: 'urgent',
            title: 'Concept Redesign',
            projectName: 'itway',
            bg: '#0069FF',
            tags: []
        },
        {
            id: 98,
            priority: 'urgent',
            title: 'Concept Redesign',
            projectName: 'itway',
            bg: '#0069FF',
            tags: []
        },
        {
            id: 65,
            priority: 'urgent',
            title: 'Concept Redesign',
            projectName: 'itway',
            bg: '#0069FF',
            tags: []
        },
        {
            id: 47,
            priority: 'urgent',
            title: 'Concept Redesign',
            projectName: 'itway',
            bg: '#0069FF',
            tags: []
        }
    ]

    return (
        <Stack className={s.tasksList}>
            {tasks.map(({ id, bg, priority, title, projectName, tags }, i) => {
                return (
                    <Stack className={s.taskCard} key={id}>
                        <ProjectAvatar
                            size={33}
                            nameSize={16}
                            bg={bg}
                            name={projectName}
                        />
                        <Stack className={s.taskContent}>
                            <Typography className={s.taskTitle}>
                                {priority === 'urgent' && (
                                    <Icon
                                        name="fire-red"
                                        size="14,14"
                                        style={{
                                            marginRight: '2px',
                                            position: 'relative',
                                            top: '1px'
                                        }}
                                    />
                                )}
                                {title}
                            </Typography>
                            <Stack
                                flexDirection="row"
                                gap="5px"
                                flexWrap="wrap"
                                marginBottom="8px"
                            >
                                {tags?.length
                                    ? tags.map(({ label, color }, i) => {
                                          let bgRgba = color
                                              ? [
                                                    ...decomposeColor(color)
                                                        .values,
                                                    0.145
                                                ].join(', ')
                                              : null

                                          return (
                                              <Box
                                                  key={i}
                                                  className={s.taskTag}
                                                  sx={{
                                                      background: `rgba(${bgRgba})`,
                                                      color
                                                  }}
                                              >
                                                  {label}
                                              </Box>
                                          )
                                      })
                                    : null}
                            </Stack>

                            <Box {...spaceBetweenProps()}>
                                <Stack
                                    flexDirection="row"
                                    gap="8px"
                                    flexWrap="wrap"
                                >
                                    <Typography className={s.description}>
                                        #{id}
                                    </Typography>
                                    <Box {...flexCenterProps('center')}>
                                        <Image
                                            src="/img/clock.svg"
                                            width={12}
                                            height={12}
                                            alt="icon"
                                            sx={{ marginRight: '3px' }}
                                        />
                                        <Typography className={s.description}>
                                            2h
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Avatar size={22} pointer name="Test" />
                            </Box>
                        </Stack>
                    </Stack>
                )
            })}
        </Stack>
    )
}

export default TasksList
