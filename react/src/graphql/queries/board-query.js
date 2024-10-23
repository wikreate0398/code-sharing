import { gql } from 'graphql-request'

export const GET_BOARD_QUERY = gql`
    query GetBoard($id: ID!) {
        board(id: $id) {
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
    }
`

export const GET_KANBAN_BOARD_QUERY = gql`
    query GetBoard($id: ID!) {
        board(id: $id) { 
            id
            id_project
            name
        }
    }
`

export const GET_BOARDS_QUERY = gql`
    query GetBoards($id_project: ID!) {
        boards(id_project: $id_project) {
            id
            name
            participants_count
            position
            private
        }
    }
`
