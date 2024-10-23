import React from 'react'
import { Stack } from '@mui/material'
import useStyles from '#root/src/components/screens/dashboard/projects/_modal/styles'
import AddBoard from '#root/src/components/screens/dashboard/projects/_modal/boards/_components/board/add-board'
import BoardsList from '#root/src/components/screens/dashboard/projects/_modal/boards/_components/boards-list'
import BoardInfo from '#root/src/components/screens/dashboard/projects/_modal/boards/_components/board-info'

const ProjectBoards = ({ children: header }) => {
    const classes = useStyles()

    return (
        <Stack flexDirection="row" className={classes.largeModal}>
            <Stack className={classes.modalLeftPanel}>
                {header}
                <AddBoard />
                <BoardsList />
            </Stack>
            <Stack className={classes.modalRightPanel}>
                <BoardInfo />
            </Stack>
        </Stack>
    )
}

export default ProjectBoards
