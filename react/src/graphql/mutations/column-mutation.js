import { gql } from 'graphql-request'

export const CREATE_BOARD_COLUMN = gql`
    mutation CreateBoardColumn($id_board: ID!, $name: String!) {
        createBoardColumn(id_board: $id_board, name: $name) {
            name
            id
        }
    }
`

export const DELETE_BOARD_COLUMN = gql`
    mutation DeleteBoardColumn($id: ID!) {
        deleteBoardColumn(id: $id)
    }
`

export const UPDATE_BOARD_COLUMN_MUTATION = gql`
    mutation UpdateBoardColumn($id: ID!, $name: String, $emoji: String) {
        updateBoardColumn(id: $id, name: $name, emoji: $emoji) {
            name
            emoji
        }
    }
`

/* Responsible */
export const CREATE_COLUMN_RESPONSIBLE = gql`
    mutation CreateColumnResponsible($id_column: ID!, $id_responsible: ID!) {
        createColumnResponsible(
            id_column: $id_column
            id_responsible: $id_responsible
        ) {
            name
            login
        }
    }
`

export const DELETE_COLUMN_RESPONSIBLE = gql`
    mutation DeleteColumnResponsible($id_column: ID!, $id_responsible: ID!) {
        deleteColumnResponsible(
            id_column: $id_column
            id_responsible: $id_responsible
        )
    }
`
