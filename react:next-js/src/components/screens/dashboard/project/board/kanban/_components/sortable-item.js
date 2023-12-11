import { useSortable } from '@dnd-kit/sortable'
import { useMountStatus } from '@/components/screens/dashboard/project/board/kanban/hooks'
import { Item } from '@/components/screens/dashboard/project/board/kanban/_components/item'
import React from 'react'

const SortableItem = ({ data, disabled, index, handle }) => {
    const {
        setNodeRef,
        setActivatorNodeRef,
        listeners,
        isDragging,
        isSorting,
        transform,
        transition
    } = useSortable({
        id: data.id,
        data: {
            uid: data.uid,
            uid_column: data.id_column
        }
    })
    const mounted = useMountStatus()
    const mountedWhileDragging = isDragging && !mounted

    return (
        <Item
            ref={disabled ? undefined : setNodeRef}
            data={data}
            dragging={isDragging}
            sorting={isSorting}
            handle={handle}
            handleProps={handle ? { ref: setActivatorNodeRef } : undefined}
            index={index}
            transition={transition}
            transform={transform}
            fadeIn={mountedWhileDragging}
            listeners={listeners}
        />
    )
}

export default SortableItem
