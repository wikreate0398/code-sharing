import { gql } from 'graphql-request'

export const GET_PROJECT_PARTICIPANTS = gql`
    query GetProjectParticipants($id_project: ID!) {
        project_participants(id_project: $id_project) {
            id_user
            user {
                id
                name
                login
                avatarUrl
            }
        }
    }
`
