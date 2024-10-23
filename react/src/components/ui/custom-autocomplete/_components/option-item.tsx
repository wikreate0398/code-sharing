import React from 'react'
import { Stack } from '@mui/material'
import { textColorToBg } from '#root/src/helpers/functions'
import Avatar from '#root/src/components/ui/avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '#root/src/components/ui/svg-icons/icons/close-icon'

const OptionItem = ({ option, isSelected, onDelete }) => {
    const { avatar, name, color, color_selected, persistent } = option || {}
    const isTag = Boolean(color)

    let c = isSelected && Boolean(color_selected) ? color_selected : color

    return (
        <Stack
            flexDirection="row"
            gap="8px"
            alignItems="center"
            sx={{
                background: textColorToBg(c),
                borderRadius: '4px',
                minHeight: isTag ? 22 : 'auto',
                padding: isTag ? '3px 8px' : 0
            }}
        >
            {'avatar' in option && (
                <Avatar
                    src={typeof avatar ? avatar : ''}
                    name={name}
                    showName={Boolean(avatar) && name}
                    pointer
                    size={18}
                    sx={{
                        borderRadius: 6
                    }}
                />
            )}
            {!avatar && (
                <Typography variant="subtitle-13" sx={{ color: c }}>
                    {name}
                </Typography>
            )}
            {onDelete && !persistent && (
                <IconButton
                    color={c}
                    onClick={onDelete}
                    size="small"
                    sx={{ padding: '2px' }}
                >
                    <CloseIcon size={12} color={c} />
                </IconButton>
            )}
        </Stack>
    )
}

export default OptionItem
