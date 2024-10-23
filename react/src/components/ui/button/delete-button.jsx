import React, { Fragment, memo, useState } from 'react'

import styled from '@emotion/styled'
import Icon from '#root/src/components/ui/icon/index'
import ConfirmDeleteModal from '#root/src/components/ui/confirm-delete-modal/index.jsx'
import { useTheme } from '@mui/styles'

const Btn = styled.button`
    height: 38px;
    padding: 0 14px;
    background: ${({bg}) => bg ? bg : "#fff"};
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    border-radius: 8px;
    outline: none;
    border: none;
    gap: 8px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${({ color }) => color};
`

const DeleteButton = memo(({
                               button = null,
                               handler,
                               modalText = null,
                               name = null,
                               bg = null,
                               ...props
                           }) => {
    const theme = useTheme()
    const [confirmModalOpen, setConfirmModalOpen] = useState(false)
    const handlerDeleteModal = () => setConfirmModalOpen((open) => !open)

    return (
        <>
            {Boolean(button) ? button : (
                <Btn
                    type="button"
                    bg={bg}
                    onClick={handlerDeleteModal}
                    color={theme.palette.colors.delete}
                    {...props}
                >
                    {name || 'Удалить'} <Icon name="delete" width={16} height={16} />
                </Btn>
            )}

            <ConfirmDeleteModal
                open={confirmModalOpen}
                onClose={handlerDeleteModal}
                onDelete={() => {
                    handler()
                    handlerDeleteModal()
                }}
                message={modalText || "Вы действительно <br /> хотите удалить?"}
            />
        </>
    )
})

export default DeleteButton
