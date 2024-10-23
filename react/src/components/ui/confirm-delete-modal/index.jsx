import React from 'react'
import { Modal, ModalBody } from '#root/src/components/ui/modal'
import { Button, Stack, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Icon from '#root/src/components/ui/icon'
import CustomButton from '#root/src/components/ui/button/custom-button'

const useStyles = makeStyles((theme) => ({
    modalBody: {
        maxWidth: 320,
        margin: '0 auto',
        padding: '37px 0 0',
        '& button': {
            flex: 1,
            width: '100%'
        }
    },
    modalTitle: {
        fontSize: '24px',
        lineHeight: '33px',
        fontWeight: 600,
        textAlign: 'center',
        color: '#000000'
    }
}))

const ConfirmDeleteModal = ({
    open,
    onClose,
    onDelete,
    message = 'Вы действительно хотите удалить'
}) => {
    const classes = useStyles()

    return (
        <Modal open={open} onClose={onClose}>
            <ModalBody>
                <Stack
                    flexDirection="column"
                    gap="32px"
                    className={classes.modalBody}
                >
                    <Typography className={classes.modalTitle} dangerouslySetInnerHTML={{__html: message}}/>
                    <Stack flexDirection="row" gap="8px">
                        <CustomButton
                            variant="outlined"
                            label="Отмена"
                            onClick={onClose}
                        />

                        <CustomButton
                            label="Удалить"
                            onClick={() => {
                                onDelete()
                                onClose()
                            }}
                        />
                    </Stack>
                </Stack>
            </ModalBody>
        </Modal>
    )
}

export default ConfirmDeleteModal
