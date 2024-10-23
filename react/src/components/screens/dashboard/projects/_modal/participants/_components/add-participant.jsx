import React, { memo, useCallback } from 'react'
import { isFnc, pluck, searchData } from '#root/src/helpers/functions'
import { useGetRequest } from '#root/src/services/rest/rest'
import { useAddEditProjectContext } from '#root/src/components/screens/dashboard/projects/_modal/context'
import Autocomplete from '#root/src/components/screens/dashboard/projects/_modal/_components/autocomplete'
import { useNotify } from '#root/src/helpers/hooks.js'

const AddParticipant = memo(
    ({
        id_project = null,
        id_board = null,
        id_column = null,
        handleSelect,
        currentAdded = [],
        label = 'Добавить участника',
        ...props
    }) => {
        const getRequest = useGetRequest()
        const notify = useNotify()

        const ids = pluck(currentAdded, 'id')

        const onSearchReq = useCallback(
            async (search) => {
                return await getRequest('participants/search', {
                    search,
                    id_project,
                    id_board,
                    id_column,
                    ids: ids.join(',')
                })
            },
            [getRequest, id_project, id_board, id_column, ids]
        )

        const onSelect = useCallback(
            (item, onSuccess = () => null) => {
                let id_participant = item.id

                handleSelect(id_participant, () => {
                    onSuccess && onSuccess()
                    notify('Участник добавлен')
                })
            },
            [handleSelect]
        )

        return (
            <Autocomplete
                label={label}
                onSearchReq={onSearchReq}
                onSelect={onSelect}
                {...props}
            />
        )
    }
)

export default AddParticipant
