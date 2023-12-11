import { Box, Popover, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { empty, isFnc } from '@/helpers/functions'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'
import PopoverInput from '@/components/ui/popover-input'
import classNames from 'classnames'

const useStyles = makeStyles((theme) => ({
    root: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },

    value: {
        fontSize: ({ size }) => `${size}px`,
        ...theme.typography.font2,
        '&.editable': {
            cursor: 'pointer'
        }
    },

    symbol: () => ({
        marginLeft: '4px !important',
        color: 'rgba(0,0,0,.4)',
        display: 'inline-block',
        lineHeight: '100%'
    })
}))

const AnalyticValue = ({
    value: initialValue,
    symbol,
    label,
    symbolSize = false,
    size = 30,
    onEnter = false
}) => {
    const classes = useStyles({
        size
    })

    let value = initialValue
    if (typeof initialValue === 'object' && empty(initialValue)) {
        value = 0
    }

    return (
        <Box className={classes.root}>
            {typeof value === 'object' ? (
                <Box display="flex" justifyContent="center" gap="5px">
                    {value.map((v, k) => (
                        <Box whiteSpace="nowrap" key={k}>
                            <Typography
                                variant="font2"
                                className={classNames(classes.value)}
                            >
                                {v}
                            </Typography>

                            <Typography
                                variant="font3"
                                className={classes.symbol}
                                {...(symbolSize ? { component: 'sup' } : {})}
                                fontSize={`${symbolSize || size}px`}
                            >
                                {symbol[k]}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Box>
                    <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                            <>
                                <Typography
                                    variant="font2"
                                    className={classNames(classes.value, {
                                        editable: isFnc(onEnter)
                                    })}
                                    {...(isFnc(onEnter)
                                        ? bindTrigger(popupState)
                                        : {})}
                                >
                                    {value}
                                </Typography>
                                <Popover
                                    {...bindPopover(popupState)}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center'
                                    }}
                                >
                                    <PopoverInput
                                        value={value}
                                        onEnter={(param) => {
                                            onEnter(param)
                                            popupState.close()
                                        }}
                                    />
                                </Popover>
                            </>
                        )}
                    </PopupState>

                    <Typography
                        variant="font3"
                        className={classes.symbol}
                        {...(symbolSize ? { component: 'sup' } : {})}
                        fontSize={`${symbolSize || size}px`}
                    >
                        {symbol}
                    </Typography>
                </Box>
            )}
            {Boolean(label) && (
                <Typography variant="small-gray" mt="5px">
                    {label}
                </Typography>
            )}
        </Box>
    )
}

export default AnalyticValue
