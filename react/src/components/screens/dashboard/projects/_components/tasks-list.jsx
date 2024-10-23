import React, { useMemo } from 'react'
import { Stack, Box } from '@mui/material'
import useStyles from '#root/src/components/screens/dashboard/projects/styles'
import { useRouter } from "#root/renderer/hooks"
import { taskRoute } from '#root/src/config/routes'
import ProjectAvatar from '#root/src/components/ui/project-avatar'
import _ from 'lodash'
import { extractTagsByIds } from '#root/src/helpers/functions.js'
import {
    ColumnTaskInner
} from '#root/src/components/screens/dashboard/project/board/kanban/column-task.jsx'

const TasksList = ({ tasks }) => {
    const classes = useStyles()

    return (
        <Stack className={classes.tasksList}>
            {_.orderBy(
                tasks || [],
                ['project_position', 'task_position'],
                ['asc', 'asc']
            ).map(
                (item) => {
                    return <Task key={item.id} {...item}/>
                }
            )}
        </Stack>
    )
}

const Task = ({
    project,
    id: uid,
    name,
    urgent,
    participants,
    estimate_time,
    comments_count,
    id_board,
    tags: tagsIds
}) => {
    const classes = useStyles()

    const { push } = useRouter()
    const openTask = (id, id_project, id_board) =>
        push(taskRoute(id_project, id_board, id))

    const { id: id_project, bg, name: projectName, taskTags } = project

    const tags = useMemo(() => extractTagsByIds(taskTags, tagsIds), [taskTags, tagsIds])

    return (
        <Box key={uid}>
            <Stack className={classes.taskCard}>
                <ProjectAvatar
                    size={33}
                    nameSize={16}
                    bg={bg}
                    name={projectName}
                />

                <Stack flex={1} gap="8px">
                    <ColumnTaskInner
                        tags={tags}
                        name={name}
                        participants={participants}
                        uid={uid}
                        urgent={urgent}
                        estimate_time={estimate_time}
                        comments_count={comments_count}
                        openTask={() =>
                            openTask(uid, id_project, id_board)
                        }
                    />
                </Stack>
            </Stack>
        </Box>
    )
}

export default TasksList
