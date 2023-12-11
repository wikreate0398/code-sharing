import { useContext, useEffect, useMemo } from 'react'
import { Alert, Box, Chip, Popover } from '@mui/material'
import { dateFormat, empty, flexStartProps } from '@/helpers/functions'
import { makeStyles } from '@mui/styles'
import { ActivityContextProvider } from '@/components/screens/dashboard/_components/activity/index'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/table'
import { useLazyGetActivityQuery } from '@/redux/api/time.traking.api'
import Icon from '@/components/ui/icon'
import PopupState, { bindPopover } from 'material-ui-popup-state'
import { bindHover } from 'material-ui-popup-state/hooks'
import ProjectAvatar from '@/components/ui/project-avatar'

const useStyles = makeStyles(() => ({
    root: {
        marginTop: '30px'
    },

    popover: {
        padding: '15px 15px 5px 15px',
        maxWidth: '500px',
        boxSizing: 'border-box',

        '& .item': {
            marginBottom: '10px',
            fontSize: '13px'
        }
    }
}))

const DayActivity = () => {
    const { day, id_project, login } = useContext(ActivityContextProvider)
    const classes = useStyles()
    const [trigger, result] = useLazyGetActivityQuery()

    const data = result?.data ?? []

    useEffect(() => {
        trigger({ id_project, login, day })
    }, [day, id_project])

    if (result?.isLoading) return null

    return (
        <Box className={classes.root}>
            {!empty(data) ? (
                <Table>
                    <Thead>
                        <Tr>
                            {!id_project && <Th width="20px" />}
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
            ) : (
                <Alert severity="info">Активность не обнаружена</Alert>
            )}
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

    return (
        <Tr>
            {!id_project && (
                <Td width="20px">
                    <ProjectAvatar
                        bg={project.bg}
                        size={20}
                        name={project?.name}
                    />
                </Td>
            )}
            <Td>{board?.name}</Td>
            <Td color="rgba(0, 0, 0, .33)">
                {dateFormat(created_at, 'HH:mm:ss')}
            </Td>
            <Td>{action.name}</Td>
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
        if (state === 1) return 'Снята'
        if (state === 2) return 'Отмечено'
        if (state === 2) return 'Зачеркнуто'
    }

    return (
        <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
                <>
                    <Icon
                        name="info"
                        pointer
                        width={14}
                        height={14}
                        {...bindHover(popupState)}
                    />
                    <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left'
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                        }}
                    >
                        <Box className={classes.popover}>
                            {Boolean(task?.id) && (
                                <PopoverItem>Такс: {task.name}</PopoverItem>
                            )}
                            {Boolean(list?.id) && (
                                <PopoverItem>
                                    Чеклист: {list.name}
                                    {action.define === 'mark_checklist' && (
                                        <>
                                            &nbsp;
                                            <Chip
                                                label={getState(payload.state)}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </>
                                    )}
                                </PopoverItem>
                            )}
                            {Boolean(comment?.id) && (
                                <PopoverItem>
                                    Комментарий: {comment.comment}
                                </PopoverItem>
                            )}
                        </Box>
                    </Popover>
                </>
            )}
        </PopupState>
    )
}

export default DayActivity
