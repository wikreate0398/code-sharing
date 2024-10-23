import { createStyles, makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            borderRadius: '6px',
            // backgroundColor: '#fff',
            border: '1px solid rgb(206, 206, 206)',
            width: ({ width }) => width || '100%',
            padding: '4px 8px',
            height: ({ width }) => `${width}px` || '30px',
            whiteSpace: 'nowrap',

            '& .value': {
                position: 'relative',
                cursor: 'pointer',
                color: '#6C7885',
                fontSize: '12px',
                lineHeight: '16px',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center'
            },

            '&.disable': {
                backgroundColor: '#EBEDF1',
                border: '1px solid #EBEDF1',

                '& .value': {
                    color: '#9EA2B2'
                }
            },

            '&.changed': {
                '& .value': {
                    color: '#1A1A1A'
                }
            },

            '&:not(.disable):hover': {
                border: '1px solid #BBBECA',

                '& .makeStyles-icon-43': {
                    background: '#9EA2B2 !important'
                }
            },

            '& .react-datepicker': {
                border: 'none',
                boxShadow:
                    '0px 0px 145px rgba(0, 0, 0, 0.04), 0px 9.94853px 43.7133px rgba(0, 0, 0, 0.0260636), 0px 4.13211px 18.1562px rgba(0, 0, 0, 0.02), 0px 1.4945px 6.56676px rgba(0, 0, 0, 0.0139364)',
                borderRadius: '6px',
                background: '#fff'
            },

            '& .react-datepicker__month-container': {
                padding: '24px 16px 12px 16px'
            },

            '& .react-datepicker-popper': {
                zIndex: 999999
            },

            '& .react-datepicker__header': {
                backgroundColor: '#fff',
                borderBottom: 'none',
                padding: 0
            },

            '& .react-datepicker__month': {
                margin: 0
            },

            '& .react-datepicker__triangle': {
                display: 'none'
            },

            '& .react-datepicker__current-month': {
                fontSize: '12px',
                fontWeight: 500,
                marginBottom: '17px'
            },

            '& .react-datepicker__day': {
                margin: 0,
                width: '32px',
                height: '32px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'normal',
                lineHeight: '15px',
                userSelect: 'none',
                '-user-select': 'none',
                '-webkit-user-select': 'none' /* Chrome/Safari */,
                '-moz-user-select': 'none' /* Firefox */,
                '-ms-user-select': 'none'
            },

            '& .react-datepicker__day-names': {
                marginBottom: '8px'
            },

            '& .react-datepicker__day-name': {
                margin: 0,
                width: '32px',
                height: '32px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: '.5'
            },

            '& .react-datepicker__navigation': {
                top: '15px'
            },

            '& .react-datepicker__day--selected, .react-datepicker__day--in-range, .react-datepicker__day--in-selecting-range, .react-datepicker__day:hover':
                {
                    borderRadius: 0,
                    backgroundColor: '#3B70CA',
                    color: '#fff'
                },

            '& .react-datepicker__day--today': {
                backgroundColor: '#F0F8F2',
                color: '#1A1A1A'
            },

            '& .react-datepicker__navigation--previous': {
                left: '13px'
            },

            '& .react-datepicker__navigation--next': {
                right: '13px'
            },

            '& .react-datepicker__year-read-view--down-arrow, .react-datepicker__month-read-view--down-arrow, .react-datepicker__month-year-read-view--down-arrow, .react-datepicker__navigation-icon::before':
                {
                    borderWidth: '2px 2px 0 0'
                }
        },

        icon: {
            marginRight: '5px'
        },

        btn: {
            minWidth: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            background: '#CACCD4',

            '&:hover': {
                background: '#3762AC'
            },

            '& img': {
                filter: 'brightness(5)'
            }
        },

        changed: {
            background: '#3B70CA'
        }
    })
)

export default useStyles
