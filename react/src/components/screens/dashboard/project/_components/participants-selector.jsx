import { Box, ClickAwayListener, TextField, Typography } from '@mui/material'
import { styled, withStyles } from '@mui/styles'
import PlusBtn from '#root/src/components/ui/plus-btn'
import {
    empty,
    flexStartProps,
    pluck,
    spaceBetweenProps
} from '#root/src/helpers/functions'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useGetRequest } from '#root/src/services/rest/rest'
import { useSelector } from 'react-redux'
import { selectAuthUser } from '#root/src/redux/slices/meta.slice'
import Icon from '#root/src/components/ui/icon'
import Avatar from '#root/src/components/ui/avatar'
import { ProjectProviderContext } from '#root/src/providers/project-provider'
import { FieldArray } from 'formik'

const styles = {
    root: {
        borderRadius: '8px',
        border: '1px solid #C2C4C7',
        padding: '10px',
        marginBottom: '15px'
    },

    item: {
        marginTop: '12px'
    },

    autocomplete: {
        position: 'relative'
    },

    dropdown: {
        position: 'absolute',
        boxShadow: 'rgba(104, 112, 118, 0.08) 0px 12px 20px 6px',
        zIndex: 9,
        width: '100%',
        left: 0,
        top: '21px',
        background: '#fff',
        borderRadius: '8px',
        padding: '10px',

        '& .item': {
            padding: '7px 0',
            fontSize: '13px',
            cursor: 'pointer',
            ...flexStartProps('center'),
            gap: '9px'
        }
    }
}

const ParticipantsSelector = withStyles(styles)(({ classes, values }) => {
    const user = useSelector(selectAuthUser)

    return (
        <Box className={classes.root}>
            <FieldArray name="participants">
                {({ push, remove }) => (
                    <>
                        <Typography variant="small-gray">Участники</Typography>
                        <Box className={classes.item}>
                            {values.map(({ id, login, name }, index) => (
                                <Box
                                    {...spaceBetweenProps()}
                                    key={id}
                                    mb="15px"
                                >
                                    <Box
                                        {...flexStartProps('center')}
                                        gap="9px"
                                    >
                                        <Avatar name={name} />
                                        <Box>
                                            <Typography
                                                component="p"
                                                marginBottom="4px"
                                            >
                                                {name}
                                            </Typography>
                                            <Typography
                                                variant="extra-small-gray"
                                                component="p"
                                            >
                                                @{login}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    {user.id !== parseInt(id) && (
                                        <Icon
                                            name="close"
                                            v2
                                            onClick={() => remove(index)}
                                        />
                                    )}
                                </Box>
                            ))}
                            <Add push={push} />
                        </Box>
                    </>
                )}
            </FieldArray>
        </Box>
    )
})

const MiniInput = styled(TextField)({
    '& .MuiInputBase-input': {
        padding: '0px !important'
    }
})

const Add = ({ push }) => {
    const [active, setActive] = useState(false)
    const handler = useCallback(() => setActive(!active), [active])

    return (
        <>
            <ClickAwayListener onClickAway={() => setActive(false)}>
                <Box {...flexStartProps('center')} gap="9px">
                    <PlusBtn onClick={handler} />
                    {!active ? (
                        <Typography variant="small-gray" onClick={handler}>
                            Добавить
                        </Typography>
                    ) : (
                        <Autocomplete close={handler} push={push} />
                    )}
                </Box>
            </ClickAwayListener>
        </>
    )
}

const Autocomplete = withStyles(styles)(({ classes, close, push }) => {
    const [value, setValue] = useState('')
    const [result, setResult] = useState([])
    const getRequest = useGetRequest()
    const { project } = useContext(ProjectProviderContext)

    useEffect(() => {
        return () => {
            setResult([])
            setValue('')
        }
    }, [])

    const handleChange = useCallback(
        (e) => {
            const search = e.target.value
            setValue(search)
            if (search.length < 2) return

            getRequest('participants/search', {
                search,
                id_project: project.id,
                futureBoard: true
            }).then((resp) => {
                setResult(resp)
            })
        },
        [setValue, setResult, project]
    )

    const handleSelect = useCallback(
        ({ id, login, name }) => {
            push({ id, login, name })
            close()
        },
        [push, close]
    )

    return (
        <Box className={classes.autocomplete}>
            <MiniInput
                size="small"
                autoFocus={true}
                variant="standard"
                value={value}
                onChange={handleChange}
            />
            {!empty(result) && (
                <Box className={classes.dropdown}>
                    {result.map((v) => {
                        return (
                            <Box
                                key={v.id}
                                className="item"
                                onClick={() => handleSelect(v)}
                            >
                                <Avatar name={v.name} />
                                <Box>
                                    <Typography
                                        component="p"
                                        marginBottom="4px"
                                    >
                                        {v.name}
                                    </Typography>
                                    <Typography
                                        variant="extra-small-gray"
                                        component="p"
                                    >
                                        @{v.login}
                                    </Typography>
                                </Box>
                            </Box>
                        )
                    })}
                </Box>
            )}
        </Box>
    )
})

export default ParticipantsSelector
