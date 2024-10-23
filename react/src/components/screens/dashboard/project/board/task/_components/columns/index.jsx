import React, { memo, useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { useParams} from "#root/renderer/hooks";
import { useFetchBoardsForTaskQuery } from '#root/src/redux/api/board.api'
import PlusBtn from '#root/src/components/ui/plus-btn'
import ColumnsModal from '#root/src/components/screens/dashboard/project/board/task/_components/columns/columns-modal'
import { empty, flexStartProps } from '#root/src/helpers/functions'
import { Typography } from '@mui/material'

const Columns = memo(({ selectedColumns = [] }) => {
    const { data, isLoading } = useFetchBoardsForTaskQuery(
        useParams().id_project,
        {
            refetchOnMountOrArgChange: true
        }
    )
    const [open, setOpen] = useState(false)

    if (isLoading) return null

    const chips = []
    data.forEach(({ name: boardName, columns }) => {
        columns.forEach(({ id, name: columnName }) => {
            if (selectedColumns.includes(id)) {
                chips.push({
                    label: `${boardName}: ${columnName}`,
                    id
                })
            }
        })
    })

    return (
        <Box marginTop="40px">
            <Typography variant="subtitle-16" component="p" mb="12px">
                Доски
            </Typography>

            <Box {...flexStartProps('center')} gap="10px">
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {chips.map(({ id, label }) => (
                        <Chip key={id} label={label} />
                    ))}
                </Box>
                {!empty(data) && (
                    <>
                        <ColumnsModal
                            data={data}
                            open={open}
                            handleClose={() => setOpen(false)}
                        />
                        <PlusBtn onClick={() => setOpen(true)} />
                    </>
                )}
            </Box>
        </Box>
    )
})

export default Columns
