import { Box, Button, FormLabel } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'
import React from 'react'
import { flexCenterProps } from '@/helpers/functions'
import Image from 'next/image'
import useImageUpload from '@/hooks/useImageUpload'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            ...flexCenterProps('center'),
            flexDirection: 'column',
            gap: '10px'
        },
        avatar: {
            ...flexCenterProps('center'),
            width: '104px',
            height: '104px',
            borderRadius: '100%',
            background: '#E1E4EA',
            overflow: 'hidden',

            '& img': {
                objectFit: 'cover',
                width: '100%',
                height: '100%'
            }
        },
        hidden: {
            width: '0',
            height: '0',
            opacity: '0'
        },
        btn: {
            cursor: 'pointer',

            '& p': {
                fontSize: '15px',
                lineHeight: '22px',
                color: '#000',
                textDecoration: 'underline'
            }
        }
    })
)

const UploadAvatar = ({
    name,
    onChange,
    mb,
    fileSize,
    value,
    error = null,
    isUserProfile = false,
    ...props
}) => {
    const classList = useStyles()

    const { handleUpload, imageRef } = useImageUpload({
        fileSize,
        onChange,
        value
    })

    return (
        <Box mb={mb} className={classList.root}>
            <Box className={classList.avatar}>
                <Image
                    ref={imageRef}
                    src="/img/default-avatar.svg"
                    width={81}
                    height={85}
                    alt="avatar"
                />
            </Box>

            <FormLabel className={classList.btn}>
                <Box component="p">Upload</Box>
                <input
                    type="file"
                    name={name}
                    {...props}
                    onChange={handleUpload}
                    hidden
                />
            </FormLabel>
        </Box>
    )
}

export default UploadAvatar
