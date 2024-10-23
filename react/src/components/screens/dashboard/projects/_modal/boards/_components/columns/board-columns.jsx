import React from 'react'
import useStyles from '#root/src/components/screens/dashboard/projects/_modal/styles'
import {
    useAddBoardColumnGqlMutation,
    useDeleteBoardColumnGqlMutation
} from '#root/src/redux/api/column.api'
import FormGroup from '#root/src/components/screens/dashboard/projects/_modal/_components/form-group'
import ColumnItem from '#root/src/components/screens/dashboard/projects/_modal/boards/_components/columns/column-item'
import { Stack } from '@mui/material'
import Autocomplete from '#root/src/components/screens/dashboard/projects/_modal/_components/autocomplete'

const BoardColumns = ({ id_board, columns }) => {
    const classes = useStyles()

    const [addBoardColumn] = useAddBoardColumnGqlMutation()
    const [deleteBoardColumn] = useDeleteBoardColumnGqlMutation()

    const handleAddBoardColumn = async (name, onSuccess) => {
        addBoardColumn({ id_board, name }).then(() => {
            onSuccess && onSuccess()
        })
    }

    const handleDeleteBoardColumn = async (id) => {
        await deleteBoardColumn(id)
    }

    return (
        <FormGroup label="СТОЛБЦЫ" gap="6px">
            {columns.map((item) => {
                const id = item.id
                return (
                    <ColumnItem
                        key={id}
                        item={item}
                        onDelete={() => handleDeleteBoardColumn(id)}
                    />
                )
            })}

            <Stack className={classes.boardInfoCard}>
                <Autocomplete
                    noBorder
                    labelInside
                    label="Добавить столбец"
                    searchable={false}
                    onPressEnter={handleAddBoardColumn}
                    sx={{
                        margin: '0!important',
                        borderBottom: 'none!important'
                    }}
                />
            </Stack>
        </FormGroup>
    )
}

export default BoardColumns
