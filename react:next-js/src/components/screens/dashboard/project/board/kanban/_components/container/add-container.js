import React, { useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useCreateColumnMutation } from '@/redux/api/column.api'
import { Box, Typography } from '@mui/material'
import { flexStartProps } from '@/helpers/functions'
import Icon from '@/components/ui/icon'
import EditableArea, { EditableAreaState } from '@/components/ui/editable-area'
import styles from '@/components/screens/dashboard/project/board/kanban/_components/container/container.module.scss'

const AddContainer = () => {
    const { id_board } = useParams()
    const [createColumn] = useCreateColumnMutation()

    const save = useCallback(
        (name) => {
            createColumn({ name, id_board: parseInt(id_board) })
        },
        [id_board]
    )

    return (
        <>
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
                                    className={styles.title}
                                    useSaveBtn
                                />
                            </Box>
                        )}
                    </>
                )}
            </EditableAreaState>
        </>
    )
}

export default AddContainer
