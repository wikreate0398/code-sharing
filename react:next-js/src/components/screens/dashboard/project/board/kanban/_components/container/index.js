'use client'

import { Box, Menu, MenuItem } from '@mui/material'
import React, { forwardRef, memo, useCallback, useMemo } from 'react'
import classNames from 'classnames'
import styles from './container.module.scss'
import Icon from '@/components/ui/icon'
import {
    useDeleteColumnMutation,
    useUpdateColumnMutation
} from '@/redux/api/column.api'
import EditableArea, { EditableAreaState } from '@/components/ui/editable-area'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import AddTask from '@/components/screens/dashboard/project/board/kanban/_components/container/add-task'
import AddContainer from '@/components/screens/dashboard/project/board/kanban/_components/container/add-container'
import { useParams } from 'next/navigation'

export const Container = forwardRef(
    (
        {
            data,
            children,
            columns = 1,
            handleProps,
            hover,
            isAddColumn,
            onRemove,
            placeholder,
            style,
            shadow,
            ...props
        },
        ref
    ) => {
        const id_board = useParams().id_board

        const className = classNames(
            styles.container,
            hover && styles.hover,
            placeholder && styles.placeholder,
            shadow && styles.shadow
        )

        return (
            <Box
                {...props}
                ref={ref}
                style={{ ...style, '--columns': columns }}
                className={className}
                tabIndex={isAddColumn ? 0 : undefined}
            >
                {isAddColumn ? (
                    <AddContainer />
                ) : (
                    <Inner
                        id_board={id_board}
                        data={data}
                        handleProps={handleProps}
                    >
                        {children}
                    </Inner>
                )}
            </Box>
        )
    }
)

const Inner = ({ id_board, data, children, handleProps }) => {
    const { name, uid } = data
    return (
        <>
            <Box className={styles.header}>
                <Name id_board={id_board} uid={uid} name={name} />
                <Box className={styles.actions}>
                    <Actions uid={uid} id_board={id_board} />
                    <Icon
                        name="handle"
                        className={styles.handle}
                        pointer
                        {...handleProps}
                        v2
                    />
                </Box>
            </Box>

            <Box component="ul">{children}</Box>
            <AddTask id_column={data.uid} />
        </>
    )
}

const Name = memo(({ id_board, uid, name }) => {
    const [updateColumn] = useUpdateColumnMutation()
    const update = useCallback(
        (name) => {
            updateColumn({ name, id_board, id: uid })
        },
        [id_board, uid]
    )

    return (
        <Box data-no-dnd="true">
            <EditableAreaState>
                {(props) => (
                    <EditableArea
                        value={name}
                        save={update}
                        triggOnEnter
                        className={styles.title}
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
                        name="ellipse"
                        pointer
                        v2
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
