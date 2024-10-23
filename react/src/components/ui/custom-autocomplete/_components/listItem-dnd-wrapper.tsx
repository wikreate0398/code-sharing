import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import DragIcon from '#root/src/components/ui/svg-icons/icons/drag-icon'

const ListItemDndWrapper = ({ id, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id
    })

    return React.cloneElement(children, {
        setNodeRef,
        style: {
            transition,
            transform: CSS.Translate.toString(transform),
            zIndex: isDragging ? 999 : 'unset',
            position: 'relative'
        },
        icon: (
            <DragIcon
                ref={setActivatorNodeRef}
                {...listeners}
                {...attributes}
            />
        )
    })
}

export default ListItemDndWrapper
