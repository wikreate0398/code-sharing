import { gql } from 'graphql-request'
import { USER_FRAGMENT, USER_LINKED_PROJECTS_FRAGMENT } from '#root/src/graphql/fragments'

export const GET_USER_BY_ID = gql`
    ${USER_FRAGMENT}
    ${USER_LINKED_PROJECTS_FRAGMENT}

    query GetUserByIdent($id: ID!) {
        userById(id: $id) {
            ...userFields
            skills {id,name}
            ...userLinkedProjectsFields
        }
    }
`

export const GET_USER_BY_LOGIN = gql`
    ${USER_FRAGMENT}
    ${USER_LINKED_PROJECTS_FRAGMENT}

    query GetUserByIdent($login: String!, $withTrashed: Boolean) {
        userByLogin(login: $login, withTrashed: $withTrashed) {
            ...userFields
            skills {id,name} 
            ...userLinkedProjectsFields
        }
    }
`
