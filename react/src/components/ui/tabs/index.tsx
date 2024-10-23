import { Box } from '@mui/material'
import classNames from 'classnames'
import { FC } from 'react'
import { PropsWithChildren } from '#root/src/config/ts-advanced'
import useStyles from '#root/src/components/ui/tabs/styles'
import { BoxProps } from '@mui/material/Box/Box'

interface TabItemProps extends BoxProps {
    active?: boolean
    className?: string
}

interface TabsProps extends BoxProps {
    fontSize?: number
}

export const Tabs: FC<PropsWithChildren<TabsProps>> = ({
    children,
    fontSize = 12,
    ...props
}) => {
    const classes = useStyles({ fontSize })
    return (
        <Box className={classes.root} {...props}>
            {children}
        </Box>
    )
}

export const TabItem: FC<PropsWithChildren<TabItemProps>> = ({
    children,
    active = false,
    className = '',
    ...props
}) => {
    return (
        <Box className={classNames('item', className, { active })} {...props}>
            {children}
        </Box>
    )
}
