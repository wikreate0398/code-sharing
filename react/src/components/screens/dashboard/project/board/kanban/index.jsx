import React from 'react'
import styled from "@emotion/styled";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
 import { useMoveColumnsMutation } from '#root/src/redux/api/column.api.js'
import { useMoveTasksMutation } from '#root/src/redux/api/task/task.api.js'
import Column, { AddColumn } from '#root/src/components/screens/dashboard/project/board/kanban/column/index'

const Container = styled.div`
    display: inline-grid;
    box-sizing: border-box;
    grid-auto-flow: column;
    max-width: 100%; 
    overflow: scroll;
    align-items: flex-start;
    position: absolute;
    top: 15px;
    left: 0;
    bottom: 0;
    max-height: 100%;
`;
const uidFromId = (str) => parseInt(str.replace(/[^0-9]/g, ''))

function Kanban({ columns, tasks, id_board }) {

    const [moveColumns] = useMoveColumnsMutation()
    const [moveTasks] = useMoveTasksMutation()

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const source = result.source;
        const destination = result.destination;

        // did not move anywhere - can bail early
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        if (result.type === 'COLUMN') {
            moveColumns({from: source.index, to: destination.index, id_board})
            return
        }

        moveTasks({
            id_board,
            data: {
                id: uidFromId(result.draggableId),
                id_column: uidFromId(destination.droppableId),
                position: destination.index+1
            }
        })
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
                droppableId="board"
                type="COLUMN"
                direction="horizontal"
                ignoreContainerClipping={false}
                isCombineEnabled={false}
            >
                {(provided) => (
                    <Container
                        ref={provided.innerRef} {...provided.droppableProps}
                    >
                        {columns.map((column, index) => {
                            const { id: columnId } = column
                            return <Column key={columnId}
                                                     column={column}
                                                     index={index}
                                                     tasks={tasks[columnId] || []}/>
                        })}
                        {provided.placeholder}
                        <AddColumn />
                    </Container>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default Kanban;
