import React from 'react'
import { useTheme } from '@mui/styles'
import useStyles from '#root/src/components/screens/dashboard/projects/_modal/styles'
import { Stack, Typography } from '@mui/material'
import { useAddEditProjectContext } from '#root/src/components/screens/dashboard/projects/_modal/context'
import BoardParticipants from '#root/src/components/screens/dashboard/projects/_modal/boards/_components/board/board-participants'
import { useDeleteBoardGqlMutation } from '#root/src/redux/api/board.api'
import BoardSettings from '#root/src/components/screens/dashboard/projects/_modal/boards/_components/board/board-settings'
import useGetBoardInfo from '#root/src/components/screens/dashboard/projects/_modal/boards/_hooks/useGetBoardInfo'
import BoardColumns from '#root/src/components/screens/dashboard/projects/_modal/boards/_components/columns/board-columns'
import DeleteButton from '#root/src/components/ui/button/delete-button.jsx'

const BoardInfo = () => {
    const theme = useTheme()

    const { selectedBoardId } = useAddEditProjectContext()

    if (!selectedBoardId)
        return (
            <Typography
                variant="subtitle-13"
                color={theme.palette.neutral.black_50}
                sx={{ margin: 'auto', textAlign: 'center' }}
            >
                Выберите доску <br /> для редактирования
            </Typography>
        )

    return <Container />
}

const Container = () => {
    const classes = useStyles()
    const { setSelectedBoardId } = useAddEditProjectContext()
    const { id_board, board } = useGetBoardInfo()
    const [deleteBoard] = useDeleteBoardGqlMutation()

    const { private: isPrivate, participants = [], columns = [] } = board || {}

    return (
        <Stack className={classes.infoBoxRoot}>
            <BoardSettings />

            <BoardParticipants
                id_board={id_board}
                isPrivate={isPrivate}
                participants={participants}
            />

            <BoardColumns id_board={id_board} columns={columns} />

            <DeleteButton name="Удалить доску"
                          modalText="Вы действительно <br /> хотите удалить доску?"
                          handler={() => {
                              deleteBoard(id_board)
                                  .then((res) => {
                                      let status = res?.data?.deleteBoard
                                      if (status) setSelectedBoardId(null)
                                  })
                          }}/>
        </Stack>
    )
}

export default BoardInfo
