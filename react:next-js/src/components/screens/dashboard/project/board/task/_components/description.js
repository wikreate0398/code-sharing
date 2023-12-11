import { Box, Typography } from '@mui/material'
import { withStyles } from '@mui/styles'
import EditableArea, { EditableAreaState } from '@/components/ui/editable-area'
import React, { memo } from 'react'
import { useFormikContext } from 'formik'
import classNames from 'classnames'
import {
    preventEventByLinkClick,
    wrapLogins,
    wrapURLs
} from '@/helpers/functions'
import { useGetBoardParticipantsQuery } from '@/redux/api/participant.api'
import { useParams } from 'next/navigation'

const styles = {
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
        lineHeight: '20px',
        padding: '11px 15px',
        backgroundColor: '#fafafa',
        whiteSpace: 'pre-line',
        overflowWrap: 'break-word'
    }
}

const Description = withStyles(styles)(
    memo(
        ({
            classes,
            comment,
            setFieldValue,
            submitForm,
            hasMention = false
        }) => {
            const { id_board } = useParams()
            const { data: users } = useGetBoardParticipantsQuery(id_board, {
                refetchOnMountOrArgChange: false
            })

            return (
                <Box className={classes.root}>
                    <Typography variant="subtitle-16" component="p" mb="12px">
                        Описание
                    </Typography>

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
                                        className={classNames(
                                            classes.textarea,
                                            {
                                                editable: isEditMode
                                            }
                                        )}
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
)

export default Description
