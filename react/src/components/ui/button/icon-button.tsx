import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { FC, memo } from 'react'
import { PropsWithChildren } from '#root/src/config/ts-advanced'
import { BoxProps } from '@mui/material/Box/Box'
import { Theme } from '@mui/system'
import { BlackTooltip as Tooltip } from '#root/src/components/ui/tooltip/index.jsx'

type Size = 'big' | 'small' | number
interface ActiveProps {
    btnColor: 'urgent' | string
    iconColor: string
}

interface TooltipProps {
    title: string
    arrow?: boolean
}

interface Props extends BoxProps {
    size?: Size
    active?: boolean
    activeProps?: ActiveProps,
    tooltip?: TooltipProps
}

const sizes = {
    small: 25,
    big: 34
}

const useStyles = makeStyles((theme: Theme) => ({
    root: ({
        size,
        active,
        activeProps = null
    }: {
        size: number
        active: boolean
        activeProps: ActiveProps
    }) => {
        let borderColor = active
            ? theme.palette.neutral[600]
            : theme.palette.colors.border

        let svgColor = theme.palette.neutral[active ? 800 : 600]

        const { btnColor, iconColor } = activeProps || {}

        if (btnColor && active) {
            borderColor = theme.palette.colors?.[btnColor] || btnColor
        }

        if (iconColor && active) {
            svgColor = theme.palette.colors?.[iconColor] || iconColor
        }

        let strokePath =
                'svg path:is([stroke]):not([stroke=none]):not([stroke=white])',
            fillPath = 'svg path:is([fill]):not([fill=none])'

        return {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${size}px`,
            height: `${size}px`,
            border: `1px solid ${borderColor}`,
            ...(active && Boolean(btnColor)
                ? { backgroundColor: borderColor }
                : {}),

            borderRadius: `${size <= 25 ? 6 : 8}px`,
            cursor: 'pointer',
            transition: '0.2s',

            [`& ${strokePath}`]: {
                stroke: svgColor
            },
            [`& ${fillPath}`]: {
                fill: svgColor
            },

            [`&:hover ${strokePath}`]: {
                stroke: active ? svgColor : theme.palette.neutral[800]
            },
            [`&:hover ${fillPath}`]: {
                fill: active ? svgColor : theme.palette.neutral[800]
            }
        }
    }
}))

const IconBtn: FC<PropsWithChildren<Props>> = memo(
    ({
        children,
        size = 'small',
        active = false,
        activeProps = null,
        tooltip = {},
        ...props
    }) => {
        const classes = useStyles({
            active,
            activeProps,
            size: size in sizes ? sizes[size] : size
        })

        const render = () => (
            <Box {...props} className={classes.root}>
                {children}
            </Box>
        )

        if (tooltip) {
            return (
                <Tooltip {...tooltip}>
                    {render()}
                </Tooltip>
            )
        }

        return render()
    }
)

export default IconBtn
