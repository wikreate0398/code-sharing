import { useSortable } from '@dnd-kit/sortable'
import { animateLayoutChanges } from '@/components/screens/dashboard/project/board/kanban/functions'
import { Container } from '@/components/screens/dashboard/project/board/kanban/_components/container'
import { CSS } from '@dnd-kit/utilities'
import React from 'react'

const DroppableContainer = ({
    data,
    children,
    columns = 1,
    disabled,
    id,
    items,
    ...props
}) => {
    const {
        active,
        attributes,
        isDragging,
        listeners,
        over,
        setNodeRef,
        transition,
        transform
    } = useSortable({
        id,
        data: {
            uid: data?.uid,
            type: 'container',
            children: items
        },
        animateLayoutChanges
    })

    const isOverContainer = over
        ? (id === over.id && active?.data.current?.type !== 'container') ||
          items.includes(over.id)
        : false

    return (
        <Container
            data={data}
            ref={disabled ? undefined : setNodeRef}
            style={{
                transition,
                transform: CSS.Translate.toString(transform),
                opacity: isDragging ? 0.5 : undefined
            }}
            hover={isOverContainer}
            handleProps={{
                ...attributes,
                ...listeners
            }}
            columns={columns}
            {...props}
        >
            {children}
        </Container>
    )
}

export default DroppableContainer
