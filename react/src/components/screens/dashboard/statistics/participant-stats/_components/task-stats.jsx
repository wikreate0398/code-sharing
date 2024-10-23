import CardWrapper from '#root/src/components/screens/dashboard/statistics/participant-stats/_components/card-wrapper'
import React, { useState } from 'react'
import { useGetTasksStatisticsGqlQuery } from '#root/src/redux/api/statistics.api'
import { Table, Thead, Tbody, Tr, Th, Td } from '#root/src/components/ui/table'
import ProjectAvatar from '#root/src/components/ui/project-avatar'
import { empty, flexCenterProps, formatDuration } from '#root/src/helpers/functions'
import moment from 'moment/moment.js'
import { Box, styled, Typography } from '@mui/material'
import Icon from '#root/src/components/ui/icon/index'
import { taskRoute } from '#root/src/config/routes'

const MIN_LENGTH = 8

const IconInfo = ({title}) => {
    return (
        <Icon
            name="info"
            pointer
            width={14}
            height={14}
            tooltip={{
                title,
                placement: "bottom"
            }}
            sx={{
                position: 'relative',
                top: '2px',
                right: '-4px'
            }}
        />
    )
}

const More = styled(Typography)(() => ({
    color: '#4260F2',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'center',
    marginTop: '24px'
}))

export const TaskName = styled(Typography)(({underline = true}) => ({
    fontSize: '13px',
    maxWidth: '250px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',

    ...(underline ? {
        '&:hover': {
            textDecoration: 'underline',
            cursor: 'pointer'
        }
    } : {})  
}))

const TaskStats = ({id_project, id_user, from, to}) => {

    const [show, setShow] = useState(false)

    const {data = [], isSuccess} = useGetTasksStatisticsGqlQuery({id_project, id_user, from, to}, {
        refetchOnMountOrArgChange: true
    })

    if (!isSuccess) return null

    const count = data.length
    return (
        <CardWrapper title="Активность в тасках"
                     isAlert={empty(data)}
                     alertMessage="Активность не обнаружена"
        >
            <Table>
                <Thead>
                    <Tr>
                        <Th>
                            Дата
                            <IconInfo title="Дата последних действий"/>
                        </Th>
                        <Th>Проект</Th>
                        <Th>Название задачи</Th>
                        <Th ac>
                            Общее время
                            <IconInfo title="Общее время сотруд. / Оценочное время (если указано)"/>
                        </Th>
                        <Th ac>Затраченное время</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {(show ? data : data.slice(0, MIN_LENGTH)).map(({ last_update, id_project, id_board, id_task, project, task, total_worked_time, worked_time }, k) => {
                        const selfTime = formatDuration({ ammount: worked_time, short: true })
                        const estimate_time = task.estimate_time

                        return (
                            <Tr key={k}>
                                <Td>
                                    {moment(last_update)
                                        .locale('ru')
                                        .format('D MMM')}</Td>
                                <Td ac>
                                    <ProjectAvatar
                                        bg={project.bg}
                                        size={20}
                                        name={project?.name}
                                    />
                                </Td>
                                <Td>
                                    <TaskName onClick={() => {
                                        window.open(taskRoute(id_project, id_board, id_task), "_blank", "noreferrer");
                                    }}>{task.name}</TaskName>
                                </Td>
                                <Td ac>
                                    <TotalTime time={total_worked_time} estimate={estimate_time}/>
                                </Td>
                                <Td ac>{Boolean(selfTime) && selfTime}</Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>

            {(!show && count > MIN_LENGTH || show) && (
                <More variant="p-12"
                      onClick={() => setShow(!show)}>
                    {show ? "Скрыть" : `Показать все +${count - MIN_LENGTH}`}
                </More>
            )}

        </CardWrapper>
    )
}

const TotalTime = ({time, estimate}) => {
    if (!Boolean(time) && !Boolean(estimate)) return null

    let color = '#4260F2'
    if (estimate > 0) {
        color = time <= estimate ? '#11A259' : '#DD0000'
    }

    const renderTotalTime = () => <Time value={formatDuration({ammount: time, short: true})} color={color}/>

    if (estimate > 0) {
        return (
            <Box {...flexCenterProps('center')} gap="2px">
                {renderTotalTime()} / <Time value={formatDuration({
                    ammount: estimate, type: 'minutes', short: true
                })}/>
            </Box>
        )
    }

    return renderTotalTime()
}

const Time = ({value, color = null}) => {
    return (<Typography fontSize={13} color={color}>{value}</Typography>)
}

export default TaskStats