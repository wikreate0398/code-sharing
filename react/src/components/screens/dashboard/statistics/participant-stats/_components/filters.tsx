import React from 'react'
import DateRangePicker from '#root/src/components/ui/datepicker'
import DropDown from '#root/src/components/ui/dropdown/index.tsx'
import Stack from '@mui/material/Stack'
import ProjectIcon from '#root/src/components/ui/svg-icons/icons/project-icon'
import { Typography } from '@mui/material'
import ArrowDown from '#root/src/components/ui/svg-icons/icons/arrow-down'
import useStyles from '#root/src/components/screens/dashboard/statistics/participant-stats/styles'
import { useSelector } from 'react-redux'
import { selectPeriod } from '#root/src/redux/slices/meta.slice'
import { useActions } from '#root/src/helpers/hooks'
import Calendar from '#root/src/components/ui/svg-icons/icons/calendar'

const Filters = ({ allProjects, selectedProject, handleSelectProject }) => {
    const classes = useStyles()
    const period = useSelector(selectPeriod)
    const { setPeriodAction } = useActions()

    return (
        <Stack
            display="flex"
            alignItems="center"
            flexDirection="row"
            className={classes.filtersRoot}
        >
            <DateRangePicker
                value={[period.from, period.to]}
                handleSearch={setPeriodAction}
                todayMaxDay
                className={classes.filterCard}
                icon={<Calendar />}
            />

            <DropDown
                propsChildren={{ style: { flex: 1 } }}
                data={allProjects}
                onSelect={handleSelectProject}
            >
                <Stack className={classes.filterCard}>
                    <ProjectIcon />
                    <Typography>{selectedProject}</Typography>
                    <ArrowDown size={14} style={{ marginLeft: 'auto' }} />
                </Stack>
            </DropDown>
        </Stack>
    )
}

export default Filters
