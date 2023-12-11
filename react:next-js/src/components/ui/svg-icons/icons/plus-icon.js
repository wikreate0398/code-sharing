import SvgIconProvider, {
    SvgCtx,
    withSvgCtx
} from '@/components/ui/svg-icons/context'
import { memo, useContext } from 'react'
import Svg from '@/components/ui/svg-icons/svg'

const PlusIcon = memo(() => {
    const { color } = useContext(SvgCtx)

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
