import { apiService } from '#root/src/redux/api-service.js'
import { arrayMove } from '@dnd-kit/sortable'
import {
    CREATE_CHECKLIST_GROUP,
    DELETE_CHECKLIST_GROUP,
    UPDATE_CHECKLIST_GROUP
} from '#root/src/graphql/mutations/task-mutation.js'

export const taskChecklistService = apiService.injectEndpoints({
    endpoints: (build) => ({
        createChecklistGroup: build.mutation({
            query: (data) => ({
                body: CREATE_CHECKLIST_GROUP,
                variables: data,
                data
            }),
            async onQueryStarted({ id_task }, { dispatch, queryFulfilled }) {
                try {
                    const { data: resp } = await queryFulfilled
                    updateChecklistGroupInCache(
                        resp?.createTaskListGroup,
                        id_task,
                        dispatch,
                        'add'
                    )
                } catch {}
            }
        }),

        deleteChecklistGroup: build.mutation({
            query: ({ id }) => ({
                body: DELETE_CHECKLIST_GROUP,
                variables: { id }
            }),
            async onQueryStarted(
                { id, id_task },
                { dispatch, queryFulfilled }
            ) {
                const patch = updateChecklistGroupInCache(
                    { id },
                    id_task,
                    dispatch,
                    'delete'
                )
                try {
                    await queryFulfilled
                } catch {
                    patch.undo()
                }
            }
        }),

        updateChecklistGroup: build.mutation({
            query: (data) => ({
                body: UPDATE_CHECKLIST_GROUP,
                variables: data
            }),
            async onQueryStarted(
                { id_task, ...args },
                { dispatch, queryFulfilled }
            ) {
                const patch = updateChecklistGroupInCache(
                    args,
                    id_task,
                    dispatch,
                    'update'
                )
                try {
                    await queryFulfilled
                } catch (e) {
                    patch.undo()
                }
            }
        }),

        createChecklist: build.mutation({
            query: (data) => ({
                url: `kanban/tasks/checklist/create`,
                method: 'POST',
                data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data: resp } = await queryFulfilled
                    createChecklistInCache({...resp.list, ...args}, dispatch)
                } catch (e) {}
            }
        }),

        updateChecklist: build.mutation({
            query: (data) => ({
                url: `kanban/tasks/checklist/update`,
                method: 'POST',
                data
            }),
            async onQueryStarted({ id_group }, { dispatch, queryFulfilled }) {
                try {
                    const { data: resp } = await queryFulfilled
                    if (resp.list.deleted_at) {
                        deleteChecklistFromCache(
                            resp.list.id,
                            resp.list.id_task,
                            id_group,
                            dispatch
                        )
                    } else {
                        updateChecklistInCache({...resp.list, id_group}, dispatch)
                    }
                } catch (e) {}
            }
        }),

        markChecklist: build.mutation({
            query: (data) => ({
                url: `kanban/tasks/checklist/mark`,
                method: 'POST',
                data
            }),
            async onQueryStarted({ id_group }, { dispatch, queryFulfilled }) {
                try {
                    const { data: resp } = await queryFulfilled
                    updateChecklistInCache({...resp.list, id_group}, dispatch)
                } catch (e) {}
            }
        }),

        moveChecklist: build.mutation({
            query: (data) => ({
                url: `kanban/tasks/checklist/move/${data.id_task}/${data.id_group}/${data.from}/${data.to}`,
                method: 'POST'
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                const { from, to, id_task, id_group } = args
                const patch = moveChecklistInCache(
                    from,
                    to,
                    id_task,
                    id_group,
                    dispatch
                )

                try {
                    await queryFulfilled
                } catch (e) {
                    patch.undo()
                }
            }
        })
    }),
    overrideExisting: true
})

export const updateChecklistGroupInCache = (
    payload,
    id_task,
    dispatch,
    action
) => {
    return dispatch(
        apiService.util.updateQueryData(
            'getTask',
            parseInt(id_task),
            (immer) => {
                const { listGroups, ...restImmer } = immer
                if (action === 'delete') {
                    return {
                        ...restImmer,
                        listGroups: listGroups.filter(
                            (i) => Number(i.id) !== Number(payload.id)
                        )
                    }
                }
                if (action === 'add') {
                    return {
                        ...restImmer,
                        listGroups: [...listGroups, { ...payload }]
                    }
                }

                const l = listGroups.find(
                    (i) => Number(i.id) === Number(payload.id)
                )

                Object.assign(l, payload)

                return immer
            }
        )
    )
}

export const createChecklistInCache = (payload, dispatch) => {
    const { id_task, id_group } = payload
    return dispatch(
        apiService.util.updateQueryData(
            'getTask',
            parseInt(id_task),
            (immer) => {
                const { listGroups } = immer

                const group = listGroups.find(
                    (i) => Number(i.id) === Number(id_group)
                )

                group.list = [...group.list, { ...payload, comments: [] }]
            }
        )
    )
}

export const updateChecklistInCache = (payload, dispatch) => {
    const { id_task, id_group } = payload
    return dispatch(
        apiService.util.updateQueryData(
            'getTask',
            parseInt(id_task),
            (immer) => {
                const { listGroups } = immer
                const l = listGroups.find(
                    (i) => Number(i.id) === Number(id_group)
                )

                let C = l.list.find((i) => Number(i.id) === Number(payload.id))

                Object.assign(C, payload)

                return immer
            }
        )
    )
}

export const deleteChecklistFromCache = (
    id_list,
    id_task,
    id_group,
    dispatch
) => {
    dispatch(
        apiService.util.updateQueryData(
            'getTask',
            parseInt(id_task),
            (immer) => {
                const { listGroups } = immer
                const l = listGroups.find(
                    (i) => Number(i.id) === Number(id_group)
                )

                l.list = l.list.filter((i) => Number(i.id) !== Number(id_list))

                return immer
            }
        )
    )
}

export const moveChecklistInCache = (from, to, id_task, id_group, dispatch) =>
    dispatch(
        apiService.util.updateQueryData(
            'getTask',
            parseInt(id_task),
            (immer) => {
                const { listGroups, ...restImmer } = immer
                const l = listGroups.find(
                    (i) => Number(i.id) === Number(id_group)
                )

                const activeIndex = l.list.findIndex(
                    ({ id }) => Number(id) === Number(from)
                )

                const overIndex = l.list.findIndex(
                    ({ id }) => Number(id) === Number(to)
                )

                l.list = arrayMove([...l.list], activeIndex, overIndex)

                return immer
            }
        )
    )

export const {
    useCreateChecklistMutation,
    useCreateChecklistGroupMutation,
    useDeleteChecklistGroupMutation,
    useUpdateChecklistGroupMutation,
    useUpdateChecklistMutation,
    useMarkChecklistMutation,
    useMoveChecklistMutation
} = taskChecklistService
