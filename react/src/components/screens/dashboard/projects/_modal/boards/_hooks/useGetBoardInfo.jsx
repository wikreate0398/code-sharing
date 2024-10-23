import React from 'react'
import { useAddEditProjectContext } from '#root/src/components/screens/dashboard/projects/_modal/context'
import { useGetFormBoardGqlQuery } from '#root/src/redux/api/board.api'

const useGetBoardInfo = () => {
    const { id_project, selectedBoardId } = useAddEditProjectContext()

    const { data } = useGetFormBoardGqlQuery(selectedBoardId, {
        refetchOnMountOrArgChange: true
    })

    const board = data?.board

    const { id: id_board } = board || {}

    return { board, id_board, id_project }
}

export default useGetBoardInfo
