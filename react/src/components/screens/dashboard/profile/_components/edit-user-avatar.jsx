import React from 'react'
import useStyles from '#root/src/components/screens/dashboard/profile/styles'
import useImageUpload from '#root/src/hooks/useImageUpload'
import { FormLabel } from '@mui/material'
import Icon from '#root/src/components/ui/icon'
import Avatar from '#root/src/components/ui/avatar'

const EditUserAvatar = ({ onChange, name, value, fileSize }) => {
    const classes = useStyles()

    const { handleUpload } = useImageUpload({
        fileSize,
        onChange
    })

    return (
        <FormLabel className={classes.avatarWrapper} htmlFor={name}>
            <div
                className={classes.uploadBtn}
                onClick={(e) => {
                    e.stopPropagation()
                }}
            >
                <Icon pointer name="upload_photo" v2 />
                Выбрать фото
            </div>

            <input type="file" id={name} onChange={handleUpload} hidden />

            <Avatar
                src={value || '/img/profile-image.png'}
                pointer
                size={168}
                sx={{ borderRadius: '24px' }}
            />
        </FormLabel>
    )
}

export default EditUserAvatar
