import React from 'react'
import {
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'

const ListboxComponent = ({ children, isDnd, items, onDragEnd, ...props }) => {
    return (
        <ul {...props}>
            {isDnd ? (
                <DndWrapper list={items} onDragEnd={onDragEnd}>
                    {children}
                </DndWrapper>
            ) : (
                children
            )}
        </ul>
    )
}

const DndWrapper = ({ children, onDragEnd, list }) => {
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            scrollBehavior: 'Cypress' in window ? 'auto' : undefined,
            sortableKeyboardCoordinates
        })
    )

    return (
        <DndContext
            sensors={sensors}
            onDragEnd={({ active, over }) => {
                if (over && active.id !== over?.id) {
                    const activeIndex = list.findIndex(
                        ({ id }) => id === active.id
                    )
                    const overIndex = list.findIndex(({ id }) => id === over.id)

                    onDragEnd({
                        from: list[activeIndex].id,
                        to: list[overIndex].id
                    })
                }
            }}
        >
            <SortableContext items={list}>{children}</SortableContext>
        </DndContext>
    )
}

export default ListboxComponent
