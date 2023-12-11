import { makeStyles, createStyles } from '@mui/styles'
import { formLabel, flexCenterProps } from '@/helpers/functions'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            marginBottom: '42px'
        },
        btn: {
            marginTop: '8px !important',
            height: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '6px'
        },
        input: {
            '& input': {
                padding: '15px 20px !important'
            }
        },
        formLabel: {
            ...formLabel(),
            display: 'block',
            marginBottom: '6px'
        },
        forgotLabel: {
            color: '#000',
            opacity: '50%',
            textDecoration: 'underline',
            cursor: 'pointer'
        },
        autocomplete: {
            '& .MuiAutocomplete-tag': {
                background: '#4E22FF',
                padding: '9px 10px',
                borderRadius: '8px',

                '& > span:first-child': {
                    color: '#fff',
                    fontSize: '16px',
                    lineHeight: '16px',
                    fontWeight: 400,
                    padding: '0',
                    marginRight: '6px'
                },

                '& img': {
                    margin: 0
                }
            }
        },
        formError: {
            color: '#d32f2f',
            fontSize: '14px',
            lineHeight: '20px',
            marginTop: '6px'
        },
        wrapperCodes: {
            ...flexCenterProps('center'),
            gap: '9px',
            marginTop: '96px',
            marginBottom: '126px',

            '& input': {
                height: '72px',
                width: '62px',
                textAlign: 'center',
                fontSize: '22px !important',
                color: '#000',
                fontWeight: '500',

                '@media screen and (max-width: 768px)': {
                    height: '42px',
                    width: '32px'
                }
            },

            '@media screen and (max-width: 768px)': {
                marginTop: '60px',
                marginBottom: '80px'
            }
        },
        title: {
            '@media screen and (max-width: 768px)': {
                fontSize: '28px !important',
                lineHeight: '36px !important'
            }
        }
    })
)

export default useStyles
