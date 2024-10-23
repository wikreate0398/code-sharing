import { gql } from 'graphql-request'

export const CREATE_BOARD_MUTATION = gql`
    mutation CreateBoard($id_project: ID!, $name: String!, $participants: [Int]) {
        createBoard(id_project: $id_project, name: $name, participants: $participants) {
            id
        }
    }
`
export const DELETE_BOARD_MUTATION = gql`
    mutation DeleteBoard($id: ID!) {
        deleteBoard(id: $id)
    }
`

export const SORT_BOARD_MUTATION = gql`
    mutation SortBoard($id: ID!, $position: Int!) {
        sortBoard(id: $id, position: $position)
    }
`

export const UPDATE_BOARD_MUTATION = gql`
    mutation UpdateBoard($id: ID!, $name: String!, $private: Boolean!, $participants: [Int]) {
        updateBoard(input: { id: $id, name: $name, private: $private, participants: $participants }) {
            name
            id_project
        }
    }
`

/* Participants */

export const CREATE_BOARD_PARTICIPANT_MUTATION = gql`
    mutation CreateBoardParticipant($id_board: ID!, $id_participant: ID!) {
        createBoardParticipant(
            id_board: $id_board
            id_participant: $id_participant
        )
    }
`

export const DELETE_BOARD_PARTICIPANT_MUTATION = gql`
    mutation DeleteBoardParticipant($id_board: ID!, $id_participant: ID!) {
        deleteBoardParticipant(
            id_board: $id_board
            id_participant: $id_participant
        )
    }
`
