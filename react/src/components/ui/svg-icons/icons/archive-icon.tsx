import React from 'react'
import SvgIconProvider, {
    useSvgContext,
    withSvgCtx
} from '#root/src/components/ui/svg-icons/context'

const ArchiveIcon = () => {
    const { color } = useSvgContext()

    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M13 0.5H1C0.447715 0.5 0 0.947715 0 1.5V2C0 2.55228 0.447715 3 1 3H13C13.5523 3 14 2.55228 14 2V1.5C14 0.947715 13.5523 0.5 13 0.5Z"
                fill={color}
            />
            <path
                d="M1 4.5H13V12C13 13.1046 12.1046 14 11 14H3C1.89543 14 1 13.1046 1 12V4.5Z"
                fill={color}
            />
            <path
                d="M7 6.5V11.5M7 11.5L9.5 9M7 11.5L4.5 9"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default withSvgCtx(SvgIconProvider)(ArchiveIcon)
