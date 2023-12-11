import { createContext, memo, useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'

export const SvgCtx = createContext({
    color: null,
    activeColor: null,
    hoverColor: null,
    isActive: false,
    className: null,
    width: null,
    height: null,
    pointer: false,
    onMouseEnter: () => {},
    onMouseLeave: () => {}
})

export const withSvgCtx = (Provider) => (Component) => {
    return (props) => {
        return (
            <Provider {...props}>
                <Component />
            </Provider>
        )
    }
}

const useStyles = makeStyles(() => ({
    root: {
        cursor: ({ pointer }) => (pointer ? 'pointer' : 'default')
    }
}))

const SvgIconProvider = memo(
    ({
        children,
        color: defaultColor,
        isActive,
        pointer,
        hoverColor,
        activeColor,
        ...props
    }) => {
        const [color, setColor] = useState(defaultColor)
        const classes = useStyles({ pointer })

        useEffect(() => {
            if (defaultColor) setColor(defaultColor)
        }, [defaultColor])

        useEffect(() => {
            if (isActive) setColor(activeColor || hoverColor)

            return () => {
                setColor(defaultColor)
            }
        }, [isActive])

        return (
            <SvgCtx.Provider
                value={{
                    color,
                    className: classes.root,
                    onMouseEnter: () =>
                        hoverColor && !isActive ? setColor(hoverColor) : null,
                    onMouseLeave: () =>
                        hoverColor && !isActive ? setColor(defaultColor) : null,
                    ...props
                }}
            >
                {children}
            </SvgCtx.Provider>
        )
    }
)

export default SvgIconProvider
