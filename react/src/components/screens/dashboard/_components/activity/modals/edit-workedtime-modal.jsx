import { Modal, ModalBody, ModalHeader } from '#root/src/components/ui/modal'
import { Typography, Box, Alert } from '@mui/material'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Form, Formik } from 'formik'
import { useNotify } from '#root/src/helpers/hooks'
import { requestHandler } from '#root/src/redux/api-service'
import FormInner from '#root/src/components/ui/form/form-inner'
import { Table, Thead, Tfoot, Tbody, Tr, Th, Td } from '#root/src/components/ui/table'
import { useLazyGetDayUserTimerActivityForEditGqlQuery, useManageTimerMutation } from '#root/src/redux/api/traking.api'
import _ from 'lodash'
import moment from 'moment'
import {
    confirmAlert, diffBetween, empty, formatDuration
} from '#root/src/helpers/functions'
 import TimerIcon from '#root/src/components/ui/svg-icons/icons/timer-icon'
import Icon from "#root/src/components/ui/icon";
import IconBtn from '#root/src/components/ui/button/icon-button'
import { TimeField } from '@mui/x-date-pickers/TimeField';
import CustomButton from '#root/src/components/ui/button/custom-button/index.jsx'
import { produce } from 'immer'
import ProjectAvatar from '#root/src/components/ui/project-avatar/index.jsx'
import {
    TaskName
} from '#root/src/components/screens/dashboard/statistics/participant-stats/_components/task-stats.jsx'
import { taskRoute } from '#root/src/config/routes.js'

const EditWorkedTimeModal = ({ open, handleClose, day, id_user }) => {
    return (
        <Modal open={open} onClose={handleClose} width={800}>
            <ModalHeader>
                <Typography variant="title-24">
                    Редактировать время за день
                </Typography>
                <br />
                <Typography variant="small-gray">
                    {moment(day).locale('ru').format('D MMM Y')}
                </Typography>
            </ModalHeader>
            <ModalBody>
                <ModalContent modalHandler={handleClose} day={day} id_user={id_user} />
            </ModalBody>
        </Modal>
    )
}

const ModalContent = ({ modalHandler, day, id_user }) => {
    const formRef = useRef()
    const notify = useNotify()
    const [manageTimer] = useManageTimerMutation()

    const [trigger, result] = useLazyGetDayUserTimerActivityForEditGqlQuery()

    const [initialValues, setInitialVal] = useState({
        data: []
    })

    useEffect(() => {
        if (day) trigger({ day, id_user })

        return () => {
            formRef?.current?.resetForm()
        }
    }, [day, id_user])

   useEffect(() => {
        if (result.isSuccess) {
            const array = []
            result.data.forEach((item) => {
                array.push({
                    ...item,
                    fromError: false,
                    toError: false,
                })
            })

           setInitialVal({data: _.orderBy(array, ['from'], ['asc'])})
        }
  }, [result])

    const handleSubmit = useCallback((values, { setErrors }) => {
        manageTimer({ day, id_user, ...values, action: 'update' }).then((result) =>
            requestHandler({
                result,
                onFinishRequest: () => {},
                on200Http: ({ message, status }) => {
                    notify(message, status)
                    if (status) modalHandler()
                },
                on422Error: (errors) => {
                    setErrors(errors)
                }
            })
        )
    }, [modalHandler, id_user])

    if (empty(initialValues.data)) return null

    return (
        <Formik
            innerRef={formRef}
            initialValues={initialValues}
            enableReinitialize={true}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={handleSubmit}
        >
            {({ submitForm, setFieldValue, isSubmitting, handleChange, values, errors }) => {

                const updateTime = (field, id_from, value) => {

                    const {data} = values

                    const currentIndex = data.findIndex((v) => Number(v.id_from) === Number(id_from))
                    const obj = data[currentIndex]

                    const newValue = `${obj.date} ${value?.format('HH:mm:ss')}`
                    const now = moment().format('YYYY-MM-DD HH:mm:ss')

                    const prev = data?.[currentIndex-1]
                    const next = data?.[currentIndex+1]

                    let fromError = false
                    let toError = false

                    if (field === 'from') {
                        if (!value.isValid()
                            || newValue > obj.to
                            || prev && newValue < prev.to
                            || newValue > now) {
                            fromError = true
                        }
                    } else {
                        if (!value.isValid() || newValue < obj.from
                            || next && newValue > next.from
                            || newValue > now) {
                            toError = true
                        }
                    }

                    const isError = fromError || toError

                    const result = produce(data, (draft) => {
                        draft[currentIndex].fromError = fromError
                        draft[currentIndex].toError = toError
                        draft[currentIndex][field] = newValue
                    })

                    setFieldValue('data', isError ? result : _.orderBy(result, ['from'], ['asc']))
                }

                const hasDeniedAccess = values.data.findIndex((v) => !v.can_edit) !== -1

                return (
                    <FormInner loading={result.isLoading}>
                        <Form>
                            {hasDeniedAccess && (
                                <Alert severity="info" sx={{ width: '100%', mb: '20px' }}>
                                    Заблокированное время может менять только администратор проекта
                                </Alert>
                            )}
                            <Table mb="25px">
                                <Thead>
                                    <Tr>
                                        <Th />
                                        <Th>Название задачи</Th>
                                        <Th>Старт</Th>
                                        <Th>Стоп</Th>
                                        <Th>Время <TimerIcon style={{position: 'relative', top: '2px'}}/></Th>
                                        <Th />
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {values.data.map((v, k) => {
                                        return (
                                            <Row value={v}
                                                 updateTime={updateTime}
                                                 day={day}
                                                 id_user={id_user}
                                                 key={v.id_from}/>
                                        )
                                    })}
                                </Tbody>
                                <Tfoot>
                                    <Tr>
                                        <Th colSpan={4} />
                                        <Th>{formatDuration({
                                            ammount: _.sumBy(values.data, (v) => {
                                                return v.to && moment(v.from).isValid() && moment(v.to).isValid() ? diffBetween(v.from, v.to, 'seconds') : 0
                                            }),
                                            useSec: true
                                        })}</Th>
                                        <Th />
                                    </Tr>
                                </Tfoot>
                            </Table>

                            <CustomButton
                                label="Сохранить"
                                disabled={values.data.filter((v) => Boolean(v.fromError) || Boolean(v.toError)).length > 0}
                                loading={isSubmitting}
                                onClick={submitForm}
                            />
                        </Form>
                    </FormInner>
                )
            }}
        </Formik>
    )
}

const Row = memo((props) => {
    
    const {value, id_user, day, updateTime} = props
    const {id_from, can_edit, id_to, id_task, id_project, id_board, from, to, play, project, task_name, fromError, toError} = value
    const [manageTimer] = useManageTimerMutation()

    const isError = fromError || toError

    return (
        <Tr>
            <Td ac>
                <ProjectAvatar
                    bg={project.bg}
                    size={20}
                    name={project?.name}
                />
            </Td>
            <Td>
                <TaskName onClick={() => {
                    window.open(taskRoute(id_project, id_board, id_task), "_blank", "noreferrer");
                }}>{task_name}</TaskName>
            </Td>
            <Td>
                <TimeField size="small"
                           error={fromError}
                           value={moment(from)}
                           disabled={!can_edit}
                           onChange={(value, { validationError }) => {
                               updateTime('from', id_from, value)
                           }}
                           format="HH:mm:ss"/>
            </Td>
            <Td>{to ? (
                <TimeField size="small"
                           error={toError}
                           value={moment(to)}
                           disabled={!can_edit}
                           format="HH:mm:ss"
                           onChange={(value, { validationError }) => {
                               updateTime('to', id_from, value)
                           }}/>
            ) : '-'}</Td>
            <Td noPadding ac style={{background: '#fafafa'}}>
                {Boolean(to) && !isError && <WorkedTime from={from} to={to}/>}
            </Td>
            <Td>
                {can_edit && (
                    <>
                        {play ? (
                            <Box style={{
                                backgroundColor: '#FF0B0B',
                                border: '8px solid #ededed',
                                borderRadius: '5px',
                                padding: '4.5px 4px',
                                cursor: 'pointer'
                            }} onClick={() => {
                                if (confirmAlert()) {
                                    manageTimer({id_user, day, id_from, action: 'stop'})
                                }
                            }}/>
                        ) : (
                            <IconBtn>
                                <Icon name="trash" onClick={() => {
                                    if (confirmAlert()) {
                                        manageTimer({id_user, day, id_from, id_to, action: 'delete'})
                                    }
                                }} pointer size="11.5,12"/>
                            </IconBtn>
                        )}
                    </>
                )}
            </Td>
        </Tr>
    )
})

const WorkedTime = memo(({from, to}) => {
    return formatDuration({
        ammount: diffBetween(from, to, 'seconds'),
        useSec: true
    })
})

export default EditWorkedTimeModal
