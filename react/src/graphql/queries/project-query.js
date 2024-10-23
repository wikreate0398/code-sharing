import { gql } from 'graphql-request'
import {
    COLUMN_RELATION_FRAGMENT,
    TASK_FRAGMENT,
    TASK_IN_COLUMN_FRAGMENT,
    TASK_TAG_FRAGMENT,
    USER_FRAGMENT
} from '#root/src/graphql/fragments'

export const GET_PROJECT = gql`
    ${TASK_FRAGMENT}

    query GetProject($id: ID!) {
        project(id: $id) {
            id
            id_owner
            name
            url
            description
            service_description
            link
            bg
            logo
            owner {
                id
                name
                login
                avatar_url
            }
            created_at
            deleted_at
            updated_at
            taskTags {
                id
                id_project
                name
                color
                position
            }
            tasks {
                ...taskFields
            }
            boards {
                columns {
                    position
                    name
                    id_board
                    id
                    deleted_at
                    created_at
                    emoji
                    responsible {
                        avatar_url
                        email
                        id
                        login
                        name
                    }
                }
                id
                id_project
                name
                participants_count
                position
                private
                participants {
                    avatar_url
                    email
                    id
                    login
                    name
                }
            }
            data {
                id_user
                tracking_type {
                    define
                }
                user {
                    id
                    name
                    login
                    avatar_url
                }
            }
            participants {
                id_user
                user {
                    id
                    name
                    login
                    avatar_url
                }
            }
        }
    }
`
// ${TASK_IN_COLUMN_FRAGMENT}
export const GET_USER_PROJECTS = gql`
    ${COLUMN_RELATION_FRAGMENT}
    ${USER_FRAGMENT}
    ${TASK_TAG_FRAGMENT}

    query GetUserProjects {
        projects {
            id
            id_owner
            name
            url
            bg
            boards {
                id
                name
            }
            data {
                pin
                updated_at
                tracking_type {
                    define
                }
            }
            tasks {
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
            taskTags {
                ...taskTagFields
            }
        }
    }
`

export const GET_PROJECTS_FOR_DROPDOWN = gql`
    query GetUserProjects {
        projects {
            id
            id_owner
            name
        }
    }
`

export const GET_EDIT_PROJECT = gql`
    query GetEditProject($id: ID!) {
        project(id: $id) {
            id
            name
            bg
            link
            description
        }
    }
`
