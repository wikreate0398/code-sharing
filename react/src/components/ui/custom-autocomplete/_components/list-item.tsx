import React from 'react'
import classNames from 'classnames'
import Checked from '#root/src/components/ui/svg-icons/icons/checked'
import OptionItem from '#root/src/components/ui/custom-autocomplete/_components/option-item'
import ListItemDndWrapper from '#root/src/components/ui/custom-autocomplete/_components/listItem-dnd-wrapper'
import useStyles from '#root/src/components/ui/custom-autocomplete/styles'

const ListItem = ({ props, option, idDnd = false, hideCheckbox = false, selectable = false, OptionEndAdornment = null }) => {
    let id = option.id

    const rest = {
        props,
        option,
        selectable,
        hideCheckbox,
        OptionEndAdornment
    }

    if (idDnd)
        return (
            <ListItemDndWrapper id={id}>
                <Body rest={rest} />
            </ListItemDndWrapper>
        )

    return <Body rest={rest} />
}

const Body = ({ rest, ...dnd }) => {
    const classes = useStyles()
    const { icon = null, setNodeRef = null, ...dndRest } = dnd || {}
    const { option, selectable, OptionEndAdornment, props, hideCheckbox } = rest || {}
    let isSelected = props['aria-selected']
    let isNew = option?.newItem

    return (
        <li
            {...props}
            className={classNames(props?.className, classes.listItem)}
            ref={setNodeRef}
            {...dndRest}
        >
            {!isNew && icon}
            <OptionItem option={option} />
            {selectable && isSelected && !hideCheckbox ? (
                <Checked style={{ marginLeft: 'auto' }} />
            ) : null}
            {!isNew && OptionEndAdornment && <OptionEndAdornment {...option} />}
        </li>
    )
}

export default ListItem
