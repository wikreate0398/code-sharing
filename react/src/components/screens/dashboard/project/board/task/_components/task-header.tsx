import { makeStyles } from '@mui/styles'
import {
    flexStartProps,
    preventEventByLinkClick,
    timeAgo,
    wrapURLs
} from '#root/src/helpers/functions'
import EditableArea, { EditableAreaState } from '#root/src/components/ui/editable-area'
import { Box, Typography } from '@mui/material'
import Avatar from '#root/src/components/ui/avatar'
import { memo } from 'react'
import { Theme } from '@mui/system'

const nameStyles = {
    fontSize: '28px',
    fontWeight: 600,
    lineHeight: '32px'
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginBottom: '20px'
    },

    title: {
        ...flexStartProps(),
        gap: '10px',
        marginBottom: '10px'
    },

    name: {
        ...nameStyles,
        color: theme.palette.neutral[900],
        '& a': {
            ...nameStyles,
            fontWeight: 400,
            wordBreak: 'break-word',
            color: 'inherit'
        }
    },

    icon: {
        position: 'relative'
    }
}))

interface Props {
    id: number | string
    name: string
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
    submitForm: () => void
    created_at: string
    author: { name: string; [key: string]: any }
}

const TaskHeader = memo(
    ({ id, name, setFieldValue, submitForm, created_at, author }: Props) => {
        const classes = useStyles()

        return (
            <Box className={classes.root}>
                <Box className={classes.title}>
                    <EditableAreaState>
                        {({ isEditMode, enableEditMode }) => (
                            <>
                                {isEditMode ? (
                                    <EditableArea
                                        value={name}
                                        triggOnEnter
                                        save={(param) => submitForm()}
                                        onChange={(name) =>
                                            setFieldValue('name', name)
                                        }
                                        className={classes.name}
                                    />
                                ) : (
                                    <Box
                                        className={classes.name}
                                        dangerouslySetInnerHTML={{
                                            __html: wrapURLs(name)
                                        }}
                                        onClick={(e) =>
                                            preventEventByLinkClick(
                                                e,
                                                enableEditMode
                                            )
                                        }
                                    />
                                )}
                            </>
                        )}
                    </EditableAreaState>
                </Box>
                <Box {...flexStartProps('center')} gap="6px">
                    <Typography variant="small-gray">#{id}</Typography>

                    <Typography variant="small-gray">{`•`}</Typography>
                    <Box {...flexStartProps('center')} gap="5px">
                        <Avatar name={author.name} size={16} />
                        <Typography variant="small-gray">
                            {author.name}
                        </Typography>
                    </Box>
                    <Typography variant="small-gray">{`•`}</Typography>
                    <Typography variant="small-gray">
                        Создан {timeAgo(created_at)}
                    </Typography>
                </Box>
            </Box>
        )
    }
)

export default TaskHeader
