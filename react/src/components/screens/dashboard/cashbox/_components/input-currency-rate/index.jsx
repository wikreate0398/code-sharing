import Icon from '#root/src/components/ui/icon'
import { Stack, Typography } from '@mui/material'
import getOr from 'lodash/fp/getOr'
import React, { useEffect, useState } from 'react'
import s from './styles.module.css'

const InputCurrencyRate = ({
    rate: initialRate,
    fromWallet,
    toWallet,
    handleSetRate
}) => {
    const fromIso = getOr(null, ['currency', 'iso'], fromWallet)
    const toIso = getOr(null, ['currency', 'iso'], toWallet)
    const [isEdit, setIsEdit] = useState(false)
    const [rate, setRate] = useState(initialRate)

    useEffect(() => {
        if (!isNaN(initialRate)) setRate(initialRate)
    }, [initialRate])

    const onSet = () => {
        setIsEdit(false)
        handleSetRate(rate)
    }

    let isEditable = fromIso !== toIso

    return (
        <Stack flexDirection="row" gap="6px" className={s.root}>
            <Typography fontSize="12px" className={s.text}>
                1 {fromIso}
            </Typography>
            <Typography fontSize="12px" className={s.text}>
                =
            </Typography>
            {isEdit ? (
                <input
                    type="number"
                    autoFocus
                    value={rate || ''}
                    className={s.rateInput}
                    onBlur={() => onSet()}
                    onKeyDown={(event) => {
                        if (
                            event.code === 'Enter' ||
                            event.code === 'NumpadEnter'
                        ) {
                            event.preventDefault()
                            onSet()
                        }
                    }}
                    onChange={(e) => {
                        setRate(e.target.value)
                    }}
                />
            ) : (
                <Typography
                    fontSize="12px"
                    className={s.text}
                    style={{
                        textDecoration: isEditable ? 'underline' : 'none',
                        cursor: 'pointer'
                    }}
                    onClick={() => isEditable && setIsEdit(true)}
                >
                    {rate} {toIso}
                </Typography>
            )}

            <Icon name="transfer-vertical" size="22,20" pointer />
        </Stack>
    )
}

export default InputCurrencyRate
