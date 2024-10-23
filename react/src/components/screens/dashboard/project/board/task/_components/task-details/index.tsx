import React, { memo, useEffect, useMemo } from 'react'
import useStyles from '#root/src/components/screens/dashboard/project/board/task/styles'
import Stack from '@mui/material/Stack'
import DatePicker from '#root/src/components/screens/dashboard/project/board/task/_components/task-details/_components/date-picker'
import DeadlineInput from '#root/src/components/screens/dashboard/project/board/task/_components/task-details/_components/deadline-input'
import CustomAutocomplete from '#root/src/components/ui/custom-autocomplete'
import InputSelector from '#root/src/components/screens/dashboard/project/board/task/_components/task-details/_components/input-selector'
import moment from 'moment'
import Footer from '#root/src/components/screens/dashboard/project/board/task/_components/task-details/_components/footer'
import TagIcon from '#root/src/components/ui/svg-icons/icons/tag-icon'
import useTaskDetailsController from '#root/src/components/screens/dashboard/project/board/task/_components/task-details/_hooks/useTaskDetailsController'
import EditTagEndAdornment
    from "#root/src/components/screens/dashboard/project/board/task/_components/task-details/_components/edit-tag-end-adornment";
import BoardsIcon from '#root/src/components/ui/svg-icons/icons/boards'
import {
    empty
} from '#root/src/helpers/functions'
import Timer from '#root/src/components/ui/timer'
import { useProjectContext } from '#root/src/providers/project-provider'
import { useParams } from '#root/renderer/hooks'
import ParticipantsSelection
    from '#root/src/components/screens/dashboard/project/board/task/_components/task-details/_components/participants-selection'

const TaskDetails = ({ task }) => {
    const classes = useStyles()
    const {id_board} = useParams()
    const {isTaskTracking} = useProjectContext()

    const {
        updateTask,
        savedColumns,
        columnsList,
        columns_relations,

        handleCreateTag,
        onDragEndTags,
        selectedTagsIds,
        handleAddTag,
        allTags
    } = useTaskDetailsController()

    const {
        id,
        id_project,
        participants,
        deadline_at,
        estimate_time,
        url,
        urgent,
        archive
    } = task

    return (
        <Stack className={classes.rightSide}>
            {isTaskTracking && <Timer id_project={id_project} id_board={id_board} id_task={id}/>}

            <DatePicker
                id={parseInt(id)}
                deadline_at={deadline_at ? moment(deadline_at) : null}
            />

            <DeadlineInput id={id} estimate_time={estimate_time} />

            <ParticipantsSelection id_task={Number(id)} task_participants={participants}/>

            <CustomAutocomplete
                selectable
                multiple
                creatable
                filterSelectedOptions
                disableClearable
                draggable={true}
                onDragEnd={onDragEndTags}
                items={allTags || []}
                values={selectedTagsIds}
                handleChange={handleAddTag}
                handleCreate={handleCreateTag}
                renderInput={InputSelector}
                inputProps={{
                    title: 'ТЭГИ',
                    placeholder: empty(selectedTagsIds) ? 'Добавить' : null,
                    startAdornment: <TagIcon />
                }}
                optionEndAdornment={EditTagEndAdornment}
            />

            <CustomAutocomplete
                multiple
                filterSelectedOptions
                disableClearable
                items={columnsList || []}

                // initially we need to display all columns even from one board, but
                // if we choose one of the columns then we need to filter all other columns belongs same board
                filterItems={(arr) => arr?.filter(b => !columns_relations?.some(c => Number(c.id_board) === Number(b?.id_board)))}
                values={savedColumns.map(String)}
                handleChange={(ids) => updateTask({ id, columns: ids })}
                renderInput={InputSelector}
                inputProps={{
                    title: 'ДОСКИ',
                    placeholder: '',
                    startAdornment: <BoardsIcon />
                }}
            />

            <Footer
                id={parseInt(id)}
                url={url}
                urgent={urgent}
                archive={archive}
            />
        </Stack>
    )
}

export default TaskDetails
