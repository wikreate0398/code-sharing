import { createContext, lazy, useContext, useState } from 'react'

const tabs = [
    {
        name: 'Проект',
        type: 'project',
        component: lazy(() => import('./details'))
    },
    {
        name: 'Участники',
        type: 'participant',
        component: lazy(() => import('./participants')),
        enableAfterCreateProject: true
    },
    {
        name: 'Доски',
        type: 'board',
        component: lazy(() => import('./boards')),
        enableAfterCreateProject: true
    }
]

export const AddEditProjectContext = createContext({
    id_project: null,
    isEditMode: false,
    selectedParticipantId: null,
    selectedBoardId: null,
    setSelectedParticipantId: () => {},
    setSelectedBoardId: (id) => {},
    setIdProject: (id_project) => {},
    tabs: tabs,
    tab: tabs[0].type
})

export function useAddEditProjectContext() {
    const {
        isEditMode,
        selectedParticipantId,
        setSelectedParticipantId,
        id_project,
        tabs,
        tab,
        setTab,
        setIdProject,
        selectedBoardId,
        setSelectedBoardId
    } = useContext(AddEditProjectContext)

    return {
        id_project,
        isEditMode,
        selectedParticipantId,
        setSelectedParticipantId,
        tabs,
        tab,
        setTab,
        setIdProject,
        selectedBoardId,
        setSelectedBoardId
    }
}

export const Provider = ({
    children,
    id_project: initialIdProject,
    id_board: initialIdBoard,
    initialTab
}) => {
    const [selectedBoardId, setSelectedBoardId] = useState(
        initialIdBoard || null
    )
    const [selectedParticipantId, setSelectedMember] = useState(null)
    const [tab, setTab] = useState(initialTab || tabs[0].type)
    const [id_project, setIdProject] = useState(initialIdProject || null)
    const handleSelectMemberId = (item) => setSelectedMember(item)

    return (
        <AddEditProjectContext.Provider
            value={{
                isEditMode: Boolean(id_project),
                id_project,
                selectedBoardId,
                selectedParticipantId,
                setSelectedParticipantId: handleSelectMemberId,
                setSelectedBoardId,
                tabs,
                tab,
                setIdProject,
                setTab
            }}
        >
            {children}
        </AddEditProjectContext.Provider>
    )
}
