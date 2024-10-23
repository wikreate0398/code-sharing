import { gql } from 'graphql-request'
import { USER_FRAGMENT } from '#root/src/graphql/fragments.js'

export const GET_TRACKING_TYPES = gql`

    query GetTrackingTypes {
        trackingTypes {
            id
            name
            define
            description
        }
    }
`

export const GET_TASK_TRACKING_TIME = gql`
    ${USER_FRAGMENT}
    
    query GetTaskTrackingTime($id_task: Int!) {
        taskTrackingTime(id_task: $id_task) {
            id_user,
            worked_time
            user {
                ...userFields
            }
        }
    }
`

export const GET_DAY_TIME_FOR_EDIT = gql` 
    query GetDayTrackingTimeForEdit($day: String! $id_user: Int) {
        dayTrackingTime(
        day: $day, 
        id_user: $id_user
        ) {
            worked_time
            play
            date 
            id_task
            id_project
            id_board
            task {name}
            project {name,bg} 
            timerActivity(where: {
                AND: [
                    { column: ID_TIMER_RELATIVE, operator: IS_NULL },
                    { column: ID_TIMER_RELATIVE, operator: IS_NULL }
                ]
            }, whereHasActionDefine: {column: DEFINE, operator: EQ, value: start_timer}) {
                id
                id_task
                action {define}
                created_at,
                relative {
                    id
                    id_task
                    action {define}
                    created_at 
                }
            }
            user {
                id_working_task
            }
        }
    }
`

export const GET_TASK_ACTIVITY = gql`
    ${USER_FRAGMENT}

    query GetTaskActivity($id_task: Int!) {
        taskActivity(id_task: $id_task) {
            id
            created_at
            prev_value
            current_value
            user {
                ...userFields
            }
            list {name}
            action {define}
            column {name}
            fromColumn {name}
        }
    }
`

export const GET_TASKS_STATISTICS = gql`
    query GetTasksStatistics($id_project: String, $id_user: Int!, $from: String!, $to: String!) {
        tasksStatistics(id_project: $id_project, id_user: $id_user, from: $from, to: $to) {
            id_project
            id_board
            id_task
            total_worked_time
            last_update
            worked_time
            task {
                estimate_time
                name
            }
            project {
                name 
                bg
            }
        }
    }
`