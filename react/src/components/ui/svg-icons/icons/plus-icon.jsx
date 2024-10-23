import SvgIconProvider, {
    useSvgContext,
    withSvgCtx
} from '#root/src/components/ui/svg-icons/context'
import { memo } from 'react'
import Svg from '#root/src/components/ui/svg-icons/svg'

const PlusIcon = memo(() => {
    const { color } = useSvgContext()

    return (
        <Svg>
            <path
                d="M7 13V1"
                stroke={color || '#6C7885'}
                strokeLinecap="round"
            />
            <path
                d="M1 7L13 7"
                stroke={color || '#6C7885'}
                strokeLinecap="round"
            />
        </Svg>
    )
})

export default withSvgCtx(SvgIconProvider)(PlusIcon)
