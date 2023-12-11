import React from 'react'
import useStyles from '@/components/screens/dashboard/user/styles'
import useImageUpload from '@/hooks/useImageUpload'
import { FormLabel } from '@mui/material'
import Icon from '@/components/ui/icon'
import Avatar from '@/components/ui/avatar'

const EditUserAvatar = ({ onChange, name, value, fileSize }) => {
    const classes = useStyles()

    const { handleUpload } = useImageUpload({
        fileSize,
        onChange
    })

    return (
        <FormLabel className={classes.avatarWrapper} for={name}>
            <div
                className={classes.uploadBtn}
                onClick={(e) => {
                    e.stopPropagation()
                }}
            >
                <Icon pointer name="upload_photo" v2 />
                Update Image
            </div>

            <input type="file" id={name} onChange={handleUpload} hidden />

            <Avatar
                src={value}
                pointer
                size={168}
                sx={{ borderRadius: '24px' }}
            />
        </FormLabel>
    )
}

export default EditUserAvatar
