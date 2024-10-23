//@ts-nocheck

import React, { useCallback, useRef, useState } from 'react'
import { pluck } from '#root/src/helpers/functions'
import { Form, Formik } from 'formik'
import TaskHeader from '#root/src/components/screens/dashboard/project/board/task/_components/task-header'
import Description from '#root/src/components/screens/dashboard/project/board/task/_components/description'
import Checklist from '#root/src/components/screens/dashboard/project/board/task/_components/checklist'
import ActivityLogs from '#root/src/components/screens/dashboard/project/board/task/_components/task-details-general/_components/activity-logs'
import { useUpdateTask } from '#root/src/components/screens/dashboard/project/board/task/hooks'

const TaskDetailsGeneral = ({ data }) => {
    const formRef = useRef()
    const updateTask = useUpdateTask()

    const {
        id: id_task,
        name,
        comment,
        participants,
        columns_relations,
        listGroups
    } = data

    const initialValues = {
        id: id_task,
        name,
        comment,
        participants: pluck(participants, 'id'),
        columns: pluck(columns_relations, 'id_column')
    }

    const handleSubmit = useCallback(
        (values) => {
            updateTask(values)
        },
        [data, updateTask]
    )

    const totalGroups = listGroups.length

    return (
        <Formik
            innerRef={formRef}
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            {({ values, setFieldValue, submitForm }) => (
                <Form>
                    <TaskHeader
                        id={data.id}
                        created_at={data.created_at}
                        name={values.name}
                        author={data.author}
                        setFieldValue={setFieldValue}
                        submitForm={submitForm}
                    />

                    <Description
                        hasMention={true}
                        comment={values.comment}
                        setFieldValue={setFieldValue}
                        submitForm={submitForm}
                    />

                    {listGroups?.map(({ id, name, list = [] }, i) => (
                        <Checklist
                            key={id}
                            isPersistent={i === 0 && totalGroups === 1}
                            isFirst={i === 0}
                            id={id}
                            list={list}
                            id_task={id_task}
                            name={name}
                        />
                    ))}

                    <ActivityLogs id_task={Number(id_task)}/>
                </Form>
            )}
        </Formik>
    )
}

export default TaskDetailsGeneral
