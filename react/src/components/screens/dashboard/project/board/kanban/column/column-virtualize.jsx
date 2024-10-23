import { Draggable, Droppable } from 'react-beautiful-dnd'
import { Box, Menu, MenuItem, Typography } from '@mui/material'
import { CellMeasurer, AutoSizer, CellMeasurerCache, WindowScroller, List } from 'react-virtualized'
import ReactDOM from 'react-dom'
import styled from '@emotion/styled'
import ColumnTask, {
    getColumnTaskStyle
} from '#root/src/components/screens/dashboard/project/board/kanban/column-task.jsx'
import AddTask from '#root/src/components/screens/dashboard/project/board/kanban/column/add-task'
import React, { memo, useCallback, useMemo, useEffect, useRef, useState, forwardRef } from 'react'
import { makeStyles } from '@mui/styles'
import Icon from '#root/src/components/ui/icon/index'
import {
    useCreateColumnMutation,
    useDeleteColumnMutation,
    useUpdateColumnMutation
} from '#root/src/redux/api/column.api'
import EditableArea, { EditableAreaState } from '#root/src/components/ui/editable-area/index.jsx'
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state'
import { empty, flexStartProps, pluck, spaceBetweenProps } from '#root/src/helpers/functions'
import { useParams } from '#root/renderer/hooks'
import 'react-virtualized/styles.css';

const useStyles = makeStyles(() => ({
    header: {
        ...spaceBetweenProps()
    },

    actions: {
        display: 'flex',
        justifyContent: 'flex-start',
        height: '22px',
        border: '1px solid #C2CCD6',
        borderRadius: '4px',
    },
    actionsBtn: {
        width: '22px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionsSeparator: {
        height: '10px',
        width: '1px',
        background: '#C2CCD6',
        margin: 'auto',
    },

    title: {
        fontWeight: 500
    },

    preserving_container: {
        minHeight: 'calc(var(--child-height))',
        boxSizing: 'border-box'
    }
}))

const ColumnContainer  = styled.div`
    border-radius: 8px;
    overflow: hidden;
    background-color: #f3f4f6;
    flex-shrink: 0;
    margin: 0 5px;
    display: flex;
    flex-direction: column;
    width: 300px;
    height: 100%;
    padding: 15px;
    gap: 10px;
    height: ${({isAddColumn}) => isAddColumn ? 'auto' : null}
`

const getListStyle = (isDraggingOver) => ({
    background: "#f3f4f6",
    transition: "background-color 0.2s ease",
    // padding: "0 -15px",
    minHeight: '100% !important'
});

const getRowRender = (tasks, cellMeasurerCache) => (props) => {
    const { index, style, key, parent } = props
    const item = tasks[index];

    if (!item) return null

    return (
        <CellMeasurer
            key={key}
            cache={cellMeasurerCache}
            parent={parent}
            columnIndex={0}
            rowIndex={index}
        >
            <Draggable draggableId={item.id}
                       index={index}
                       key={item.id}>
                {(provided, snapshot) => (
                    <Box style={{ ...style }}>
                        <Box ref={provided.innerRef}
                             {...provided.draggableProps}
                             {...provided.dragHandleProps}
                             style={getColumnTaskStyle(
                                 snapshot.isDragging,
                                 provided.draggableProps.style
                             )}
                        >
                            <ColumnTask data={item}/>
                        </Box>
                    </Box>
                )}
            </Draggable>
        </CellMeasurer>
    );
}

// const cellMeasurerCache = new CellMeasurerCache({
//     fixedWidth: true,
//     defaultHeight: 170
// })

const ColumnVirtualize = memo(forwardRef(({
                                              column,
                                              tasks,
                                              index,
                                            //  cache:cellMeasurerCache
                                          }, listRef) => {

        const { id: columnId, name, uid} = column
        const id_column = parseInt(uid)
        const [createTaskMode, setCreateMode] = useState(false)

        const onToggleCreateTask = () => setCreateMode(o => !o)

        const cellMeasurerCache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 170,
            // keyMapper: (index) => {
            //     console.log(`${name} ${index}`)
            //     return `${tasks[index]?.uid}-0`
            // }
        })

        // cellMeasurerCache.clearAll()
        // listRef.current?.recomputeRowHeights()
        // listRef.current?.measureAllRows()

        useEffect(() => {
                cellMeasurerCache.clearAll()
             listRef.current?.recomputeRowHeights()
           //listRef.current?.measureAllRows()
        }, [tasks])
    console.log(cellMeasurerCache)

        return (
            <Draggable draggableId={columnId} index={index}>
                {(provided) => (
                    <ColumnContainer
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <Header column={column} onToggleCreateTask={onToggleCreateTask}/>

                        <Droppable
                            droppableId={columnId}
                            mode="virtual"
                            renderClone={(provided, snapshot, rubric) => {
                                return (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getColumnTaskStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                        )}
                                    >
                                        <ColumnTask data={tasks[rubric.source.index]}/>
                                    </Box>
                                )
                            }}
                        >
                            {(droppableProvided, snapshot) => {

                                const {draggingFromThisWith, isDraggingOver, draggingOverWith, isUsingPlaceholder} = snapshot

                                let itemCount = tasks.length

                                // if (isUsingPlaceholder) {
                                //     if (!draggingOverWith) {
                                //         itemCount--
                                //     } else if (isDraggingOver && Boolean(draggingOverWith) && !Boolean(draggingFromThisWith)) {
                                //         itemCount++
                                //     }
                                // }

                                if (isUsingPlaceholder) console.log(column.name,snapshot, itemCount)

                                return (
                                    <Box height="100%" >
                                        <AutoSizer>
                                            {({ width, height }) => (
                                                <List
                                                    height={height}
                                                    width={width}
                                                    rowCount={itemCount}
                                                    rowHeight={cellMeasurerCache.rowHeight}
                                                    overscanRowCount={20}
                                                    ref={ref => {
                                                        // react-virtualized has no way to get the list's ref that I can so
                                                        // So we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
                                                        if (ref) {
                                                            listRef.current = ref
                                                            // eslint-disable-next-line react/no-find-dom-node
                                                            const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
                                                            if (whatHasMyLifeComeTo instanceof HTMLElement) {
                                                                droppableProvided.innerRef(whatHasMyLifeComeTo);
                                                            }
                                                        }
                                                    }}
                                                    style={getListStyle(snapshot.isDraggingOver)}
                                                    rowRenderer={getRowRender(tasks, cellMeasurerCache)}
                                                    deferredMeasurementCache={cellMeasurerCache}
                                                />
                                            )}
                                        </AutoSizer>
                                    </Box>
                                )
                            }}
                        </Droppable>
                        <AddTask
                            id_column={id_column}
                            createTaskMode={createTaskMode}
                            toggleCreateTask={(v) => setCreateMode(v)} />
                    </ColumnContainer>
                )}
            </Draggable>
        )
    }),  (prev, next) =>
    JSON.stringify(prev.tasks) === JSON.stringify(next.tasks) &&
    JSON.stringify(prev.column) === JSON.stringify(next.column) &&
    prev.index === next.index
)
//
// const InnerList = () => {
//     <Box height="100%">
//         <AutoSizer>
//             {({ width, height }) => (
//                 <List
//                     height={height}
//                     width={width}
//                     rowCount={itemCount}
//                     rowHeight={cellMeasurerCache.rowHeight}
//                     overscanRowCount={20}
//                     ref={ref => {
//                         // react-virtualized has no way to get the list's ref that I can so
//                         // So we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
//                         if (ref) {
//                             listRef.current = ref
//                             // eslint-disable-next-line react/no-find-dom-node
//                             const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
//                             if (whatHasMyLifeComeTo instanceof HTMLElement) {
//                                 droppableProvided.innerRef(whatHasMyLifeComeTo);
//                             }
//                         }
//                     }}
//                     style={getListStyle(snapshot.isDraggingOver)}
//                     rowRenderer={getRowRender(tasks, cellMeasurerCache)}
//                     deferredMeasurementCache={cellMeasurerCache}
//                 />
//             )}
//         </AutoSizer>
//     </Box>
// }

const Header = memo(({column, onToggleCreateTask}) => {
    const classes = useStyles()
    const {id_board, uid, name} = column
    return (
        <Box className={classes.header}>
            <Name id_board={id_board} uid={uid} name={name} />
            <Options id_board={id_board} id_column={uid} onToggleCreateTask={onToggleCreateTask} />
        </Box>
    )
})

const Options = memo(({ id_column, id_board, onToggleCreateTask }) => {
    const classes = useStyles()

    return (
        <Box className={classes.actions}>
            <Box
                className={classes.actionsBtn}
                onClick={onToggleCreateTask}
            >
                <Icon name="plus" pointer v2 />
            </Box>
            <div className={classes.actionsSeparator} />
            <Box className={classes.actionsBtn}>
                <Actions uid={id_column} id_board={id_board} />
            </Box>
        </Box>
    )
})

const Name = memo(({ id_board, uid, name }) => {
    const classes = useStyles()

    const [updateColumn] = useUpdateColumnMutation()
    const update = useCallback(
        (name) => {
            updateColumn({ name, id_board, id: uid })
        },
        [id_board, uid]
    )

    return (
        <Box>
            <EditableAreaState>
                {(props) => (
                    <EditableArea
                        value={name}
                        save={update}
                        triggOnEnter
                        className={classes.title}
                    />
                )}
            </EditableAreaState>
        </Box>
    )
})

const Actions = memo(({ uid, id_board }) => {
    const [deleteColumn] = useDeleteColumnMutation()

    return (
        <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
                <>
                    <Icon
                        name="ellipses"
                        pointer
                        v2
                        width={24}
                        height={24}
                        {...bindTrigger(popupState)}
                    />
                    <Menu {...bindMenu(popupState)}>
                        <MenuItem
                            onClick={() => deleteColumn({ id: uid, id_board })}
                        >
                            Удалить
                        </MenuItem>
                    </Menu>
                </>
            )}
        </PopupState>
    )
})

export const AddColumn = () => {
    const classes = useStyles()
    const { id_board } = useParams()
    const [createColumn] = useCreateColumnMutation()

    const save = useCallback(
        (name) => {
            createColumn({ name, id_board: parseInt(id_board) })
        },
        [id_board]
    )

    return (
        <ColumnContainer isAddColumn>
            <EditableAreaState>
                {({ isEditMode, value, enableEditMode, disableEditMode }) => (
                    <>
                        {!isEditMode ? (
                            <Box {...flexStartProps('center')} gap="8px">
                                <Icon name="plus" v2 />
                                <Typography
                                    variant="small-gray"
                                    fontSize="13px"
                                    onClick={enableEditMode}
                                >
                                    Добавить колонку
                                </Typography>
                            </Box>
                        ) : (
                            <Box width="100%">
                                <EditableArea
                                    value=""
                                    save={save}
                                    triggOnEnter
                                    className={classes.title}
                                    useSaveBtn
                                />
                            </Box>
                        )}
                    </>
                )}
            </EditableAreaState>
        </ColumnContainer>
    )
}

export default ColumnVirtualize