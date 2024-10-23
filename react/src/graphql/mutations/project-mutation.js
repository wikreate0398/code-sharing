import { gql } from 'graphql-request'


export const DELETE_PROJECT_MUTATION = gql`
    mutation DeleteProject($id: ID!) {
        deleteProject(id: $id)
    }
`
