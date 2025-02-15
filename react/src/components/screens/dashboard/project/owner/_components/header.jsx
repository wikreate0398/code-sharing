import { Box, Typography } from '@mui/material'
import { flexStartProps, spaceBetweenProps } from '#root/src/helpers/functions'
import ProjectAvatar from '#root/src/components/ui/project-avatar'
import moment from 'moment'
import Icon from '#root/src/components/ui/icon'
import AddEditModal from '#root/src/components/screens/dashboard/projects/_modal/add-edit-modal'
import { useCallback, useContext, useEffect, useState } from 'react'
import { ProjectProviderContext } from '#root/src/providers/project-provider'
import { useSelector } from 'react-redux'
import { selectPeriod } from '#root/src/redux/slices/meta.slice'
import { useActions } from '#root/src/helpers/hooks'
import DateRangePicker from '#root/src/components/ui/datepicker'

const Header = () => {
    const { project } = useContext(ProjectProviderContext)
    const period = useSelector(selectPeriod)
    const { setPeriodAction } = useActions()
    const [open, setOpen] = useState(false)
    const handler = useCallback(() => setOpen(!open), [open])

    if (!project) return null

    const { bg, name, created_at, owner } = project

    return (
        <Box {...spaceBetweenProps()} mb="25px">
            <Box {...flexStartProps('center')} gap="26px" width="100%">
                <ProjectAvatar bg={bg} size={88} name={name} nameSize={30} />
                <Box>
                    <Typography variant="font2" fontSize="32px">
                        {name}
                    </Typography>
                    <Box {...flexStartProps('center')} gap="17px" mt="10px">
                        <Typography variant="p-12">
                            Created: {moment(created_at).format('DD.MM.YYYY')}
                        </Typography>
                        <Typography variant="p-12">By: {owner.name}</Typography>
                    </Box>
                </Box>
            </Box>
            <Box>
                <Box
                    p="5px"
                    mb="10px"
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-end"
                >
                    <Icon
                        name="pencil"
                        pointer
                        width={17}
                        height={17}
                        onClick={handler}
                    />
                    <AddEditModal
                        item={project}
                        open={open}
                        handler={handler}
                    />
                </Box>
                <DateRangePicker
                    value={[period.from, period.to]}
                    todayMaxDay
                    handleSearch={setPeriodAction}
                />
            </Box>
        </Box>
    )
}

export default Header
