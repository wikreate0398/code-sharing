import SvgIconProvider, {
    useSvgContext,
    withSvgCtx
} from '#root/src/components/ui/svg-icons/context'
import { memo } from 'react'
import Svg from '#root/src/components/ui/svg-icons/svg'

const StatsIcon = memo(() => {
    const { color } = useSvgContext()

    return (
        <Svg>
            <path
                d="M6.40059 0C2.99371 0.281763 0.281763 2.99371 0 6.40059H6.40059V0ZM7.56973 0V6.74311L12.3388 11.5122C13.3729 10.2898 14 8.71198 14 6.98516C14 3.30821 11.1695 0.298131 7.56973 0ZM0 7.56973C0.298131 11.1695 3.30821 14 6.98516 14C8.71198 14 10.2898 13.3729 11.5122 12.3388L6.74311 7.56973H0Z"
                fill={color || '#606367'}
            />
        </Svg>
    )
})

export default withSvgCtx(SvgIconProvider)(StatsIcon)
