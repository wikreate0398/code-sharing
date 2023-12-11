import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { createStyles, makeStyles } from '@mui/styles'
import { Box } from '@mui/material'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            color: ({ isActive }) => (isActive ? '#4200FF' : '#000'),
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '17px',
            textDecoration: 'none'
        },
        badge: {
            background: ({ isActive }) => (isActive ? '#4200FF' : '#A0A0A0'),
            color: '#fff',
            padding: '2px 4px',
            fontSize: '12px',
            fontWeight: 600,
            lineHeight: '14px',
            display: 'inline-block',
            borderRadius: '5px',
            marginLeft: '5px'
        }
    })
)

const ActiveLink = ({ route, children, count = 0, ...props }) => {
    const pathname = usePathname()
    const isActive = pathname === route
    const classList = useStyles({ isActive })

    return (
        <Link href={route} className={classList.root} {...props}>
            {children}
            {count > 0 && <Box className={classList.badge}>{count}</Box>}
        </Link>
    )
}

export default ActiveLink
