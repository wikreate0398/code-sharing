import React, { useMemo } from 'react'
import { useEditUserInfoMutation } from '@/redux/api/user.api'
import { useFetch, useNotify } from '@/helpers/hooks'
import { isBase64, pluck } from '@/helpers/functions'
import { requestHandler } from '@/redux/api-service'
import { useFormik } from 'formik'
import isEqual from 'lodash/fp/isEqual'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'
import {
    loginValidation,
    minimumSymbols,
    requiredMessage
} from '@/config/validation-messages'

const ValidationSchema = Yup.object().shape({
    name: Yup.string().required(requiredMessage),
    skills: Yup.array().min(1, requiredMessage).required(requiredMessage),
    avatar: Yup.string().notRequired(),
    timezone: Yup.string().required(requiredMessage),
    login: Yup.string()
        .min(2, minimumSymbols(2))
        .matches(/^(?!_)(?=[a-zA-Z])([a-zA-Z0-9_])*$/, loginValidation)
        .required(requiredMessage)
})

const useEditUserInfo = () => {
    const user = useSelector((state) => state.meta.user)
    const notify = useNotify()

    const {
        name: initialName,
        avatar_url: initialAvatar,
        login: initialLogin,
        email: initialEmail,
        skills: initialSkills,
        timezone: initialTz
    } = user || {}

    const initialValues = {
        skills: initialSkills || [],
        login: initialLogin || '',
        email: initialEmail || '',
        avatar: initialAvatar || null,
        name: initialName || '',
        tz: initialTz
    }

    const [editUserInfo] = useEditUserInfoMutation()
    const { data: timezonesList } = useFetch('meta/fetch-timezones') //useFetchTimezonesQuery()
    const { data: skillsList } = useFetch('meta/fetch-skills')

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            setSubmitting(true)
            const {
                email, // do not send
                skills,
                avatar: avatarBase64,
                ...fields
            } = values
            let avatar = isBase64(avatarBase64) ? { avatar: avatarBase64 } : {}

            await editUserInfo({
                ...fields,
                ...avatar,
                skills: pluck(skills, 'id')
            }).then((result) =>
                requestHandler({
                    result,
                    on200Http: () => {
                        notify('Изменения успешно сохранены!', 'success')
                        setSubmitting(false)

                        // TODO after success update redux of user info is not updated, figure out why not
                    },
                    on422Error: (errors) => {
                        setErrors(errors)
                    }
                })
            )
        } catch (e) {
            notify('Ошибка, попробуйте позже!', 'error')
        } finally {
            setSubmitting(false)
        }
    }

    const formik = useFormik({
        validationSchema: ValidationSchema,
        validateOnBlur: false,
        validateOnChange: false,
        initialValues,
        enableReinitialize: true,
        onSubmit: handleSubmit
    })

    const {
        values: { skills, login, email, name, avatar, tz }
    } = formik

    const isFormChanged = useMemo(() => {
        let arr = [
            [skills, initialSkills],
            [login, initialLogin],
            [email, initialEmail],
            [avatar, initialAvatar],
            [name, initialName],
            [tz, initialTz]
        ]

        return arr.some(([current, prev]) => !isEqual(current, prev))
    }, [
        tz,
        avatar,
        email,
        login,
        name,
        skills,
        initialTz,
        initialAvatar,
        initialEmail,
        initialLogin,
        initialName,
        initialSkills
    ])

    return { isFormChanged, formik, timezonesList, skillsList }
}

export default useEditUserInfo
