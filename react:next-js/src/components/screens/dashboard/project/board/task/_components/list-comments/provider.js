import React, { createContext, useState } from 'react'

export const ListCommentsCtxProvider = createContext({
    open: false,
    id_list: null,
    enableCommentArea: () => {},
    disableCommentArea: () => {}
})

export const CommentsListState = ({ children, id_list }) => {
    const [open, setOpen] = useState(false)

    const args = {
        open,
        id_list,
        enableCommentArea: () => setOpen(true),
        disableCommentArea: () => setOpen(false)
    }

    return (
        <ListCommentsCtxProvider.Provider value={args}>
            {children(args)}
        </ListCommentsCtxProvider.Provider>
    )
}
