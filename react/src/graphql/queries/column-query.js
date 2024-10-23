import { gql } from 'graphql-request'
import { TASK_IN_COLUMN_FRAGMENT } from '#root/src/graphql/fragments'

export const GET_COLUMNS = gql`
    ${TASK_IN_COLUMN_FRAGMENT}

    query GetColumns($id_board: Int!) {
        columns(id_board: $id_board) {
            id
            name
            emoji
            position
            tasks {
                ...taskInColumnFields
                pivot {
                    ...columnTaskFields
                }
            }
        }
    }
`
