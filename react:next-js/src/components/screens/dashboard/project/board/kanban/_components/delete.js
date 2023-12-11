import { useDroppable } from '@dnd-kit/core'
import React from 'react'
import { makeStyles } from '@mui/styles'
import Icon from '@/components/ui/icon'

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        left: '50%',
        gap: '10px',
        color: '#9EA2B2',
        marginLeft: -150,
        bottom: 20,
        width: 300,
        height: 40,
        borderRadius: 5,
        border: '1px dashed',
        backgroundColor: '#fafafa',
        borderColor: ({ isOver }) => (isOver ? 'red' : '#ededed'),
        boxShadow: 'rgba(104, 112, 118, 0.08) 0px 12px 20px 6px'
    }
}))

const Delete = ({ id }) => {
    const { setNodeRef, isOver } = useDroppable({ id })
    const classes = useStyles({ isOver })

    return (
        <div ref={setNodeRef} className={classes.root}>
            <Icon name="trash" width={14} height={16} />
            Удалить
        </div>
    )
}

export default Delete
