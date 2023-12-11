import Icon from '@/components/ui/icon'
import { Box } from '@mui/material'
import { createStyles, makeStyles } from '@mui/styles'
import { flexCenterProps, spaceBetweenProps } from '@/helpers/functions'
import { useCallback, useContext } from 'react'
import { AuthContextProvider } from '../context'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            padding: '120px 65px',
            position: 'relative',

            '@media screen and (max-width: 768px)': {
                padding: '60px 30px'
            }
        },
        actions: {
            ...spaceBetweenProps(),
            position: 'absolute',
            width: 'calc(100% - 80px)',
            top: 40,
            left: 40,
            justifyContent: ({ showBack }) =>
                showBack ? 'space-between' : 'flex-end',

            '@media screen and (max-width: 768px)': {
                width: 'calc(100% - 40px)',
                top: 20,
                left: 20
            }
        },
        actionBtn: {
            ...flexCenterProps('center'),
            width: '38px',
            height: '38px',
            borderRadius: '100%',
            background: '#F0F2F4',
            cursor: 'pointer',
            transition: '150ms',

            '& img': {
                filter: 'brightness(0)',
                cursor: 'pointer'
            },

            '&:hover': {
                opacity: '.8'
            }
        }
    })
)

const AuthWrapper = ({ onClose, children }) => {
    const { step, prevStep, setStep } = useContext(AuthContextProvider)
    const showBack = step > 1
    const classList = useStyles({ showBack })

    const handleBack = useCallback(() => setStep(prevStep), [prevStep])

    return (
        <Box className={classList.root}>
            <Box className={classList.actions}>
                {showBack && (
                    <Box className={classList.actionBtn} onClick={handleBack}>
                        <Icon name="arrow-left" width={14} height={14} />
                    </Box>
                )}
                <Box className={classList.actionBtn} onClick={onClose}>
                    <Icon name="close" width={20} height={20} />
                </Box>
            </Box>
            {children}
        </Box>
    )
}

export default AuthWrapper
