import React, { useCallback } from 'react'
import Autocomplete from '#root/src/components/screens/dashboard/projects/_modal/_components/autocomplete'
import { useCreateBoardGqlMutation } from '#root/src/redux/api/board.api'
import { useAddEditProjectContext } from '#root/src/components/screens/dashboard/projects/_modal/context'
import { useNotify } from '#root/src/helpers/hooks.js'

const AddBoard = () => {
    const { id_project } = useAddEditProjectContext()

    const [addBoardReq] = useCreateBoardGqlMutation()
    const notify = useNotify()

    const handleSubmit = useCallback(
        async (name, onSuccess) => {
            await addBoardReq({ id_project, name }).then(() => {
                onSuccess && onSuccess()
                notify('Доска добавлена')
            })
        },
        [id_project]
    )

    return (
        <Autocomplete
            label="Добавить доску"
            searchable={false}
            onPressEnter={handleSubmit}
        />
    )
}

export default AddBoard
