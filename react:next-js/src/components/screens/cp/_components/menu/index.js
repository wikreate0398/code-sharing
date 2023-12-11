import { createStyles, makeStyles } from '@mui/styles'
import ActiveLink from '../active-link'
import { Box } from '@mui/material'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        item: {
            paddingBottom: '18px',
            borderBottom: '1px solid rgba(0, 0, 0, 10%)'
        }
    })
)

const menuList = [
    { name: 'Cпециалисты', route: '/cp', key: 'users' },
    { name: 'Проекты', route: '/cp/projects', key: 'projects' },
    { name: 'Константы ру/en', route: '/cp/constants' }
    // {name: "Cтэки", route: '/cp/skills'}
]

const Menu = ({ counters }) => {
    const classList = useStyles()

    return (
        <Box className={classList.root}>
            {menuList.map((item, idx) => (
                <Box className={classList.item} key={idx}>
                    <ActiveLink route={item.route} count={counters[item?.key]}>
                        {item.name}
                    </ActiveLink>
                </Box>
            ))}
        </Box>
    )
}

export default Menu
