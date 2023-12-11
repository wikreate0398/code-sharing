import { useCallback, useState } from 'react'

const ModalBtn = ({ children }) => {
    const [open, setOpen] = useState(false)

    const handleModal = useCallback(() => {
        setOpen(!open)
    }, [open])

    return children({ handleModal, open })
}

export default ModalBtn
