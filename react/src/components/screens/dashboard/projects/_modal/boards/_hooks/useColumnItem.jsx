import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useUpdateBoardColumnGqlMutation } from '#root/src/redux/api/column.api'

const useColumnItem = (item) => {
    const [expanded, setExpanded] = useState(false)
    const [active, setActive] = useState(false)
    const [updateBoardColumn] = useUpdateBoardColumnGqlMutation()

    const handler = useCallback(() => setActive(!active), [active])

    const { id, id_board, name, responsible, emoji } = item || {}
    const responsible_count = responsible?.length

    const [value, setValue] = useState(name)
    const [opened, setOpenEmoji] = useState(false)

    useEffect(() => {
        if (name) setValue(name)
    }, [name])

    const handleChange = (e) => setValue(e.target.value)

    const handleSubmitValue = useCallback(async () => {
        setActive(false)

        if (name !== value)
            await updateBoardColumn({ id_board, id, name: value, emoji })
    }, [id, id_board, name, updateBoardColumn, value, emoji])

    const handleSubmitEmoji = useCallback(
        async (item) => {
            setOpenEmoji(false)

            await updateBoardColumn({ id_board, id, name, emoji: item.native })

            setOpenEmoji(false)
        },
        [id, id_board, name, updateBoardColumn]
    )

    const onExpand = () => setExpanded((old) => !old)

    const toggleEmoji = () => setOpenEmoji((old) => !old)

    const emojiRef = useRef()

    return {
        expanded,
        handler,
        responsible_count,
        opened,
        handleChange,
        handleSubmitValue,
        handleSubmitEmoji,
        onExpand,
        toggleEmoji,
        emojiRef,
        setOpenEmoji,
        active,
        value
    }
}

export default useColumnItem
