import React from 'react'
import useStyles from '#root/src/components/screens/dashboard/projects/_modal/styles'
import { useAddEditProjectContext } from '#root/src/components/screens/dashboard/projects/_modal/context'
import {
    useGetFormBoardsGqlQuery,
    useSortBoardGqlMutation
} from '#root/src/redux/api/board.api'
import { Stack } from '@mui/material'
import ContainerLoader from '#root/src/components/ui/loader/container-loader'
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable'
import BoardItem from '#root/src/components/screens/dashboard/projects/_modal/boards/_components/board/board-item'

const BoardsList = () => {
    const classes = useStyles()
    const { id_project, selectedBoardId, setSelectedBoardId } =
        useAddEditProjectContext()

    const {
        data = []
    } = useGetFormBoardsGqlQuery(id_project, {
        refetchOnMountOrArgChange: true
    })

    const [sortBoardGql] = useSortBoardGqlMutation()

    const boards = data?.boards || []

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    const handleDragEnd = (event) => {
        const { active, over } = event

        if (active.id !== over.id) {
            const oldIndex = boards.findIndex(
                (v) => parseInt(v.id) === parseInt(active.id)
            )
            const newIndex = boards.findIndex(
                (v) => parseInt(v.id) === parseInt(over.id)
            )

            sortBoardGql({ id: active.id, oldIndex, newIndex, id_project })
        }
    }

    // if (loading)
    //     return (
    //         <Stack className={classes.leftPanellist}>
    //             <ContainerLoader overlay size={40} />
    //         </Stack>
    //     )
    //
    // if (noData) return null

    return (
        <Stack className={classes.leftPanellist}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={boards}
                    strategy={verticalListSortingStrategy}
                >
                    {boards.map((item, k) => {
                        let id = item?.id
                        return (
                            <BoardItem
                                key={id}
                                index={id}
                                item={item}
                                onSelect={() => setSelectedBoardId(id)}
                                isSelected={selectedBoardId === id}
                                sx={{ padding: '0 32px' }}
                            />
                        )
                    })}
                </SortableContext>
            </DndContext>
        </Stack>
    )
}

export default BoardsList
