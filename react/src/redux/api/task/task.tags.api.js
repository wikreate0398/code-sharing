import { apiService } from '#root/src/redux/api-service.js'
import { arrayMove } from '@dnd-kit/sortable'
import {
    ATTACH_TAG_TO_TASK_MUTATION,
    CREATE_TASK_TAG_MUTATION, DELETE_TASK_TAG_MUTATION, MOVE_TASK_TAG_MUTATION, UPDATE_TASK_TAG_MUTATION
} from '#root/src/graphql/mutations/task-mutation.js'
import {GET_TASK_TAGS} from '#root/src/graphql/queries/task-query.js'
import {updateTaskInCache} from "#root/src/redux/api/task/task.api.js";
import { current } from '@reduxjs/toolkit'

export const taskTagsService = apiService.injectEndpoints({
    endpoints: (build) => ({
        getTaskTags: build.query({
            query: (id_project) => ({
                body: GET_TASK_TAGS,
                variables: { id_project }
            }),
            transformResponse(R) {
                return R.taskTags
            },
            providesTags: ['TaskTags'],
        }),

        createTaskTag: build.mutation({
            query: (data) => ({
                body: CREATE_TASK_TAG_MUTATION,
                variables: data,
                data
            }),
            transformResponse(R) {
                return R?.createTaskTag
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled

                    createTaskTagInCache(data, dispatch)
                }catch (e){}
            }
        }),

        attachTaskTag: build.mutation({
            query: ({ id_tag, id_task }) => ({
                body: ATTACH_TAG_TO_TASK_MUTATION,
                variables: { id_tag, id_task },
                data: { id_tag, id_task }
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled, getState }) {
                const { data: resp } = await queryFulfilled
                updateTaskInCache(resp.attachTaskTag, dispatch)
            }
        }),

        updateTaskTag: build.mutation({
            query: (variables) => {
                return {
                    body: UPDATE_TASK_TAG_MUTATION,
                    variables
                }
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                const patchResArray = updateTaskTagInCache(args, dispatch)

                try {
                    await queryFulfilled
                } catch {
                    patchResArray.forEach((patchRes) => {
                        patchRes.undo()
                    })
                }
            }
        }),

        moveTaskTag: build.mutation({
            query: (variables= {}) => {
                return {
                    body: MOVE_TASK_TAG_MUTATION,
                    variables
                }
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                const patchResArray = updateTaskTagInCache(args, dispatch)

                try {
                    await queryFulfilled
                } catch {
                    patchResArray.forEach((patchRes) => {
                        patchRes.undo()
                    })
                }
            }
        }),

        deleteTaskTag: build.mutation({
            query: ({id}) => ({
                body: DELETE_TASK_TAG_MUTATION,
                variables: { id }
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                const patchResArray = deleteTaskTagFromCache(
                    args,
                    dispatch
                )

                try {
                    await queryFulfilled
                } catch {
                    patchResArray.forEach((patchRes) => {
                        patchRes.undo()
                    })
                }
            }
        }),

    }),
    overrideExisting: true
})

export const createTaskTagInCache = (payload, dispatch) => {
    const {id_project} = payload

    dispatch(
        apiService.util.updateQueryData(
            'getProjectGql',
            parseInt(id_project),
            (immer) => {
                immer?.taskTags.push(payload)
            }
        )
    )

    dispatch(
        apiService.util.updateQueryData(
            'getUserProjectsGql',
            undefined,
            (immer) => {
                const project = immer.find((v) => Number(v.id) === Number(id_project))
                if (Boolean(project)) {
                    project?.taskTags.push(payload)
                }
            }
        )
    )
}

export const updateTaskTagInCache = (args, dispatch) => {
    const { id_project, ...props } = args || {}

    return [
        dispatch(
            apiService.util.updateQueryData(
                'getProjectGql',
                parseInt(id_project),
                (immer) => {
                    handleProjectTags(immer, args)
                }
            )
        ),

        dispatch(
            apiService.util.updateQueryData(
                'getUserProjectsGql',
                undefined,
                (immer) => {
                    const project = immer.find((v) => Number(v.id) === Number(id_project))
                    if (Boolean(project)) handleProjectTags(project, args)
                }
            )
        )
    ]
}

const handleProjectTags = (projectImmer, args) => {
    let tags = projectImmer.taskTags

    const {from, to, ...rest} = args
    if ('from' in args){
        const activeIndex = tags.findIndex(
            ({ id }) => Number(id) === Number(from)
        )

        const overIndex = tags.findIndex(
            ({ id }) => Number(id) === Number(to)
        )

        projectImmer.taskTags = arrayMove(tags, activeIndex, overIndex).map(
            (v, k) => ({...v, position: k+1})
        )
    } else {
        const index = tags.findIndex(
            (i) => Number(i.id) === Number(rest.id)
        )

        Object.assign(projectImmer.taskTags[index], rest)
    }
}

export const deleteTaskTagFromCache = (args, dispatch) => {
    const id_tag = args.id

    return [
        dispatch(
            apiService.util.updateQueryData(
                'getProjectGql',
                parseInt(args.id_project),
                (immer) => {
                    immer.taskTags = immer.taskTags.filter(
                        (v) => parseInt(v.id) !== parseInt(id_tag)
                    )
                }
            )
        ),

        dispatch(
            apiService.util.updateQueryData(
                'getUserProjectsGql',
                undefined,
                (immer) => {
                    const project = immer.find((v) => Number(v.id) === Number(args.id_project))
                    if (Boolean(project)) {
                        project.taskTags = project.taskTags.filter(
                            (v) => parseInt(v.id) !== parseInt(id_tag)
                        )
                    }
                }
            )
        )
    ]
}

export const {
    useCreateTaskTagMutation,
    useAttachTaskTagMutation,
    useUpdateTaskTagMutation,
    useMoveTaskTagMutation,
    useDeleteTaskTagMutation
} = taskTagsService
