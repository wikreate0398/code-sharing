import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/system'

export default makeStyles((theme: Theme) => ({
    root: {
        '&.MuiAutocomplete-popper': {
            margin: '5px 0!important'
        },
    },
    input: ({
        disableClearable,
        hasChips
    }: {
        disableClearable?: boolean
        hasChips?: boolean
    }) => ({
        '& .rendered-tags': {
            gap: '8px',
            display: 'flex',
            flexWrap: 'wrap'
        },
        padding: disableClearable
            ? '9px 14px !important'
            : '9px 9px 39px 14px !important',
        '& input.MuiAutocomplete-input.MuiInputBase-input': {
            display: hasChips ? 'none' : 'block', // in case if there are no chips don't prevent removing of input
            padding: '0 !important'
        },

        '&.open': {
            '& input.MuiAutocomplete-input.MuiInputBase-input': {
                display: 'block'
            },
            '& fieldset.MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(66, 96, 242, 1) !important',
                boxShadow: '0px 0px 0px 3px rgba(232, 240, 254, 1)'
            }
        }
    }),
    listbox: {
        '&.MuiAutocomplete-listbox': {
            padding: '4px',
            gap: '2px'
        }
    },
    listItem: {
        '&.MuiAutocomplete-option': {
            height: 32,
            gap: '9px',
            borderRadius: 6,
            cursor: 'pointer',
            padding: '0 8px',
            display: 'flex',
            justifyContent: 'flex-start',
            '&:hover': {
                background: 'rgba(0,0,0,0.05)'
            },
            '&[aria-selected="true"], &.Mui-focused[aria-selected="true"], &.Mui-focused':
                {
                    background: 'transparent',
                    '&:hover': {
                        background: 'rgba(0,0,0,0.05)'
                    }
                }
        }
    }
}))
