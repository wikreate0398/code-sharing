import React, {
    useEffect,
    forwardRef,
    memo,
    useCallback,
    useContext
} from 'react'
import classNames from 'classnames'
import styles from './item.module.scss'
import { Box, Typography } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import { taskRoute } from '@/config/routes'
import Avatar from '@/components/ui/avatar'
import { spaceBetweenProps } from '@/helpers/functions'
import AvatarGroup from '@/components/ui/avatar-group'

const generateStyle = (transform, transition, index) => {
    return {
        transition: [transition].filter(Boolean).join(', '),
        '--translate-x': transform ? `${Math.round(transform.x)}px` : undefined,
        '--translate-y': transform ? `${Math.round(transform.y)}px` : undefined,
        '--scale-x': transform?.scaleX ? `${transform.scaleX}` : undefined,
        '--scale-y': transform?.scaleY ? `${transform.scaleY}` : undefined,
        '--index': index
    }
}

export const Item = memo(
    forwardRef(
        (
            {
                data,
                dragOverlay,
                dragging,
                disabled,
                fadeIn,
                handle,
                index,
                listeners,
                sorting,
                transition,
                transform
            },
            ref
        ) => {
            const { push } = useRouter()
            const { id_board, id_project } = useParams()

            useEffect(() => {
                if (!dragOverlay) return

                document.body.style.cursor = 'grabbing'
                return () => {
                    document.body.style.cursor = ''
                }
            }, [dragOverlay])

            const liClasses = classNames(
                styles.Wrapper,
                fadeIn && styles.fadeIn,
                sorting && styles.sorting,
                dragOverlay && styles.dragOverlay
            )

            const innerClasses = classNames(
                styles.Item,
                dragging && styles.dragging,
                handle && styles.withHandle,
                dragOverlay && styles.dragOverlay,
                disabled && styles.disabled
            )

            const openTask = useCallback(
                () => push(taskRoute(id_project, id_board, data.uid)),
                [id_project, id_board, data]
            )

            const { uid, name, participants } = data

            return (
                <Box
                    component="li"
                    className={liClasses}
                    style={generateStyle(
                        transform,
                        transition,
                        generateStyle,
                        index
                    )}
                    ref={ref}
                >
                    <Box
                        className={innerClasses}
                        data-cypress="draggable-item"
                        {...(!handle ? listeners : undefined)}
                        tabIndex={!handle ? 0 : undefined}
                    >
                        <ItemInner
                            name={name}
                            participants={participants}
                            uid={uid}
                            openTask={openTask}
                            dragging={dragging}
                        />
                    </Box>
                </Box>
            )
        }
    )
)

export const ItemInner = memo(({ name, uid, participants, openTask }) => {
    return (
        <>
            <Box className={styles.name} data-no-dnd="true" onClick={openTask}>
                {name}
            </Box>
            <Box {...spaceBetweenProps()}>
                <Typography fontSize="12px" color="#939799">
                    #{uid}
                </Typography>
                <AvatarGroup sx={{ zIndex: 2 }} size={22}>
                    {participants.map(({ id, name }) => (
                        <Avatar key={id} size={22} pointer name={name} />
                    ))}
                </AvatarGroup>
            </Box>
        </>
    )
})
