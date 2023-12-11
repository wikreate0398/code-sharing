import { FormControl, FormHelperText, InputLabel } from '@mui/material'
import { Select as MuiSelect } from '@mui/material'
import useStyles from '@/components/ui/form/select/style'
import Icon from '@/components/ui/icon'
import classNames from 'classnames'

const Select = ({
    children,
    label,
    onChange,
    value,
    disabled,
    placeholder,
    error = null,
    ...props
}) => {
    const classList = useStyles()

    const classes = classNames([classList.root], {
        [classList.disabled]: disabled,
        error: Boolean(error)
    })

    return (
        <FormControl
            size="small"
            fullWidth
            error={Boolean(error)}
            className={classes}
        >
            <InputLabel>{label}</InputLabel>

            <MuiSelect
                label={label}
                value={value || ''}
                onChange={onChange}
                IconComponent={(props) => (
                    <Icon
                        {...props}
                        width={12}
                        height={12}
                        name="arrow-select"
                    />
                )}
                disabled={disabled}
                {...props}
                onClose={() => {
                    setTimeout(() => {
                        document.activeElement.blur()
                    }, 0)
                }}
            >
                {children}
            </MuiSelect>

            {Boolean(error) && <FormHelperText error>{error}</FormHelperText>}
        </FormControl>
    )
}

export default Select
