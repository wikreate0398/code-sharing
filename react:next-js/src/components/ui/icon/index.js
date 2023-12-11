'use client'

import { makeStyles } from '@mui/styles'
import Image from 'next/image'
import { Box } from '@mui/material'
import { forwardRef } from 'react'
import { isNull } from '@/helpers/functions'

const useStyles = makeStyles(() => ({
    root: {
        cursor: ({ pointer }) => (pointer ? 'pointer' : 'default')
    }
}))

const Icon = forwardRef(
    (
        {
            name,
            width: defWidth,
            height: defHeight,
            size = null,
            pointer = false,
            v2 = false,
            ...props
        },
        ref
    ) => {
        const classList = useStyles({ pointer })

        const sizeOptions = !isNull(size) ? size.split(',') : []

        const width = sizeOptions?.[0] || defWidth
        const height = sizeOptions?.[1] || defHeight

        const attr = {
            className: classList.root,
            component: 'img',
            width: width,
            height: height,
            src: `/img/${name}.svg`,
            ...(ref ? { ref } : {}),
            ...props
        }

        return v2 === true ? (
            <Box
                {...attr}
                component="img"
                width={`${width > 0 && `${width}px`}`}
                height={`${height > 0 && `${height}px`}`}
            />
        ) : (
            <Image {...attr} alt="" />
        )
    }
)

export default Icon
