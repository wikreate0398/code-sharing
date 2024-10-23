import { useSnackbar } from 'notistack'
import React from 'react'

const InnerSnackbarUtilsConfigurator = (props) => {
    props.setUseSnackbarRef(useSnackbar())
    return null
}

let useSnackbarRef
const setUseSnackbarRef = (useSnackbarRefProp) => {
    useSnackbarRef = useSnackbarRefProp
}

export const SnackbarUtilsConfigurator = () => {
    return (
        <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />
    )
}

export const snackActions = {
    notify(...props) {
        useSnackbarRef.enqueueSnackbar(...props)
    }
}
