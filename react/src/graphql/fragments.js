import { gql } from 'graphql-request'

export const COLUMN_RELATION_FRAGMENT = gql`
    fragment columnTaskFields on ColumnTasks {
        id_board
        id_column
        id_task
        position
    }
`

export const USER_FRAGMENT = gql`
    fragment userFields on User {
        id
        name
        login
        avatar_url
    }
`

export const USER_LINKED_PROJECTS_FRAGMENT = gql`
    fragment userLinkedProjectsFields on User {
        linkedProjects(where: {
            OR: [
                { column: DELETED_AT, operator: IS_NOT_NULL },
                { column: DELETED_AT, operator: IS_NULL }
            ]
        }, hasTracking: {column: WORKED_TIME, operator: GTE, value: 60}) {id,name,bg}
    }
`

export const TASK_LIST_COMMENT_FRAGMENT = gql`
    fragment taskListCommentFields on TaskListComment {
        id
        id_parent
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
`

export const CHECKLIST = gql`
    ${TASK_LIST_COMMENT_FRAGMENT}
    
    fragment checklist on TaskList {
        id
        id_task
        id_group
        name
        state
        position
        comments {
            ...taskListCommentFields
        }
    }
`

export const CHECKLIST_GROUP = gql`
    ${CHECKLIST}

    fragment checklistGroup on TaskListGroup {
        id
        name
        list {
            ...checklist
        }
    }
`

export const TASK_TAG_FRAGMENT = gql`

    fragment taskTagFields on TaskTag {
        id
        id_project
        name
        color
        position
    }
`

export const TASK_IN_COLUMN_FRAGMENT = gql`
    ${COLUMN_RELATION_FRAGMENT}
    ${USER_FRAGMENT}

    fragment taskInColumnFields on Task {
        id
        name
        urgent
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
`

export const TASK_FRAGMENT = gql`
    ${USER_FRAGMENT}
    ${CHECKLIST_GROUP}
    
    fragment taskFields on Task {
        id
        id_project
        name
        url
        urgent
        archive
        comment
        estimate_time
        deadline_at
        created_at
        participants {
            ...userFields
        }
        author {
            ...userFields
        }
        columns_relations {
            id_task
            id_board
            id_column
            position
        }
        listGroups {
            ...checklistGroup
        }
        tags {
            id
        }
    }
`