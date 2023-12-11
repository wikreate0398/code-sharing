import { apiService } from '@/redux/api-service'
import { arrayMove } from '@dnd-kit/sortable'

export const taskChecklistService = apiService.injectEndpoints({
    endpoints: (build) => ({
        createChecklist: build.mutation({
            query: (data) => ({
                url: `kanban/tasks/checklist/create`,
                method: 'POST',
                data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data: resp } = await queryFulfilled
                    createChecklistInCache(resp.list, args.id_task, dispatch)
                } catch (e) {}
            }
        }),

        updateChecklist: build.mutation({
            query: (data) => ({
                url: `kanban/tasks/checklist/update`,
                method: 'POST',
                data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data: resp } = await queryFulfilled
                    if (resp.list.deleted_at) {
                        deleteChecklistFromCache(
                            resp.list.id,
                            resp.list.id_task,
                            dispatch
                        )
                    } else {
                        updateChecklistInCache(
                            resp.list,
                            resp.list.id_task,
                            dispatch
                        )
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
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data: resp } = await queryFulfilled
                    updateChecklistInCache(
                        resp.list,
                        resp.list.id_task,
                        dispatch
                    )
                } catch (e) {}
            }
        }),

        moveChecklist: build.mutation({
            query: (data) => ({
                url: `kanban/tasks/checklist/move/${data.id_task}/${data.from}/${data.to}`,
                method: 'POST'
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                const patch = moveChecklistInCache(
                    args.from,
                    args.to,
                    args.id_task,
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

export const createChecklistInCache = (payload, id_task, dispatch) => {
    dispatch(
        apiService.util.updateQueryData(
            'getTask',
            parseInt(id_task),
            (immer) => {
                return {
                    ...immer,
                    list: [...immer.list, { ...payload, comments: [] }]
                }
            }
        )
    )
}

export const updateChecklistInCache = (payload, id_task, dispatch) => {
    dispatch(
        apiService.util.updateQueryData(
            'getTask',
            parseInt(id_task),
            (immer) => {
                const index = immer.list.findIndex(
                    (v) => v.id === parseInt(payload.id)
                )
                const currentList = immer.list[index]

                return {
                    ...immer,
                    list: [
                        ...immer.list.slice(0, index),
                        { ...currentList, ...payload },
                        ...immer.list.slice(index + 1)
                    ]
                }
            }
        )
    )
}

export const deleteChecklistFromCache = (id_list, id_task, dispatch) => {
    dispatch(
        apiService.util.updateQueryData(
            'getTask',
            parseInt(id_task),
            (immer) => ({
                ...immer,
                list: immer.list.filter((v) => v.id !== parseInt(id_list))
            })
        )
    )
}

export const moveChecklistInCache = (from, to, id_task, dispatch) =>
    dispatch(
        apiService.util.updateQueryData(
            'getTask',
            parseInt(id_task),
            (immer) => {
                const activeIndex = immer.list.findIndex(
                    ({ id }) => id === parseInt(from)
                )
                const overIndex = immer.list.findIndex(
                    ({ id }) => id === parseInt(to)
                )

                return {
                    ...immer,
                    list: arrayMove(immer.list, activeIndex, overIndex)
                }
            }
        )
    )

export const {
    useCreateChecklistMutation,
    useUpdateChecklistMutation,
    useMarkChecklistMutation,
    useMoveChecklistMutation
} = taskChecklistService
