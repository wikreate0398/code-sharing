import { gql } from 'graphql-request'
import { TASK_FRAGMENT, TASK_TAG_FRAGMENT } from '#root/src/graphql/fragments'

export const GET_TASK = gql`
    ${TASK_FRAGMENT}

    query GetTask($id: ID!) {
        task(id: $id) {
            ...taskFields
        }
    }
`

export const GET_TASK_TAGS = gql`
    ${TASK_TAG_FRAGMENT}
    
    query GetTaskTag($id_project: Int!) {
        taskTags(id_project: $id_project) {
            ...taskTagFields
        }
    }
`
