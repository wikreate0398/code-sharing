import React, { useEffect, useState } from 'react'
import { useAddEditProjectContext } from '#root/src/components/screens/dashboard/projects/_modal/context'
import useGetBoardInfo from '#root/src/components/screens/dashboard/projects/_modal/boards/_hooks/useGetBoardInfo'
import { useUpdateBoardGqlMutation } from '#root/src/redux/api/board.api'
import useDebouncedCallback from '#root/src/hooks/useDebouncedCallback'

const useBoardSettings = () => {
    const { id_project } = useAddEditProjectContext()
    const { board } = useGetBoardInfo()

    const [updateBoard] = useUpdateBoardGqlMutation()

    const { id: id_board, name, private: isPrivate } = board || {}
    const [initialField, setInitialField] = useState({
        name,
        private: isPrivate
    })

    useEffect(() => {
        setInitialField({ name, private: isPrivate })
    }, [name, isPrivate])

    const handleUpdateField = async (key, val) => {
        await updateBoard({
            id: id_board,
            private: isPrivate,
            name,

            // this will override the name or private value
            [key]: val,
            id_project
        })
    }

    const handleDelayUpadateReq = useDebouncedCallback(handleUpdateField, 500)

    const handleEditField = (key, val) => {
        setInitialField((old) => ({ ...old, [key]: val }))

        if (val !== undefined || val !== '') handleDelayUpadateReq(key, val)
    }

    return { initialField, handleEditField }
}

export default useBoardSettings
