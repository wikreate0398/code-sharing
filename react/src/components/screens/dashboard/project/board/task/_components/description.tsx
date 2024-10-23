import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import EditableArea, {
    EditableAreaState
} from '#root/src/components/ui/editable-area'
import React, { memo } from 'react'
import classNames from 'classnames'
import {
    preventEventByLinkClick,
    wrapLogins,
    wrapURLs
} from '#root/src/helpers/functions'
import { useGetBoardParticipantsQuery } from '#root/src/redux/api/participant.api'
import { useParams } from '#root/renderer/hooks'
import { Theme } from '@mui/system'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        margin: '30px 0 30px'
    },

    textarea: {
        border: '1px solid #DDDEE4',
        borderRadius: '8px',
        resize: 'none',
        width: '100%',
        padding: '11px 15px',
        fontSize: '13px',
        lineHeight: '20px',
        wordBreak: 'break-word'
    },

    description: {
        fontSize: '13px',
        lineHeight: '18px',
        padding: '13px 16px',
        backgroundColor: theme.palette.neutral[100],
        whiteSpace: 'pre-line',
        overflowWrap: 'break-word',
        borderRadius: 10,
        color: theme.palette.neutral[900],
        '& a': {
            color: 'inherit'
        }
    }
}))

interface Props {
    comment: string
    setFieldValue: (n, v) => void
    submitForm: () => void
    hasMention?: boolean
}

const Description = memo(
    ({ comment, setFieldValue, submitForm, hasMention = false }: Props) => {
        const classes = useStyles()
        const { id_board } = useParams()
        const { data: users } = useGetBoardParticipantsQuery(id_board, {
            refetchOnMountOrArgChange: false
        })

        return (
            <Box className={classes.root}>
                <EditableAreaState>
                    {({ isEditMode, enableEditMode }) => (
                        <>
                            {isEditMode || !comment ? (
                                <EditableArea
                                    value={comment}
                                    customize={{ borderRadius: '8px' }}
                                    save={(param) => submitForm()}
                                    onChange={(comment) =>
                                        setFieldValue('comment', comment)
                                    }
                                    placeholder="Напишите описание"
                                    useSaveBtn
                                    hasMention={hasMention}
                                    users={users}
                                    saveOnClickOutside
                                    className={classNames(classes.textarea, {
                                        editable: isEditMode
                                    })}
                                />
                            ) : (
                                <Box
                                    onClick={(e) =>
                                        preventEventByLinkClick(
                                            e,
                                            enableEditMode
                                        )
                                    }
                                    className={classes.description}
                                    dangerouslySetInnerHTML={{
                                        __html: wrapLogins(
                                            wrapURLs(comment),
                                            users
                                        )
                                    }}
                                />
                            )}
                        </>
                    )}
                </EditableAreaState>
            </Box>
        )
    }
)

export default Description
