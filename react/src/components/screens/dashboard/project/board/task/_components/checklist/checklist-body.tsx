import React, { memo } from 'react'

import { useMarkChecklistMutation } from '#root/src/redux/api/task/task.checklist.api'
import { Box, Checkbox } from '@mui/material'
import {
    flexStartProps,
    preventEventByLinkClick,
    wrapLogins,
    wrapURLs
} from '#root/src/helpers/functions'
import Icon from '#root/src/components/ui/icon'
import EditableArea from '#root/src/components/ui/editable-area'
import classNames from 'classnames'

import type { ChecklistProps } from '#root/src/types/Checklist'
import type { UserProps } from '#root/src/types/User'
import EnterIcon from '#root/src/components/ui/svg-icons/icons/enter-icon'
import useStyles from '#root/src/components/screens/dashboard/project/board/task/_components/checklist/styles'

interface BodyProps {
    item: ChecklistProps
    id_board: string
    id_group: string
    users: UserProps[]
    handleOnSave: (v: string) => void
    isEditMode: boolean
    enableEditMode: () => void
}

const ChecklistBody = ({
    item,
    id_board,
    id_group,
    users,
    handleOnSave,
    isEditMode,
    enableEditMode
}: BodyProps) => {
    const [markChecklist] = useMarkChecklistMutation()
    const classes = useStyles()

    if (isEditMode)
        return (
            <EditableArea
                disableBorderRadius
                className="name"
                value={item.name}
                triggOnEnter
                saveOnClickOutside
                save={handleOnSave}
                hasMention
                users={users}
                bodyClassName={classNames(
                    classes.addCheckbox,
                    classes.addCheckboxInput
                )}
                startIcon={<div className={classes.disabledCheckbox} />}
                endIcon={<EnterIcon />}
            />
        )

    return (
        <Box
            {...flexStartProps('start')}
            width="100%"
            gap="10px"
            className={classNames(classes.checklist_body)}
        >
            <Checkbox
                disableRipple
                className="checkbox"
                onChange={() => {
                    markChecklist({
                        id: item.id,
                        id_group,
                        id_board,
                        state: nextState(item.state)
                    })
                }}
                checked={[2, 3].includes(parseInt(item.state as string))}
                icon={<Icon name="unchecked" width={16} height={16} />}
                checkedIcon={<Icon name="checked" width={16} height={16} />}
                size="small"
            />
            <Box
                className={classNames('name', {
                    checked: parseInt(item.state as string) === 2,
                    lineThrough: parseInt(item.state as string) === 3
                })}
                onClick={(e) => preventEventByLinkClick(e, enableEditMode)}
                dangerouslySetInnerHTML={{
                    __html: wrapLogins(wrapURLs(item.name), users)
                }}
            />
        </Box>
    )
}

const nextState = (state) => {
    const states = [1, 2, 3]
    const index = states.findIndex((v) => v === parseInt(state))

    if (states[index + 1] !== undefined) return states[index + 1]
    return states[0]
}

export default memo(ChecklistBody)
