import { useFetchCountersQuery } from '@/redux/api/cp/meta.api'
import { createStyles, makeStyles } from '@mui/styles'
import { flexStartProps } from '@/helpers/functions'
import Image from 'next/image'
import Menu from '../menu'
import Link from 'next/link'

const { Box } = require('@mui/material')

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            ...flexStartProps('flex-start'),
            background: '#F3F4F6',
            borderRadius: '10px',
            padding: '24px',
            flexDirection: 'column'
        },
        content: {
            flex: 1,
            width: '100%'
        },
        logout: {
            ...flexStartProps('center'),
            textDecoration: 'none',
            color: '#000',
            gap: '6px'
        }
    })
)

const Aside = () => {
    const classList = useStyles()
    const { data, isLoading } = useFetchCountersQuery()

    return (
        <Box className={classList.root}>
            <Box mb={'85px'}>
                <Image
                    src="/img/logo-pure.svg"
                    width={85}
                    height={30}
                    alt="logo"
                />
            </Box>
            <Box className={classList.content}>
                {!isLoading && <Menu isLoading={isLoading} counters={data} />}
            </Box>
            <Link href="/auth/logout" className={classList.logout}>
                <Image
                    src="/img/logout.svg"
                    width={18}
                    height={18}
                    alt="icon"
                />
                Выйти
            </Link>
        </Box>
    )
}

export default Aside
