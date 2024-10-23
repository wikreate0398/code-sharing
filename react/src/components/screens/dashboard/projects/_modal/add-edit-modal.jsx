
import { Modal } from '#root/src/components/ui/modal'
import React, { Suspense } from 'react'
import ContainerLoader from '#root/src/components/ui/loader/container-loader'
import Header from '#root/src/components/screens/dashboard/projects/_modal/header'
import {
    Provider,
    useAddEditProjectContext
} from '#root/src/components/screens/dashboard/projects/_modal/context'

const AddEditModal = ({
    open,
    handler,
    item = null,
    id_board = null,
    initialTab = null
}) => {
    return (
        <Modal
            open={open}
            onClose={handler}
            width="fit-content"
            minWidth={350}
            height="fit-content"
        >
            <Provider
                id_project={item?.id ? parseInt(item?.id) : null}
                id_board={id_board}
                initialTab={initialTab}
            >
                <Content item={item} handler={handler} />
            </Provider>
        </Modal>
    )
}

const Content = ({ item = null, handler }) => {
    const { tab, tabs } = useAddEditProjectContext()

    const tabObj = tabs.find((v) => v.type === tab)
    const { component: Component } = tabObj || tabs[0]

    return (
        <Suspense fallback={<ContainerLoader minHeight={500} minWidth={350} />}>
            <Component handler={handler}>
                <Header title={item ? 'Редактировать' : 'Добавить'} />
            </Component>
        </Suspense>
    )
}

export default AddEditModal
