import {
    ListItem as MuiListItem,
    List,
    ListSubheader as MuiListSubheader,
    ListItemButton,
    DialogTitle,
    Dialog as MuiDialog
} from '@mui/material'
import { makeStyles, styled } from '@mui/styles'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { useFormikContext } from 'formik'
import { pluck } from '#root/src/helpers/functions'
import { useParams} from "#root/renderer/hooks";

const useStyles = makeStyles(() => ({
    root: {}
}))

const SaveBtn = styled(ListItemButton)(() => ({
    '&.MuiListItemButton-root': {
        justifyContent: 'center',
        color: '#fff',
        backgroundColor: '#4281DB',

        '&:hover': {
            backgroundColor: '#4281DB !important'
        }
    }
}))

const Dialog = styled(MuiDialog)(() => ({
    '& .MuiPaper-root': {
        width: '200px'
    }
}))

const ListSubheader = styled(MuiListSubheader)(() => ({
    '&.MuiListSubheader-root': {
        color: 'rgb(66, 129, 219)',
        fontWeight: 'bold'
    }
}))

const ListItem = styled(MuiListItem)(() => ({
    '&.MuiListItem-root': {
        padding: 0,
        '& .MuiButtonBase-root': {
            padding: '12px 16px'
        }
    }
}))

const ColumnsModal = ({ open, handleClose, data }) => {
    const classes = useStyles()
    const { id_board } = useParams()
    const { values, setFieldValue, submitForm } = useFormikContext()
    const [selected, setSelected] = useState([])

    useEffect(() => {
        setSelected(values.columns)
    }, [values.columns])

    const handleSelect = useCallback(
        (id) => {
            setSelected((selected) => {
                if (selected.includes(id)) {
                    return selected.filter((v) => v !== id)
                }

                const items = []
                data.forEach(({ columns, id: id_board }) => {
                    columns.forEach(({ id: id_column }) => {
                        items.push({ id_board, id_column })
                    })
                })

                const { id_board } = items.find(
                    (v) => v.id_column === parseInt(id)
                )
                const boardColumnsIds = pluck(
                    items.filter((v) => v.id_board === id_board),
                    'id_column'
                )

                return [
                    ...selected.filter(
                        (id_column) => !boardColumnsIds.includes(id_column)
                    ),
                    id
                ]
            })
        },
        [selected, data]
    )

    const handleSave = useCallback(() => {
        setFieldValue('columns', selected)
        submitForm()
        handleClose()
    }, [selected, setFieldValue, submitForm, handleClose])

    return (
        <Dialog onClose={handleClose} open={open} className={classes.root}>
            <DialogTitle sx={{ textAlign: 'center' }}>
                Доски/Столбцы
            </DialogTitle>
            <List sx={{ pt: 0 }}>
                {data
                    .filter((v) => v.id !== parseInt(id_board))
                    .map(({ id, name, columns }) => (
                        <Fragment key={id}>
                            <ListSubheader>{name}</ListSubheader>
                            {columns.map(({ id, name }) => (
                                <ListItem disableGutters key={id}>
                                    <ListItemButton
                                        onClick={() => handleSelect(id)}
                                        selected={selected.includes(id)}
                                    >
                                        {name}
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </Fragment>
                    ))}
            </List>

            <SaveBtn className={classes.save} onClick={handleSave}>
                Сохранить
            </SaveBtn>
        </Dialog>
    )
}

export default ColumnsModal
