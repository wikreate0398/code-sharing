import { apiService } from '@/redux/api-service'

export const TaskCommentService = apiService.injectEndpoints({
    endpoints: (build) => ({
        createTaskComment: build.mutation({
            query: (data) => ({
                url: `kanban/tasks/comments/create`,
                method: 'POST',
                data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data: resp } = await queryFulfilled
                    addTaskCommentInCache(resp.comment, args.id_task, dispatch)
                } catch (e) {}
            }
        })
    }),
    overrideExisting: true
})

export const addTaskCommentInCache = (payload, id_task, dispatch) => [
    dispatch(
        apiService.util.updateQueryData(
            'getTask',
            parseInt(id_task),
            (immer) => {
                return {
                    ...immer,
                    list: immer.list.map((v) => ({
                        ...v,
                        comments:
                            v.id === parseInt(payload.id_list)
                                ? [...v.comments, payload]
                                : v.comments
                    }))
                }
            }
        )
    )
]

export const { useCreateTaskCommentMutation } = TaskCommentService
