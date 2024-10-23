import { apiService } from '#root/src/redux/api-service.js'
import {
    DELETE_TASK_CHECKLIST_COMMENT,
    UPDATE_TASK_CHECKLIST_COMMENT
} from '#root/src/graphql/mutations/task-mutation.js'
import { current } from '@reduxjs/toolkit'

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
                    handleTaskCommentInCache(resp.comment, dispatch, 'CREATE')
                } catch (e) {}
            }
        }),

        updateTaskComment: build.mutation({
            query: (data) => ({
                body: UPDATE_TASK_CHECKLIST_COMMENT,
                variables: data
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data: resp } = await queryFulfilled
                    handleTaskCommentInCache(resp.updateTaskListComment, dispatch, 'UPDATE')
                } catch (e) {}
            }
        }),

        deleteTaskComment: build.mutation({
            query: (id) => ({
                body: DELETE_TASK_CHECKLIST_COMMENT,
                variables: { id }
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data: resp } = await queryFulfilled
                    handleTaskCommentInCache(resp.deleteTaskListComment, dispatch, 'DEL')
                } catch (e) {
                }
            }
        })
    }),
    overrideExisting: true
})

export const handleTaskCommentInCache = (payload, dispatch, action = 'CREATE') => {
    dispatch(
        apiService.util.updateQueryData(
            'getTask',
            Number(payload.id_task),
            (immer) => {
                const { listGroups } = immer
                listGroups.forEach(({ list }) => {

                    const index = list.findIndex(
                        (v) => Number(v.id) === Number(payload.id_list)
                    )

                    if (index !== -1) {
                        if (action === 'CREATE') {
                            list[index].comments.push(payload)
                        } else if (action === 'UPDATE' || action === 'DEL') {

                            const commentIndex =  list[index].comments.findIndex(
                                ({id}) => Number(id) === Number(payload.id)
                            )

                            if (commentIndex !== -1) {
                                if (action === 'DEL') {
                                    list[index].comments.splice(commentIndex /*the index */, 1)
                                } else if (action === 'UPDATE') {
                                    Object.assign(list[index].comments[commentIndex], payload)
                                }
                            }
                        }
                    }
                })
            }
        )
    )
}

export const {
    useCreateTaskCommentMutation,
    useUpdateTaskCommentMutation,
    useDeleteTaskCommentMutation
} = TaskCommentService
