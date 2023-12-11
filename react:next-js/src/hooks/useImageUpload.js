import React, { useEffect, useRef } from 'react'
import { useNotify } from '@/helpers/hooks'
import { isBase64 } from '@/helpers/functions'
import { maximumFileSize } from '@/config/validation-messages'

const useImageUpload = (props) => {
    const { fileSize, onChange, value = null } = props || {}
    const notify = useNotify()
    const imageRef = useRef({})
    let isImage = 'src' in imageRef.current

    useEffect(() => {
        if (isImage && isBase64(value)) {
            imageRef.current.src = value
        }
    }, [value])

    const handleUpload = (e) => {
        console.log('handleUpload', handleUpload)
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
