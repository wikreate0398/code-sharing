//@ts-nocheck

import React, { useEffect } from 'react'
import { Collapse, Box, Stack, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ArrowDown from '#root/src/components/ui/svg-icons/icons/arrow-down'
import Avatar from '#root/src/components/ui/avatar'
import moment from 'moment'
import { useLazyGetTaskActivityGqlQuery } from '#root/src/redux/api/traking.api'
import ContainerLoader from '#root/src/components/ui/loader/container-loader'
import { empty, isAnotherYear } from '#root/src/helpers/functions'
import Icon from '#root/src/components/ui/icon'
import classNames from 'classnames'

const ActivityLogs = ({id_task}: {id_task: number}) => {
    const [expanded, setOpen] = React.useState(false)

    const handleClick = () => setOpen((o) => !o)

    const [trigger, result] = useLazyGetTaskActivityGqlQuery()

    useEffect(() => {
        if (expanded) trigger(id_task)
    }, [expanded])

    const {
        data = [],
        isLoading = false
    } = result || {}

    const total = data.length

    return (
        <Stack>
            <Stack
                onClick={handleClick}
                sx={{ cursor: 'pointer' }}
                gap="4px"
                flexDirection="row"
            >
                <Typography variant="subtitle-14" component="p">
                    Активность
                </Typography>
                <ArrowDown active={expanded} />
            </Stack>

            {isLoading && <ContainerLoader height={50} size={20}/>}

            {!empty(data) && (
                <Collapse in={expanded} timeout="auto">
                    <Stack gap="10px" sx={{ padding: '14px 0' }}>
                        {data.map((item, i) => {
                            const { id, user, created_at } = item
                            const {value, description} = info(item)
                            return (
                                <ActivityLog key={id}
                                             user={user}
                                             created_at={created_at}
                                             value={value}
                                             description={description}
                                             isLast={i === total-1}/>
                            )
                        })}
                    </Stack>
                </Collapse>
            )}
        </Stack>
    )
}

const ActivityLog = (props) => {
    const {user, created_at, value, description, isLast = false} = props
    return (
        <Stack sx={{ padding: '0 7px', position: 'relative' }}>
            <ActivityIcon isLast={isLast}/>

            <Stack
                gap="8px"
                flexDirection="row"
                alignItems="flex-start"
                ml="30px"
            >
                <Avatar
                    name={user.name}
                    src={user.avatar_url}
                    size={18}
                    sx={{
                        borderRadius: 6
                    }}
                />
                <Stack rowGap="4px">
                    <Typography
                        variant="subtitle-13"
                        sx={{ fontWeight: 500 }}
                    >
                        {user.name} {value}
                        {Boolean(description) && (
                            <Icon
                                name="info"
                                pointer
                                width={14}
                                height={14}
                                tooltip={{
                                    title: description,
                                    placement: "bottom"
                                }}
                                sx={{
                                    position: 'relative',
                                    top: '2px',
                                    right: '-4px'
                                }}
                            />
                        )}
                    </Typography>

                    <Typography
                        variant="subtitle-12"
                        color="#9499A4"
                        sx={{ letterSpacing: '0.3px' }}
                    >
                        {moment(created_at).format(`D MMM ${isAnotherYear(created_at) ? 'YYYY' : ''} HH:mm`)}
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}

const info = ({action, prev_value, current_value, list, fromColumn, column}) => {
    const { define } = action

    let value = ''
    let description = null

    if (define === 'start_timer') {
        value = 'Запустил(а) таймер'
    }

    if (define === 'stop_timer') {
        value = 'Остановил(а) таймер'
    }

    if (define === 'create_task') {
        value = 'Создал(а) задачу'
    }

    if (define === 'move_task') {
        value = `Переместил(а) задачу из "${fromColumn.name}" в "${column.name}"`
    }

    if (define === 'edit_task_name') {
        value = `Изменил(а) название задачи ${setPrevVal(prev_value)}`
    }

    if (define === 'edit_task_description') {
        if (Boolean(prev_value)) {
            value = `Изменил(а) описание задачи ${setPrevVal(prev_value)}`
        } else {
            value = `Добавил(а) описание задачи`
            description = current_value
        }
    }

    if (define === 'set_task_deadline') {
        value = `Установил(а) дедлайн задачи - ${Boolean(prev_value) ? setPrevVal(prev_value) : current_value}`
    }

    if (define === 'set_task_estimate') {
        value = `Установил(а) оценку времени задачи - ${Boolean(prev_value) ? setPrevVal(prev_value) : current_value} мин`
    }

    if (define === 'add_task_archive') {
        value = `Добавил(а) задачу в архив`
    }

    if (define === 'return_task_archive') {
        value = `Вернул(а) задачу из архива`
    }

    if (define === 'mark_task_urgent') {
        value = `Установил(а) режим "срочная задача"`
    }

    if (define === 'unmark_task_urgent') {
        value = `Снял(а) режим "срочная задача"`
    }

    if (define === 'delete_task') {
        value = `Удалил(а) задачу`
    }

    // List group

    if (define === 'create_checklist_group') {
        value = `Создал(а) список ${current_value}`
    }

    if (define === 'update_checklist_group') {
        value = `Изменил(а) список ${setPrevVal(prev_value)}`
    }

    if (define === 'mark_checklist') {
        value = `Отметил(а) чеклист - ${getChecklistState(current_value)}`
        description = list.name
    }

    if (define === 'delete_checklist_group') {
        value = `Удалил(а) список`
        description = current_value
    }

    // Checklist

    if (define === 'add_checklist') {
        value = `Создал(а) чеклист`
        description = current_value
    }

    if (define === 'update_checklist') {
        value = `Изменил(а) чеклист ${setPrevVal(prev_value)}`
    }

    if (define === 'delete_checklist') {
        value = `Удалил(а) чеклист`
        description = current_value
    }

    // Comment

    if (define === 'add_comment') {
        value = `Добавил(а) комментарий`
        description = current_value
    }

    if (define === 'update_comment') {
        value = `Изменил(а) комментарий ${setPrevVal(prev_value)}`
    }

    if (define === 'delete_comment') {
        value = `Удалил(а) комментарий`
        description = current_value
    }

    return { value, description }
}

const getChecklistState = (state) => {
    if (Number(state) === 1) return 'Снята'
    if (Number(state) === 2) return 'Выполнено'
    if (Number(state) === 3) return 'Зачеркнуто'
}

const setPrevVal = (value) => {
    if (Boolean(value)) return `(с ${value})`
}

const useStyles = makeStyles(() => ({
    root: {
        position: 'absolute',
        top: '-1px',
        height: '100%',

        '&:after': {
            content: '""',
            display: 'block',
            width: '0.5px',
            height: '100%',
            position: 'relative',
            backgroundColor: '#E8E9EE',
            top: '-6px',
            left: '4.4px'
        },

        '&.last:after': {
            content: '""',
            display: 'none'
        }
    }
}))

const ActivityIcon = ({isLast}) => {
    const classes = useStyles()

    return (
         <Box className={classNames(classes.root, {last: isLast})}>
             <svg
                 width="10"
                 height="10"
                 viewBox="0 0 10 10"
                 fill="none"
                 xmlns="http://www.w3.org/2000/svg"
             >
                 <circle cx="5" cy="5" r="5" fill="#F3F4F7" />
                 <circle cx="5" cy="5" r="1" fill="#191919" />
             </svg>
         </Box>
    )
}


export default ActivityLogs
