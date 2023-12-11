import SvgIconProvider, {
    SvgCtx,
    withSvgCtx
} from '@/components/ui/svg-icons/context'
import { memo, useContext } from 'react'
import Svg from '@/components/ui/svg-icons/svg'

const WalletIcon = memo(() => {
    const { color } = useContext(SvgCtx)

    return (
        <Svg>
            <path
                d="M2.1999 0.399962C1.21292 0.399962 0.399902 1.21298 0.399902 2.19996V11.8C0.399902 12.7942 1.2057 13.6 2.1999 13.6H12.3999C13.0629 13.6 13.5999 13.063 13.5999 12.4V3.99996C13.5999 3.33696 13.0629 2.79996 12.3999 2.79996H7.5999H2.1999C1.86088 2.79996 1.5999 2.53898 1.5999 2.19996C1.5999 1.86094 1.86088 1.59996 2.1999 1.59996H11.1999C11.2794 1.60109 11.3583 1.5864 11.4321 1.55675C11.5059 1.5271 11.5731 1.48309 11.6297 1.42726C11.6863 1.37143 11.7313 1.30491 11.762 1.23155C11.7926 1.1582 11.8084 1.07948 11.8084 0.999962C11.8084 0.920447 11.7926 0.841725 11.762 0.768371C11.7313 0.695017 11.6863 0.628493 11.6297 0.572666C11.5731 0.51684 11.5059 0.472823 11.4321 0.443175C11.3583 0.413527 11.2794 0.398838 11.1999 0.399962H2.1999ZM11.1999 6.99996C11.8629 6.99996 12.3999 7.53696 12.3999 8.19996C12.3999 8.86296 11.8629 9.39996 11.1999 9.39996C10.5369 9.39996 9.9999 8.86296 9.9999 8.19996C9.9999 7.53696 10.5369 6.99996 11.1999 6.99996Z"
                fill={color || '#606367'}
            />
        </Svg>
    )
})

export default withSvgCtx(SvgIconProvider)(WalletIcon)
