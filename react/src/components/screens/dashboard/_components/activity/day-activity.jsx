import React, { useContext, useEffect, useMemo } from 'react'
import { Alert, Box, Chip } from '@mui/material'
import { dateFormat, empty, flexStartProps } from '#root/src/helpers/functions'
import { makeStyles } from '@mui/styles'
import { ActivityContextProvider } from '#root/src/components/screens/dashboard/_components/activity/index'
import { Table, Thead, Tbody, Tr, Th, Td } from '#root/src/components/ui/table'
import { useLazyGetActivityQuery } from '#root/src/redux/api/statistics.api'
import Icon from '#root/src/components/ui/icon'
import ProjectAvatar from '#root/src/components/ui/project-avatar'

const useStyles = makeStyles((theme) => ({
    root: {
        maxHeight: 400,
        overflow: 'auto',
        ...theme.palette.scrollbar()
    },

    popover: {
        padding: '10px',
        maxWidth: '500px',
        boxSizing: 'border-box',

        '& .item': {
            // marginBottom: '10px',
            fontSize: '13px'
        }
    }
}))

const DayActivity = () => {
    const {
        day,
        id_project,
        login, handleEditModal
    } = useContext(ActivityContextProvider)
    const classes = useStyles()
    const [trigger, result] = useLazyGetActivityQuery()

    const data = result?.data ?? []

    useEffect(() => {
        trigger({ id_project, login, day })
    }, [day, id_project])

    if (result?.isLoading) return null

    if (empty(data))
        return (
            <Alert severity="info" sx={{ width: '100%' }}>
                Активность не обнаружена
            </Alert>
        )
    
    return (
        <Box className={classes.root}>
            
            <Box style={{
                textDecoration: 'underline',
                color: '#3c92f6',
                cursor: 'pointer'
            }} ml="15px" onClick={handleEditModal}>
                Редактировать время
            </Box>

            <Table>
                <Thead>
                    <Tr>
                        {!id_project && <Th>Проект</Th>}
                        <Th>Доска</Th>
                        <Th>Время</Th>
                        <Th>Действие</Th>
                        <Th>Детали</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((value) => (
                        <Row
                            value={value}
                            key={value.id}
                            id_project={id_project}
                        />
                    ))}
                </Tbody>
            </Table>
        </Box>
    )
}

const Row = ({ value, id_project }) => {
    const { created_at, project, action, board, from_column, column, task } =
        value

    const needShowInfo = useMemo(() => {
        return (
            Boolean(value.task?.id) ||
            Boolean(value.list?.id) ||
            Boolean(value.comment?.id)
        )
    }, [value])

    const style = {
        paddingRight: '40px !important',
        fontSize: '13px !important'
    }

    return (
        <Tr>
            {!id_project && (
                <Td style={style}>
                    <ProjectAvatar
                        bg={project.bg}
                        size={20}
                        name={project?.name}
                    />
                </Td>
            )}
            <Td style={style}>{board?.name}</Td>
            <Td style={style}>{dateFormat(created_at, 'HH:mm:ss')}</Td>
            <Td style={style}>{action.name}</Td>
            <Td>
                <Box {...flexStartProps('center')} gap="5px">
                    {Boolean(task?.id) && (
                        <Chip
                            label={`Таск: #${task.id}`}
                            variant="outlined"
                            size="small"
                        />
                    )}
                    {from_column?.id ? (
                        <Chip
                            label={`Колонка: ${from_column.name} -> ${column.name}`}
                            variant="outlined"
                            size="small"
                        />
                    ) : (
                        Boolean(column?.id) && (
                            <Chip
                                label={`Колонка: ${column.name}`}
                                variant="outlined"
                                size="small"
                            />
                        )
                    )}
                    {needShowInfo && <InfoPopup value={value} />}
                </Box>
            </Td>
        </Tr>
    )
}

const InfoPopup = ({ value }) => {
    const classes = useStyles()

    const { action, task, list, comment, payload } = value

    const PopoverItem = ({ children }) => {
        return <Box className="item">{children}</Box>
    }

    const getState = (state) => {
        if (Number(state) === 1) return 'Снята'
        if (Number(state) === 2) return 'Отмечено'
        if (Number(state) === 3) return 'Зачеркнуто'
    }

    return (
        <Icon
            name="info"
            pointer
            width={14}
            height={14}
            tooltip={{
                title: (
                    <Box className={classes.popover}>
                        {Boolean(task?.id) && (
                            <PopoverItem><Box component="strong">Такс:</Box> {task.name}</PopoverItem>
                        )}
                        {Boolean(list?.id) && (
                            <PopoverItem>
                                <Box component="strong">Чеклист:</Box> {list.name}
                                {action.define === 'mark_checklist' && (
                                    <>
                                        - {getState(list.state)}
                                    </>
                                )}
                            </PopoverItem>
                        )}
                        {Boolean(comment?.id) && (
                            <PopoverItem>
                                <Box component="strong">Комментарий:</Box> {comment.comment}
                            </PopoverItem>
                        )}
                    </Box>
                )
            }}
        />
    )
}

export default DayActivity
