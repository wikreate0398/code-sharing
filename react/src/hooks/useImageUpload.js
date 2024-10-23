import React, { useEffect, useRef } from 'react'
import { useNotify } from '#root/src/helpers/hooks'
import { isBase64 } from '#root/src/helpers/functions'
import { maximumFileSize } from '#root/src/config/validation-messages'

const useImageUpload = (props) => {
    const { fileSize, onChange, value = null } = props || {}
    const notify = useNotify()
    const imageRef = useRef({})
    let isImage = Boolean(imageRef.current)

    useEffect(() => {
        if (isImage && value) {
            imageRef.current.src = value
        }
    }, [value, imageRef])

    const handleUpload = (e) => {
        const reader = new FileReader()
        const file = e.target.files[0]

        if (file.size / 1024 / 1024 > fileSize) {
            return notify(maximumFileSize(fileSize), 'error')
        }

        reader.readAsDataURL(file)

        reader.onload = ({ target }) => {
            if (isImage) imageRef.current.src = target.result
        }

        onChange(e)
    }

    return { handleUpload, imageRef }
}

export default useImageUpload
