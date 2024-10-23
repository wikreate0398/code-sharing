import { gql } from 'graphql-request'
import {
    COLUMN_RELATION_FRAGMENT,
    USER_FRAGMENT,
    TASK_IN_COLUMN_FRAGMENT,
    TASK_TAG_FRAGMENT
} from '#root/src/graphql/fragments'

export const CREATE_TASK_MUTATION = gql`
    ${TASK_IN_COLUMN_FRAGMENT}

    mutation CreateTask($id_column: Int!, $name: String!) {
        createTask(id_column: $id_column, name: $name) {
            ...taskInColumnFields
        }
    }
`

export const UPDATE_TASK_MUTATION = gql`
    ${COLUMN_RELATION_FRAGMENT}
    ${USER_FRAGMENT}

    mutation UpdateTask($input: UpdateTaskInput!) {
        updateTask(input: $input) {
            id
            name
            url
            comment
            urgent
            deadline_at
            archive
            estimate_time
            comments_count
            participants {
                ...userFields
            }
            columns_relations {
                ...columnTaskFields
            }
            tags {
                id
            }
        }
    }
`

export const CREATE_CHECKLIST_GROUP = gql`
    mutation CreateTaskListGroup($name: String!, $id_task: Int!) {
        createTaskListGroup(name: $name, id_task: $id_task) {
            id
            name
            list {
                id
                comments {
                    id
                }
            }
        }
    }
`

export const DELETE_CHECKLIST_GROUP = gql`
    mutation DeleteTaskListGroup($id: ID!) {
        deleteTaskListGroup(id: $id)
    }
`

export const UPDATE_CHECKLIST_GROUP = gql`
    mutation UpdateTaskListGroup($id: ID!, $name: String!) {
        updateTaskListGroup(id: $id, name: $name) {
            id
            name
        }
    }
`

export const CREATE_TASK_TAG_MUTATION = gql`
    ${TASK_TAG_FRAGMENT}

    mutation CreateTaskTag($id_task: Int!, $name: String!, $color: String!) {
        createTaskTag(id_task: $id_task, name: $name, color: $color) {
            ...taskTagFields
        }
    }
`

export const UPDATE_TASK_TAG_MUTATION = gql`
    ${TASK_TAG_FRAGMENT}

    mutation UpdateTaskTag($id: ID!, $name: String, $color: String, $position: Int) {
        updateTaskTag(input: {id: $id, name: $name, color: $color, position: $position}) {
            ...taskTagFields
        }
    }
`

export const MOVE_TASK_TAG_MUTATION = gql` 
mutation MoveTaskTag($from: ID!, $to: ID!) {
        moveTaskTag(from: $from, to: $to)
    }
`

export const DELETE_TASK_TAG_MUTATION = gql`
    mutation DeleteTaskTag($id: ID!) {
        deleteTaskTag(id: $id)
    }
`

export const ATTACH_TAG_TO_TASK_MUTATION = gql`
    ${TASK_IN_COLUMN_FRAGMENT}
    
    mutation AttachTaskTag($id_tag: ID!, $id_task: ID!) {
        attachTaskTag(id_tag: $id_tag, id_task: $id_task) {
            ...taskInColumnFields
        }
    }
`

// Comment

export const DELETE_TASK_CHECKLIST_COMMENT = gql`
    mutation DeleteTaskListComment($id: ID!) {
        deleteTaskListComment(id: $id) {
            id
            id_task
            id_list
            id_user 
        }
    }
`

export const UPDATE_TASK_CHECKLIST_COMMENT = gql`
    ${USER_FRAGMENT}
    mutation UpdateTaskListGroup($id: ID!, $text: String!) {
        updateTaskListComment(id: $id, text: $text) {
            id
            id_task
            id_list
            id_user
            comment
            created_at
            updated_at 
            user {
                ...userFields
            }
        }
    }
`