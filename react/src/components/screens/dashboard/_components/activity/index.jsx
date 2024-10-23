import { Stack } from '@mui/material'
import React, {
    createContext,
    forwardRef, useCallback, useEffect,
    useImperativeHandle,
    useState
} from 'react'
import DailyAxis from '#root/src/components/screens/dashboard/_components/activity/daily-axis'
import DayActivity from '#root/src/components/screens/dashboard/_components/activity/day-activity'
import { useSelector } from 'react-redux'
import { selectPeriod } from '#root/src/redux/slices/meta.slice'
import EditWorkedTimeModal
    from '#root/src/components/screens/dashboard/_components/activity/modals/edit-workedtime-modal.jsx'

export const ActivityContextProvider = createContext({
    day: null,
    period: { from: null, to: null },
    id_project: null,
    login: null,
    id_user: null,
    setDay: () => {},
    handleEditModal: () => {},
    openEditModal: false
})

const Activity = forwardRef(({
     id_project,
     login = null,
     id_user,
 }, ref) => {
    const period = useSelector(selectPeriod)
    const [day, setDay] = useState(null)
    const [openEditModal, setEditModal] = useState(false)

    const handleDay = useCallback((d) =>  {
        setDay(d)
    }, [setDay])

    useImperativeHandle(
        ref,
        () => ({
            setDay: handleDay
        }),
        [day]
    )

    const handleEditModal = useCallback(() => setEditModal(!openEditModal), [openEditModal])

    return (
        <ActivityContextProvider.Provider
            value={{
                period,
                day,
                setDay: handleDay,
                id_project,
                login,
                handleEditModal,
                openEditModal,
                id_user
            }}
        >
            <Stack flexDirection="column" gap="30px">
                <EditWorkedTimeModal open={openEditModal}
                                     day={day}
                                     id_user={id_user}
                                     handleClose={handleEditModal}/>
                {Boolean(period.from) && <DailyAxis />}
                {Boolean(day) && <DayActivity />}
            </Stack>
        </ActivityContextProvider.Provider>
    )
})

export default Activity
