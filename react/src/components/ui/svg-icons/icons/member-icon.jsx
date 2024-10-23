import SvgIconProvider, {
    useSvgContext,
    withSvgCtx
} from '#root/src/components/ui/svg-icons/context'
import { memo } from 'react'
import Svg from '#root/src/components/ui/svg-icons/svg'

const MemberIcon = memo(() => {
    const { color } = useSvgContext()

    return (
        <Svg>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.39058 0.865338C5.45197 1.01192 4.42765 1.73684 3.96208 2.58396C2.86845 4.57394 4.03651 7.00974 6.30431 7.46838C8.32801 7.87769 10.2678 6.45614 10.4562 4.42589C10.611 2.75729 9.27338 1.12124 7.53997 0.859067C7.0119 0.779156 6.93992 0.779574 6.39058 0.865338ZM3.80965 9.0478C2.56932 9.37692 1.44867 10.283 0.906594 11.3951C0.583259 12.0584 0.5 12.5305 0.5 13.6999C0.5 14.7403 0.506322 14.7874 0.659692 14.8916C0.801138 14.9877 1.52238 15 7.00119 15C12.5712 15 13.1995 14.9889 13.3484 14.8877C13.5122 14.7765 13.5135 14.7636 13.4876 13.5466C13.465 12.4822 13.4393 12.2571 13.296 11.8649C12.8419 10.6218 11.8838 9.67099 10.5712 9.16073L10.0902 8.97374L7.14487 8.95904C4.7275 8.94698 4.12968 8.96287 3.80965 9.0478Z"
                fill={color}
            />
        </Svg>
    )
})

export default withSvgCtx(SvgIconProvider)(MemberIcon)
