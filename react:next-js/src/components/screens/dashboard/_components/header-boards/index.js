import React, { useCallback, useContext, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useFetchBoardsQuery } from '@/redux/api/board.api'
import ProjectAvatar from '@/components/ui/project-avatar'
import PlusBtn from '@/components/ui/plus-btn'
import AddEditModal from '@/components/screens/dashboard/project/board/_components/add-edit-modal'
import { empty } from '@/helpers/functions'
import { useParams, useRouter } from 'next/navigation'
import { boardRoute, projectRoute } from '@/config/routes'
import { ProjectProviderContext } from '@/providers/project-provider'
import { TabItem, Tabs } from '@/components/ui/tabs'

const HeaderBoards = ({ project }) => {
    const { isOwner } = useContext(ProjectProviderContext)
    const { push } = useRouter()
    const { id_board } = useParams()
    const [open, setOpen] = useState(false)
    const handler = useCallback(() => setOpen(!open), [open])

    const { data: boards, isLoading } = useFetchBoardsQuery(
        parseInt(project.id)
    )

    if (isLoading) return null

    return (
        <Tabs>
            <TabItem active={!id_board} padding="10px 0 !important">
                <ProjectAvatar
                    size={24}
                    bg={project.bg}
                    name={project?.name}
                    onClick={() => push(projectRoute(project.id))}
                />
            </TabItem>
            {boards.map(({ id, id_project, name }) => {
                return (
                    <TabItem
                        key={id}
                        active={parseInt(id_board) === id}
                        onClick={() => push(boardRoute(id_project, id))}
                    >
                        {name}
                    </TabItem>
                )
            })}

            {isOwner && (
                <>
                    <Box onClick={handler} style={{ cursor: 'pointer' }}>
                        <PlusBtn />
                        {empty(boards) ? (
                            <Typography ml="10px" variant="small-gray">
                                Добавить доску
                            </Typography>
                        ) : null}
                    </Box>
                    <AddEditModal open={open} handler={handler} />
                </>
            )}
        </Tabs>
    )
}

export default HeaderBoards
