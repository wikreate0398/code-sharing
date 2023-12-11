import React, { memo, useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { useParams } from 'next/navigation'
import { useFetchBoardsForTaskQuery } from '@/redux/api/board.api'
import PlusBtn from '@/components/ui/plus-btn'
import ColumnsModal from '@/components/screens/dashboard/project/board/task/_components/columns/columns-modal'
import { empty, flexStartProps } from '@/helpers/functions'
import { Typography } from '@mui/material'

const Columns = memo(({ selectedColumns }) => {
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
        <Box>
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
