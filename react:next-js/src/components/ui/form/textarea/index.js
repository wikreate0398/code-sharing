'use client'

import { Box, TextareaAutosize } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            border: '1px solid #D6D9E0  !important',
            padding: '8.5px 14px',
            minHeight: ({ minHeight }) => minHeight,
            borderRadius: '12px !important',
            width: '100%',
            color: '#000',
            '&::placeholder': {
                color: 'rgba(0, 0, 0, 0.4)',
                fontSize: '14px'
            },
            '&:hover': {
                borderColor: '#BBBECA !important'
            }
        }
    })
)

const Textarea = ({
    name,
    onChange,
    value,
    error = null,
    placeholder,
    minHeight = '50px',
    ...props
}) => {
    const classList = useStyles({ minHeight })
    return (
        <Box {...props}>
            <TextareaAutosize
                name={name}
                onChange={onChange}
                value={value || ''}
                placeholder={placeholder}
                autoCorrect="off"
                className={classList.root}
            />
            {error !== null && (
                <Box mt="5px" color="red">
                    {error}
                </Box>
            )}
        </Box>
    )
}

export default Textarea
