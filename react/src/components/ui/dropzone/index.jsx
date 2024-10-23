import React, { useCallback, useEffect, useState } from 'react'
import { createStyles, makeStyles } from '@mui/styles'
import { Box } from '@mui/material'
import Icon from '#root/src/components/ui/icon'
import { Modal } from '@mui/material'
import { empty, isFnc } from '#root/src/helpers/functions'

const useStyles = makeStyles((theme) =>
    createStyles({
        img: {
            width: '60px',
            height: '60px',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            borderRadius: '4px'
        },

        'img-item': {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            border: '1px solid #CACCD4',
            padding: '13px 16px',
            borderRadius: '6px',
            marginBottom: '15px',
            position: 'relative'
        },

        'img-item-content': {
            textAlign: 'left',
            marginLeft: '16px'
        },

        'img-name': {
            color: '#466A89',
            fontSize: '13px',
            marginBottom: '8px'
        },

        ['img-size']: {
            color: 'rgba(0,0,0,.44)',
            fontSize: '13px'
        },

        close: {
            position: 'absolute',
            top: '50%',
            bottom: 0,
            right: '18px',
            marginTop: '-18px',
            cursor: 'pointer'
        },

        'img-inner': {
            cursor: 'pointer',
            position: 'relative',

            '&:hover div': {
                display: 'flex'
            },

            '& img': {
                width: '100%'
            }
        },

        lens: {
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.4)',
            width: '100%',
            justifyContent: 'space-around',
            left: '0px',
            top: '0px',
            height: '100%',
            display: 'none',
            alignItems: 'center',

            '& img': {
                width: '14px'
            }
        },

        'no-image': {
            width: '100%',
            padding: '30px',
            border: '1px dashed #3B70CA',
            borderRadius: '5px',
            cursor: 'pointer',
            position: 'relative',
            '& input': {
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
                left: 0,
                top: 0
            }
        },

        prev: {
            position: 'fixed',
            left: '50px',
            top: '45%',
            cursor: 'pointer',

            '& img': {
                width: '150px'
            }
        },

        next: {
            position: 'fixed',
            right: '50px',
            top: '45%',
            transform: 'rotate(180deg)',
            cursor: 'pointer',

            '& img': {
                width: '150px'
            }
        }
    })
)

export const DropMultipleImages = ({
    uploadedImages,
    onDrop,
    onRemove,
    showMore = false,
    disable = false
}) => {
    return (
        <DropZone
            showMore={showMore}
            uploadedImages={uploadedImages}
            onDrop={onDrop}
            onRemove={onRemove}
            disable={disable}
        />
    )
}

export const DropSingleImage = ({
    uploadedImage,
    onDrop,
    onRemove,
    disable = false
}) => {
    return (
        <DropZone
            singleImage
            uploadedImage={uploadedImage}
            onDrop={onDrop}
            onRemove={onRemove}
            disable={disable}
        />
    )
}

const DropZone = ({
    children,
    uploadedImages = null,
    uploadedImage = null,
    singleImage = false,
    //handleSave = null,
    onDrop = null,
    onRemove = null,
    showMore = false,
    disable = false,
    ...props
}) => {
    let defImages = uploadedImages || []

    if (singleImage) {
        defImages = uploadedImage?.src ? [uploadedImage] : []
    }

    const [images, setImages] = useState(defImages)

    const handleUnset = useCallback(
        (key) => {
            if (disable) return

            setImages(images.filter((v, k) => k !== key))
        },
        [images]
    )

    useEffect(() => {
        if (!isFnc(onDrop)) return
        onDrop(singleImage ? images?.[0] || {} : images)
    }, [images])

    const handleChange = useCallback(
        async (input) => {
            if (input.target.files) {
                let files = Array.from(input.target.files).map((file) => {
                    const fileName = file['name']
                    const fileSize = parseInt(file['size']) / 1000

                    const reader = new FileReader()

                    return new Promise((resolve) => {
                        reader.readAsDataURL(file)

                        reader.onload = function (event) {
                            resolve({
                                src: event.target.result,
                                name: fileName,
                                size: fileSize
                            })
                        }
                    })
                })

                setImages([...images, ...(await Promise.all(files))])
            }
        },
        [images]
    )

    return (
        <>
            <Box {...props}>
                <Box>
                    {images?.map((value, k) => {
                        return (
                            <ImageItem
                                key={k}
                                count={k}
                                gallery={images}
                                index={k}
                                {...value}
                                handleUnset={handleUnset}
                                disable={disable}
                            />
                        )
                    })}
                </Box>
            </Box>

            {empty(images) && !disable && (
                <DropImagesContainer
                    multiple={!singleImage}
                    handleChange={handleChange}
                />
            )}

            {showMore && !singleImage && !empty(images) && !disable && (
                <DropMoreButton handleChange={handleChange} />
            )}

            {/*{!singleImage && <Box display="flex" justifyContent="space-evenly">*/}
            {/*    <ChooseFileBtn handleChange={handleChange}/>*/}
            {/*    {isFnc(handleSave) && <SaveBtn onClick={() => handleSave(images)}/>}*/}
            {/*</Box>}*/}
        </>
    )
}

const DropImagesContainer = ({ handleChange, multiple }) => {
    const classList = useStyles()
    return (
        <Box
            display="flex"
            justifyContent="center"
            className={classList['no-image']}
            padding="24px"
        >
            <Box display="flex" alignItems="center" gap="12px">
                <Icon name="upload-arrow" v2 />
                <Box>
                    <Box component="strong">Upload</Box> jpg. png. gif. svg.
                </Box>
                <input
                    type="file"
                    name="files"
                    accept="image/*"
                    multiple={multiple}
                    onChange={handleChange}
                />
            </Box>
        </Box>
    )
}

const ImageItem = ({
    index,
    src,
    gallery,
    count,
    name,
    size,
    handleUnset,
    disable = false
}) => {
    const classList = useStyles()
    const [openImg, setOpen] = useState(false)

    const handleClickImg = useCallback(() => {
        setOpen(!openImg)
    }, [openImg])

    return (
        <Box className={classList['img-item']}>
            <Box className={classList['img-inner']}>
                <Box
                    className={classList['img']}
                    style={{ backgroundImage: `url(${src})` }}
                />
                <Box className={classList['lens']} onClick={handleClickImg}>
                    <Icon name="search-icon-blur" v2 />
                </Box>
            </Box>
            {openImg && (
                <ModalImg
                    openImg={openImg}
                    count={count}
                    gallery={gallery}
                    src={src}
                    handleClickImg={handleClickImg}
                />
            )}

            <Box className={classList['img-item-content']}>
                <Box className={classList['img-name']}>{name}</Box>
                <Box className={classList['img-size']}>{size}</Box>

                {!disable && (
                    <Icon
                        name="close-circle"
                        className={classList['close']}
                        onClick={() => handleUnset(index)}
                        v2
                    />
                )}
            </Box>
        </Box>
    )
}

const ModalImg = ({ openImg, handleClickImg, count, gallery, src }) => {
    const classList = useStyles()
    const [imgSrc, setImgSrc] = useState(src)
    const [imgPosition, setImgPosition] = useState(count)
    let pos = 0

    const next = () => {
        pos = imgPosition + 1
        if (pos >= gallery.length) {
            pos = 0
        }
        setImgSrc(gallery[pos].src)
        setImgPosition(pos)
    }

    const prev = () => {
        pos = imgPosition - 1
        if (pos <= 0) {
            pos = gallery.length - 1
        }
        setImgSrc(gallery[pos].src)
        setImgPosition(pos)
    }

    const view = gallery.length > 1

    return (
        <Modal
            open={openImg}
            onClose={handleClickImg}
            disableScrollLock
            width="fit-content"
        >
            <Box position="relative">
                {view && (
                    <>
                        <Box className={classList.prev} onClick={prev}>
                            <Icon name="prev" v2 />
                        </Box>
                        <Box className={classList.next} onClick={next}>
                            <Icon name="prev" v2 />
                        </Box>
                    </>
                )}
                <Box
                    component="img"
                    className={classList['bigImg']}
                    src={imgSrc}
                />
            </Box>
        </Modal>
    )
}

const DropMoreButton = ({ handleChange, multiple }) => {
    const classList = useStyles()
    return (
        <Box
            display="flex"
            justifyContent="center"
            className={classList['no-image']}
            padding="11px"
        >
            <Box display="flex" alignItems="center">
                <Box>Add More</Box>
                <input
                    type="file"
                    name="files"
                    accept="image/*"
                    multiple={multiple}
                    onChange={handleChange}
                />
            </Box>
        </Box>
    )
}
