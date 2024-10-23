import { Draggable, Droppable } from 'react-beautiful-dnd'
import { Box, Menu, MenuItem, Typography } from '@mui/material'

import styled from '@emotion/styled'
import ColumnTask from '#root/src/components/screens/dashboard/project/board/kanban/column-task.jsx'
import AddTask from '#root/src/components/screens/dashboard/project/board/kanban/column/add-task'
import React, {Fragment, memo, useCallback, useEffect, useRef, useState} from 'react'
import { makeStyles } from '@mui/styles'
import Icon from '#root/src/components/ui/icon/index'
import {
    useCreateColumnMutation,
    useDeleteColumnMutation,
    useUpdateColumnMutation
} from '#root/src/redux/api/column.api'
import EditableArea, { EditableAreaState } from '#root/src/components/ui/editable-area/index.jsx'
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state'
import { flexStartProps, spaceBetweenProps } from '#root/src/helpers/functions'
import { useParams } from '#root/renderer/hooks'
import InfiniteScroll from "react-infinite-scroll-component";

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

const ColumnContainer = styled.div`
    border-radius: 8px;
    overflow: hidden;
    background-color: #f3f4f6;
    flex-shrink: 0;
    margin: 0 5px;
    display: flex;
    flex-direction: column;
    width: 300px;
    max-height: 100%;
    padding: 15px;
    gap: 10px;
    height: ${({isAddColumn}) => isAddColumn ? 'auto' : null}
`

const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  padding: 0 15px;
    margin: 0 -15px;
  min-height: 1px;
`;

const DraggableColumnTaskWrapper = styled.div`
    position: relative;
    display: flex;
    gap: 8px;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;
    user-select: none;
    padding: 12px 10px 8px 15px;
    margin: 0 0 10px 0;
    border-radius: 8px;
    box-shadow: 0px 1px 1px 0px #0000001A;
    
    // change background colour if dragging
    background-color: #fff;
`

const Column = memo(({column, tasks, index}) => {
    const { id: columnId, name, uid} = column
    const id_column = parseInt(uid)
    const [createTaskMode, setCreateMode] = useState(false)
    const onToggleCreateTask = () => setCreateMode(o => !o)

    return (
        <Draggable draggableId={columnId} index={index}>
            {(columnProvided) => (
                <ColumnContainer
                    ref={columnProvided.innerRef}
                    {...columnProvided.draggableProps}
                    {...columnProvided.dragHandleProps}
                >
                    <Header column={column} onToggleCreateTask={onToggleCreateTask}/>

                    <Droppable
                        droppableId={columnId}
                        renderClone={(taskProvided, taskSnapshot, rubric) => {
                            return (
                                <DraggableColumnTaskWrapper
                                    ref={taskProvided.innerRef}
                                    {...taskProvided.draggableProps}
                                    {...taskProvided.dragHandleProps}
                                    style={taskProvided.draggableProps.style}
                                >
                                    <ColumnTask data={tasks[rubric.source.index]}/>
                                </DraggableColumnTaskWrapper>
                            )
                        }}
                    >
                        {(droppableProvided, snapshot) => {
                            return (
                                <ScrollContainer id={`scrollableDiv-${columnId}`} height="100%"{...droppableProvided.droppableProps} ref={droppableProvided.innerRef}>
                                    <InnerColumn tasks={tasks} columnId={columnId}/>
                                    {droppableProvided.placeholder}
                                </ScrollContainer>
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
}, (prev, next) =>
    JSON.stringify(prev.tasks) === JSON.stringify(next.tasks) &&
    JSON.stringify(prev.column) === JSON.stringify(next.column) &&
    prev.index === next.index
)

const PER_PAGE = 18

const InnerColumn = memo(({tasks, columnId}) => {

    const [hasMore, setHasMore] = useState(true);
    const [index, setIndex] = useState(1);

    const fetchMoreData = useCallback(() => {
        const nextIndex = index + 1;

        setHasMore(nextIndex*PER_PAGE < tasks.length)
        setIndex(nextIndex);
    }, [tasks, index]);

    const items = tasks.slice(0, index*PER_PAGE)

    return (
        <InfiniteScroll
            dataLength={items.length}
            next={fetchMoreData}
            hasMore={hasMore}
            scrollThreshold={0.7}
            style={{overflow: 'visible'}}
            scrollableTarget={`scrollableDiv-${columnId}`}>
            {items.map((item, index) => {
                return (
                    <Fragment key={item.id}>
                        <Draggable draggableId={item.id}
                                   index={index}>

                            {(taskProvided, taskSnapshot) => (
                                <DraggableColumnTaskWrapper
                                    ref={taskProvided.innerRef}
                                    {...taskProvided.draggableProps}
                                    {...taskProvided.dragHandleProps}
                                    style={taskProvided.draggableProps.style}
                                >
                                    <ColumnTask data={item}/>
                                </DraggableColumnTaskWrapper>
                            )}
                        </Draggable>
                    </Fragment>
                )
            })}

    </InfiniteScroll>
)
}, (prev, next) => prev.tasks === next.tasks)

const Header = memo(({column, onToggleCreateTask}) => {
    const classes = useStyles()
    const {id_board, uid, name} = column

    return (
        <Box className={classes.header}>
            <Name id_board={id_board} uid={uid} name={name} />
            <Options id_board={id_board} id_column={uid} onToggleCreateTask={onToggleCreateTask} />
        </Box>
    )
}, (prev, next) => {
    return prev.column.name === next.column.name && prev.column.uid === next.column.uid
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

export default Column