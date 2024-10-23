import React, { memo } from 'react'
import { Box } from '@mui/material'
import { spaceBetweenProps } from '#root/src/helpers/functions'
import Participants from '#root/src/components/screens/dashboard/project/board/task/_components/participants'

interface FooterProps {
    id_task: string | number
    url: string
    participants: {
        id: string | number
        name: string
    }[]
}

const Footer = memo(({ id_task, url, participants }: FooterProps) => {
    return (
        <Box {...spaceBetweenProps()} mt="50px">
            <Participants data={participants} />
        </Box>
    )
})

export default Footer
