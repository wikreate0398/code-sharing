import { createStyles, makeStyles } from '@mui/styles'
import {
    flexCenterProps,
    flexStartProps,
    spaceBetweenProps
} from '@/helpers/functions'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            ...flexStartProps('flex-start'),
            minHeight: '100vh',
            flexDirection: 'column',
            width: '100%'
        },
        link: {
            ...flexStartProps('center'),
            background: '#000',
            color: '#fff',
            gap: '4px',
            padding: '10px 28px',
            textDecoration: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
        },
        header: {
            width: '100%'
        },
        body: {
            flex: 1,
            width: '100%'
        },
        footer: {
            ...flexCenterProps(),
            padding: '45px',
            borderTop: '1px solid rgba(0, 0, 0, 0.14)',
            color: 'rgba(0, 0, 0, 0.34)',
            width: '100%',
            marginTop: '160px',

            fontSize: '14px',
            lineHeight: '14px',

            '@media screen and (max-width: 768px)': {
                padding: '38px 32px',
                marginTop: '64px',
                textAlign: 'center'
            }
        },
        grid: {
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: 'repeat(3, 1fr)',
            justifyContent: 'center',
            alignItems: 'center',

            '@media screen and (max-width: 1140px)': {
                ...flexCenterProps('center'),
                flexWrap: 'wrap'
            },

            '@media screen and (max-width: 768px)': {
                gridTemplateColumns: '1fr'
            }
        },
        gridColumn: {
            ...flexStartProps('center'),
            flexDirection: 'column',
            padding: '46px 24px',
            margin: 'auto',
            width: '100%',

            '@media screen and (max-width: 1140px)': {
                maxWidth: '448px'
            },

            '@media screen and (max-width: 768px)': {
                padding: '60px 30px',
                maxWidth: '448px'
            }
        },
        gridColumnLabel: {
            ...flexCenterProps('center'),
            fontSize: '32px',
            fontWeight: 600,
            lineHeight: '40.5px',
            letter: '-2%',
            width: '100%',
            textAlign: 'center',
            minHeight: '81px',

            '@media screen and (max-width: 1340px)': {
                fontSize: '26px',
                lineHeight: '34px'
            },

            '@media screen and (max-width: 768px)': {
                fontSize: '24px',
                lineHeight: '28px',
                minHeight: 'unset'
            }
        },
        gridColumnGroup: {
            marginBottom: '14px',
            letter: '-3%',
            fontSize: '21px',
            width: '100%',
            textAlign: 'center',
            fontWeight: 600,

            '& img': {
                marginRight: '8px'
            },

            '@media screen and (max-width: 768px)': {
                fontSize: '18px',
                lineHeight: '24px',
                minHeight: 'unset'
            }
        },
        comingSoon: {
            position: 'absolute',
            top: '22px',
            right: '22px',
            background: '#F4F6F9',
            borderRadius: '6px',
            padding: '6px 12px',

            fontSize: '14px',
            letter: '-2%',
            lineHeight: '18px',
            fontWeight: 500,
            color: 'rgba(0, 0, 0, .5)'
        },
        banner: {
            ...flexStartProps('center'),
            marginBottom: '16px',
            background: "url('/img/home/banner.png') no-repeat #fff",
            backgroundSize: '60%',
            padding: '145px 0 133px 84px',
            backgroundPositionY: '80px',
            backgroundPositionX: 'right',
            borderRadius: '16px',
            position: 'relative',

            '@media screen and (max-width: 1280px)': {
                backgroundSize: '65%',
                padding: '135px 0 113px 74px'
            },

            '@media screen and (max-width: 1140px)': {
                backgroundSize: '67%',
                padding: '90px 0 60px 50px'
            },

            '@media screen and (max-width: 768px)': {
                paddingLeft: 'inherit',
                height: 'auto',
                padding: '30px 0',
                paddingTop: '60%',
                textAlign: 'center',
                justifyContent: 'center',
                backgroundSize: '80%',
                backgroundPositionY: '30px'
            },

            '@media screen and (max-width: 525px)': {
                backgroundSize: '100%',
                paddingTop: '77%'
            }
        },
        title: {
            fontSize: '68px',
            lineHeight: '63px',
            fontWeight: 600,
            letter: '-2%',
            color: '#1D1E20',

            marginBottom: '24px',

            '@media screen and (max-width: 1140px)': {
                fontSize: '44px',
                lineHeight: '52px'
            },

            '@media screen and (max-width: 768px)': {
                fontSize: '44px',
                lineHeight: '38px',
                marginBottom: '20px'
            }
        },
        titleHint: {
            ...flexStartProps('center'),
            fontSize: '21px',
            lineHeight: '24px',
            color: '#07A6FF',
            fontWeight: 600,
            gap: '10px',

            '@media screen and (max-width: 1140px)': {
                fontSize: '18px',
                lineHeight: '24px'
            },

            '@media screen and (max-width: 768px)': {
                fontSize: '16px',
                lineHeight: '22px',
                maxWidth: 'unset'
            }
        },
        connectBtn: {
            ...flexCenterProps('center'),
            maxWidth: '220px',
            borderRadius: '100px',
            padding: '16px 40px',
            gap: '6px',
            marginTop: '32px',

            fontSize: '15px',
            color: '#fff',
            fontWeight: 500,
            lineHeight: '22px',
            letter: '-1%',

            '@media screen and (max-width: 768px)': {
                maxWidth: '195px',
                padding: '12px 35px',
                fontSize: '14px',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '24px'
            }
        },
        topLine: {
            ...spaceBetweenProps(),
            padding: '25px 32px',

            '@media screen and (max-width: 768px)': {
                padding: '21px 0'
            }
        },
        columnImage: {
            width: '234px',
            height: '257px',
            backgroundSize: 'contain !important',
            marginTop: '47px',
            marginBottom: '85px',

            '@media screen and (max-width: 768px)': {
                marginTop: 0,
                marginBottom: '24px'
            }
        }
    })
)

export default useStyles
