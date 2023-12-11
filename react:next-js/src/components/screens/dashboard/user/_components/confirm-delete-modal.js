import React from 'react'
import useStyles from '@/components/screens/dashboard/user/styles'
import { Modal, ModalBody } from '@/components/ui/modal'
import { Button, Stack, Typography } from '@mui/material'

const ConfirmDeleteModal = ({ open, handler }) => {
    const classes = useStyles()

    return (
        <Modal open={open} onClose={handler}>
            <ModalBody>
                <Stack
                    flexDirection="column"
                    gap="32px"
                    className={classes.modalBody}
                >
                    <Typography className={classes.modalTitle}>
                        Вы действительно <br /> хотите удалить учетную запись
                    </Typography>
                    <Stack flexDirection="row" gap="8px">
                        <Button variant="borders" onClick={handler}>
                            Cancel
                        </Button>
                        <Button variant="black" onClick={handler}>
                            Удалить
                        </Button>
                    </Stack>
                </Stack>
            </ModalBody>
        </Modal>
    )
}

export default ConfirmDeleteModal
