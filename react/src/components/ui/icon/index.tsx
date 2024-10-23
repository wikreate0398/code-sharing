
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/material'
import { forwardRef, memo } from 'react'
import { isNull } from '#root/src/helpers/functions'
import { OneOf } from '#root/src/config/ts-advanced'
import { BlackTooltip } from '#root/src/components/ui/tooltip/index.jsx'
import { TooltipProps } from '@mui/material/Tooltip/Tooltip'

interface MainProps {
    name: string
    pointer?: boolean
    v2?: boolean
    tooltip?: TooltipProps
}

type Props = MainProps &
    (
        | { size: string; width?: never; height?: never }
        | { size?: null; width: number; height: number }
        | { v2: true; width?: number; height?: number; size?: null }
    )

type Ref = HTMLImageElement

const useStyles = makeStyles(() => ({
    root: {
        cursor: ({ pointer }: OneOf<Props>) => (pointer ? 'pointer' : 'default')
    }
}))

const Icon = forwardRef<Ref | null, Props>(
    (
        {
            name,
            width: defWidth = null,
            height: defHeight = null,
            size = null,
            pointer = false,
            v2 = false,
            tooltip = {},
            ...props
        },
        ref
    ) => {
        const classList = useStyles({ pointer })

        const sizeOptions: string[] = !isNull(size) ? size.split(',') : []

        const width: number = parseFloat(sizeOptions?.[0]) || defWidth
        const height: number = parseFloat(sizeOptions?.[1]) || defHeight

        const attr = {
            className: classList.root,
            component: 'img',
            width: width,
            height: height,
            src: `/img/${name}.svg`,
            ...(ref ? { ref } : {}),
            ...props
        }

        return (
            <BlackTooltip {...tooltip}>
                <Box
                    {...attr}
                    component="img"
                    width={`${width > 0 && `${width}px`}`}
                    height={`${height > 0 && `${height}px`}`}
                />
            </BlackTooltip>
        )
    }
)

export default memo(Icon)
