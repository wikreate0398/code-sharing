import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
    DndContext,
    DragOverlay,
    KeyboardSensor as LibKeyboardSensor,
    MouseSensor as LibMouseSensor,
    TouchSensor,
    useSensors,
    useSensor,
    MeasuringStrategy
} from '@dnd-kit/core'
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
    horizontalListSortingStrategy
} from '@dnd-kit/sortable'
import { Item } from '@/components/screens/dashboard/project/board/kanban/_components/item'
import { Container } from '@/components/screens/dashboard/project/board/kanban/_components/container'
import {
    dropAnimation,
    coordinateGetter as multipleContainersCoordinateGetter
} from '@/components/screens/dashboard/project/board/kanban/functions'
import { Box } from '@mui/material'
import { pluck } from '@/helpers/functions'
import { useMoveColumnsMutation } from '@/redux/api/column.api'
import { useMoveTasksMutation } from '@/redux/api/task.api'
import DroppableContainer from '@/components/screens/dashboard/project/board/kanban/_components/dropable-container'
import SortableItem from '@/components/screens/dashboard/project/board/kanban/_components/sortable-item'
import { makeStyles } from '@mui/styles'

const getType = (obj) => {
    return obj?.data?.current?.type === 'container' ? 'container' : 'item'
}

const findIndexById = (arr, id) => {
    return arr.findIndex((v) => v.id === id)
}

const findContainer = (items, data) => {
    const id = typeof data === 'object' ? data?.id : data

    if (
        getType(data) === 'container' ||
        (typeof data !== 'object' && id in items)
    ) {
        return id
    }

    return Object.keys(items).find((key) =>
        pluck(items[key], 'id').includes(id)
    )
}

const useStyles = makeStyles(() => ({
    virtualList: {
        '& > div': {
            overflow: 'hidden'
        }
    }
}))

const getItem = (items, id) => {
    let item = null
    Object.keys(items).every((v) => {
        const index = findIndexById(items[v], id)
        if (index !== -1) {
            item = items[v][index]
            return false
        }
        return true
    })
    return item
}

export const TRASH_ID = 'void'
const PLACEHOLDER_ID = 'placeholder'
const empty = []

export class MouseSensor extends LibMouseSensor {
    static activators = [
        {
            eventName: 'onMouseDown',
            handler: ({ nativeEvent: event }) => {
                return shouldHandleEvent(event.target)
            }
        }
    ]
}

export class KeyboardSensor extends LibKeyboardSensor {
    static activators = [
        {
            eventName: 'onKeyDown',
            handler: ({ nativeEvent: event }) => {
                return shouldHandleEvent(event.target)
            }
        }
    ]
}

function shouldHandleEvent(element) {
    let cur = element

    while (cur) {
        if (cur.dataset && cur.dataset.noDnd) {
            return false
        }
        cur = cur.parentElement
    }

    return true
}

const uidFromId = (str) => parseInt(str.replace(/[^0-9]/g, ''))

const getItemsPositions = (items) => {
    const data = []
    Object.entries(items).forEach((v) => {
        v[1].forEach((task, index) => {
            data.push({
                id: task.uid,
                id_column: uidFromId(v[0]),
                position: index + 1
            })
        })
    })

    return data
}

export const MultipleContainers = ({
    id_board,
    cancelDrop,
    handle = false,
    items: initialItems,
    containers,
    coordinateGetter = multipleContainersCoordinateGetter,
    getItemStyles = () => ({}),
    modifiers
}) => {
    const [items, setItems] = useState([])
    const [moveColumns] = useMoveColumnsMutation()
    const [moveTasks] = useMoveTasksMutation()
    const [itemActiveId, setItemActiveId] = useState(null)
    const [containerActiveId, setContainerActiveId] = useState(null)
    const [clonedItems, setClonedItems] = useState(null)

    const containersIds = useMemo(() => {
        return pluck(containers, 'id')
    }, [containers])

    const isSortingContainer = Boolean(containerActiveId)

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, { coordinateGetter })
    )

    useEffect(() => {
        setItems(initialItems)
    }, [initialItems])

    const getIndex = useCallback(
        (id) => {
            const container = findContainer(items, id)
            if (!container) return -1
            return findIndexById(items[container], id)
        },
        [items]
    )

    const resetActiveId = useCallback(() => {
        setItemActiveId(null)
        setContainerActiveId(null)
    }, [setItemActiveId, setContainerActiveId])

    const onDragCancel = () => {
        if (clonedItems) {
            setItems(clonedItems)
        }

        resetActiveId()
        setClonedItems(null)
    }

    const onDragStart = useCallback(({ active }) => {
        const action =
            getType(active) === 'container'
                ? setContainerActiveId
                : setItemActiveId
        action(active.id)
        setClonedItems(items)
    }, [])

    const renderSortableItemDragOverlay = (id) => {
        const item = getItem(items, id)

        return <Item data={item} handle={handle} dragOverlay />
    }

    const renderContainerDragOverlay = (containerId) => {
        const container = containers.find((v) => v.id === containerId)
        return (
            <Container data={container} style={{ height: '100%' }} shadow>
                {items[containerId].map((item, index) => (
                    <Item key={item.id} data={item} handle={handle} />
                ))}
            </Container>
        )
    }

    function handleRemove(containerID) {
        // setContainers((containers) =>
        //     containers.filter(({id}) => id !== containerID)
        // );
    }

    return (
        <DndContext
            sensors={sensors}
            measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
            onDragStart={onDragStart}
            onDragOver={({ active, over }) => {
                const overId = over?.id
                const activeId = active?.id

                if (
                    overId == null ||
                    overId === TRASH_ID ||
                    getType(active) === 'container'
                ) {
                    return
                }

                const overContainer = findContainer(items, overId)
                const activeContainer = findContainer(items, activeId)

                if (!overContainer || !activeContainer) {
                    return
                }

                if (activeContainer !== overContainer) {
                    setItems((items) => {
                        const activeItems = items[activeContainer]
                        const overItems = items[overContainer]

                        const overIndex = findIndexById(overItems, overId)
                        const activeIndex = findIndexById(activeItems, activeId)

                        let newIndex

                        if (overId in items) {
                            newIndex = overItems.length + 1
                        } else {
                            const isBelowOverItem =
                                over &&
                                active.rect.current.translated &&
                                active.rect.current.translated.top >
                                    over.rect.top + over.rect.height
                            const modifier = isBelowOverItem ? 1 : 0
                            newIndex =
                                overIndex >= 0
                                    ? overIndex + modifier
                                    : overItems.length + 1
                        }

                        return {
                            ...items,
                            [activeContainer]: items[activeContainer].filter(
                                (v) => v.id !== activeId
                            ),
                            [overContainer]: [
                                ...items[overContainer].slice(0, newIndex),
                                items[activeContainer][activeIndex],
                                ...items[overContainer].slice(
                                    newIndex,
                                    items[overContainer].length
                                )
                            ]
                        }
                    })
                }
            }}
            onDragEnd={({ active, over }) => {
                const type = getType(active)

                const overId = over?.id
                const activeId = active.id

                if (type === 'container' && overId) {
                    const activeIndex = findIndexById(containers, activeId)
                    const overIndex = findIndexById(containers, overId)

                    moveColumns({
                        ids: pluck(
                            arrayMove(containers, activeIndex, overIndex),
                            'uid'
                        ),
                        id_board
                    })
                }

                const activeContainer = findContainer(items, activeId)

                if (overId == null || !activeContainer) {
                    resetActiveId()
                    return
                }

                const overContainer = findContainer(items, overId)

                if (overContainer) {
                    const activeIndex = findIndexById(
                        items[activeContainer],
                        activeId
                    )
                    const overIndex = findIndexById(
                        items[overContainer],
                        overId
                    )

                    let data = null
                    if (activeIndex !== overIndex) {
                        data = {
                            ...items,
                            [overContainer]: arrayMove(
                                items[overContainer],
                                activeIndex,
                                overIndex
                            )
                        }

                        setItems(data)
                    }

                    if (type !== 'container') {
                        moveTasks({
                            id_board,
                            data: {
                                id: uidFromId(activeId),
                                id_column: uidFromId(overContainer),
                                position: overIndex + 1
                            }
                        })
                    }
                }

                resetActiveId()
            }}
            cancelDrop={cancelDrop}
            onDragCancel={onDragCancel}
            modifiers={modifiers}
        >
            <Box
                style={{
                    display: 'inline-grid',
                    boxSizing: 'border-box',
                    gridAutoFlow: 'column',
                    maxWidth: '100%',
                    overflow: 'scroll',
                    alignItems: 'flex-start',
                    position: 'absolute',
                    top: '15px',
                    left: 0,
                    bottom: 0,
                    maxHeight: '100%'
                }}
            >
                <SortableContext
                    items={[...containers, PLACEHOLDER_ID]}
                    strategy={horizontalListSortingStrategy}
                >
                    {containers.map((container) => {
                        const { id: containerId, name } = container

                        if (!(containerId in items)) return null

                        const containerItems = items[containerId]

                        return (
                            <ContainerItems
                                name={name}
                                key={containerId}
                                containerItems={containerItems}
                                container={container}
                                handleRemove={handleRemove}
                                handle={handle}
                                style={getItemStyles}
                                containerId={containerId}
                                isSortingContainer={isSortingContainer}
                                getIndex={getIndex}
                            />
                        )
                    })}
                    <DroppableContainer
                        id={PLACEHOLDER_ID}
                        disabled={true}
                        items={empty}
                        isAddColumn
                        placeholder
                    />
                </SortableContext>
            </Box>
            {createPortal(
                <DragOverlay dropAnimation={dropAnimation}>
                    {Boolean(containerActiveId) || Boolean(itemActiveId)
                        ? containersIds.includes(containerActiveId)
                            ? renderContainerDragOverlay(containerActiveId)
                            : renderSortableItemDragOverlay(itemActiveId)
                        : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    )
}

const ContainerItems = memo(
    ({
        name,
        containerId,
        container,
        containerItems,
        handle,
        handleRemove,
        style,
        isSortingContainer,
        getIndex
    }) => {
        return (
            <DroppableContainer
                id={containerId}
                data={container}
                label={name}
                items={containerItems}
                onRemove={() => handleRemove(containerId)}
            >
                <SortableContext
                    items={containerItems}
                    strategy={verticalListSortingStrategy}
                >
                    {containerItems.map((item, index) => {
                        return (
                            <SortableItem
                                disabled={isSortingContainer}
                                key={item.id}
                                data={item}
                                index={index}
                                handle={handle}
                                style={style}
                                containerId={containerId}
                                getIndex={getIndex}
                            />
                        )
                    })}
                </SortableContext>
            </DroppableContainer>
        )
    },
    (prevProps, nextProps) => {
        return JSON.stringify(prevProps) === JSON.stringify(nextProps)
    }
)
