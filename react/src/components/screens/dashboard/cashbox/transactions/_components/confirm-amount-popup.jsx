import { makeStyles } from '@mui/styles'
import React, { useEffect, useState } from 'react'
import { useNotify } from '#root/src/helpers/hooks'
import { confirmAlert, priceString } from '#root/src/helpers/functions'
import { requestHandler } from '#root/src/redux/api-service'
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state'
import AntSwitch from '#root/src/components/ui/form/switch/ant-switch'
import { Popover, Stack } from '@mui/material'
import Input from '#root/src/components/ui/form/input'
import Icon from '#root/src/components/ui/icon'
import CustomButton from '#root/src/components/ui/button/custom-button'

const useStyles = makeStyles((theme) => ({
    rootConfirmPopup: {
        position: 'relative'
    },
    triangle: {
        position: 'absolute',
        width: 0,
        height: 0,
        border: '14px solid transparent',
        borderTop: 0,
        borderBottom: '8px solid white',
        borderRadius: '3px',

        top: -23,
        right: 0,
        left: 0,
        margin: '0 auto'
    }
}))

const ConfirmAmountPopup = ({
    switchStatus,
    id,
    accrued,
    isPlanned,
    amount: initialAmount
}) => {
    const classes = useStyles()
    const [confirmAmount, setConfirmAmount] = useState(initialAmount)
    const notify = useNotify()

    useEffect(() => {
        setConfirmAmount(initialAmount)
    }, [initialAmount])

    const buttonStyle = {
            width: 35,
            minWidth: 35,
            height: 35,
            padding: 0,
            borderRadius: '6px'
        },
        inputProps = {
            sx: {
                '& .MuiInputBase-root': {
                    height: 50,
                    width: 150,
                    paddingRight: '7px'
                }
            }
        }

    const anchorOrigin = {
            vertical: 'bottom',
            horizontal: 'center'
        },
        transformOrigin = {
            vertical: 'top',
            horizontal: 'center'
        }

    const handleChange = (e) => {
        if (confirmAlert()) {
            switchStatus({
                id,
                status: Boolean(e.target.checked)
            })
        }
    }

    const handleConfirmAmount = ({ onSuccess }) => {
        if (confirmAmount > initialAmount || confirmAmount <= 0) {
            return notify(
                `Указанная сумма должнга быть больше 0 и не должна превышать ${priceString(
                    initialAmount
                )}`,
                false
            )
        }

        switchStatus({
            id,
            status: true,
            amount: confirmAmount
        }).then((result) =>
            requestHandler({
                result,
                on200Http: ({ message, status }) => {
                    notify(message, status)
                    if (status) onSuccess && onSuccess()
                }
            })
        )
    }

    return (
        <PopupState variant="popover" popupId="planned-popup-menu">
            {(popupState) => {
                return (
                    <>
                        <AntSwitch
                            {...(isPlanned
                                ? { ...bindTrigger(popupState) }
                                : {
                                      handleChange
                                  })}
                            checked={accrued}
                            label={isPlanned ? 'План' : 'Оплачен'}
                        />

                        <Popover
                            {...bindPopover(popupState)}
                            anchorOrigin={anchorOrigin}
                            transformOrigin={transformOrigin}
                            onClose={() => {
                                popupState.close()
                                setConfirmAmount(initialAmount)
                            }}
                            sx={{
                                '& .MuiPaper-root': {
                                    marginTop: '15px',
                                    overflow: 'unset',
                                    padding: '16px',
                                    boxShadow: '0px 4px 12px 0px #00000033'
                                }
                            }}
                        >
                            <Stack className={classes.rootConfirmPopup}>
                                <div className={classes.triangle} />
                                <Input
                                    type="number"
                                    value={confirmAmount}
                                    onChange={(e) =>
                                        setConfirmAmount(Number(e.target.value))
                                    }
                                    endAdornment={
                                        <CustomButton
                                            icon={
                                                <Icon
                                                    name="checked-white"
                                                    size="35,35"
                                                />
                                            }
                                            sx={buttonStyle}
                                            onClick={() =>
                                                handleConfirmAmount({
                                                    onSuccess: popupState.close
                                                })
                                            }
                                        />
                                    }
                                    inputProps={inputProps}
                                />
                            </Stack>
                        </Popover>
                    </>
                )
            }}
        </PopupState>
    )
}

export default ConfirmAmountPopup
