import Icon from '@/components/ui/icon'
import { withStyles } from '@mui/styles'
import {
    flexStartProps,
    preventEventByLinkClick,
    timeAgo,
    wrapURLs
} from '@/helpers/functions'
import EditableArea, { EditableAreaState } from '@/components/ui/editable-area'
import { Box, Typography } from '@mui/material'
import Avatar from '@/components/ui/avatar'
import { memo } from 'react'

const nameStyles = {
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: '26px'
}

const styles = {
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
        '& a': {
            ...nameStyles,
            fontWeight: 400,
            wordBreak: 'break-word'
        }
    },

    icon: {
        position: 'relative'
    }
}

const TaskHeader = withStyles(styles)(
    memo(
        ({
            classes,
            id,
            name,
            setFieldValue,
            submitForm,
            created_at,
            author
        }) => {
            return (
                <Box className={classes.root}>
                    <Box className={classes.title}>
                        <Icon
                            name="check"
                            className={classes.icon}
                            width={24}
                            height={24}
                        />
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
                    <Box ml="35px" {...flexStartProps('center')} gap="10px">
                        <Typography variant="small-gray">#{id}</Typography>

                        <Typography variant="small-gray">
                            Создан {timeAgo(created_at)}
                        </Typography>

                        <Box {...flexStartProps('center')} gap="5px">
                            <Avatar name={author.name} size={16} />
                            <Typography variant="small-gray">
                                {author.name}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            )
        }
    )
)

export default TaskHeader
