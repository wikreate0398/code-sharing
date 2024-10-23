import React from 'react'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/system'
import Input from '#root/src/components/ui/form/input'

const useStyles = makeStyles((theme: Theme) => ({
    inputLabel: {
        position: 'relative',
        letterSpacing: '0.5px',
        color: theme.palette.neutral[700],
        textTransform: 'uppercase',
        fontSize: '11px',
        lineHeight: '12px',
        fontWeight: 500,
    }
}))

const InputSelector = (props) => {
    const classes = useStyles()

    return (
        <Input
            {...props}
            _classes={{
                title: classes.inputLabel,
                rightTitle: classes.inputLabel
            }}
            sxInput={{
                '& .MuiInputBase-root': {
                    background: 'white',
                    borderRadius: '8px !important',
                    // padding: '0 12px',

                    '&.MuiAutocomplete-inputRoot': {
                        paddingLeft: '14px'
                    },
                    '& input.MuiInputBase-input': {
                        padding: '10px',
                        paddingLeft: '2px'
                    },
                    '& fieldset.MuiOutlinedInput-notchedOutline': {
                        borderColor: '#fff'
                    }
                }
            }}
        />
    )
}

export default InputSelector
