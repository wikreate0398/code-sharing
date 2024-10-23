import { makeStyles, createStyles } from '@mui/styles'
import { formLabel, flexCenterProps } from '#root/src/helpers/functions'

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
                //padding: '15px 20px !important'
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
        },
        resendBox: {
            padding: '16px 0',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
        },
        resendText: {
            color: '#000000',
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.1px'
        },
        resendBtn: {
            fontSize: '14px',
            lineHeight: '20px',
            color: 'rgba(60, 146, 246, 1)'
        },

        divider: {
            margin: '40px 0 28px',
            '& p': {
                fontSize: '14px',
                lineHeight: '22px',
                color: '#A4AAB6',
                letterSpacing: '0.3px',
                textTransform: 'uppercase',
                padding: '0 12px'
            },
            '& div': {
                borderBottom: `1px solid #C1C6D0`,
                opacity: 0.5,
                flex: 1
            }
        },
        socialAuthBtns: {
            flex: 1,
            width: '100%',
            height: '50px',
            padding: '10px 32px',
            border: '1px solid #C1C6D0',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '16px',
            gap: '8px'
        }
    })
)

export default useStyles
