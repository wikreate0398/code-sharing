import SvgIconProvider, {
    useSvgContext,
    withSvgCtx
} from '#root/src/components/ui/svg-icons/context'
import { memo } from 'react'
import Svg from '#root/src/components/ui/svg-icons/svg'

const HomeIcon = memo(() => {
    const { color } = useSvgContext()

    return (
        <Svg>
            <path
                d="M6.99999 0.636353L0.636353 6.99999V13.3636H4.87878V8.5909H9.1212V13.3636H13.3636V6.99999L6.99999 0.636353Z"
                fill={color || '#606367'}
                stroke={color || '#606367'}
                strokeWidth="0.5"
            />
        </Svg>
    )
})

export default withSvgCtx(SvgIconProvider)(HomeIcon)
