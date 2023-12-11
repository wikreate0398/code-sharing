'use client'

import { Box, Container } from '@mui/material'
import Image from 'next/image'
import Icon from '@/components/ui/icon'
import useStyles from '@/components/screens/home/styles'
import Card from './_components/card'
import AuthModal from './_components/auth/modal'
import { useState } from 'react'

const columns = [
    {
        image: 'time-tracker.png',
        icon: 'orange-clock',
        label: 'Time-tracker',
        description: 'Время, затраченное на выполнения заданий',
        color: '#FFAB07',
        is_coming: false
    },
    {
        image: 'cash-register.png',
        icon: 'green-money',
        label: 'Сash register',
        description: 'Учет финансов',
        color: '#31B867',
        is_coming: false
    },
    {
        image: 'work-log.svg',
        icon: 'purple-clock',
        label: 'Work-Log',
        description: 'Анализ эффективности',
        color: '#8322FF',
        is_coming: true
    }
]

const HomeScreen = () => {
    const classList = useStyles()
    const [isOpen, setIsOpen] = useState(false)

    const getCurrentYear = () => new Date().getFullYear()

    const handeShowAuth = () => setIsOpen(!isOpen)

    const ComingSoon = () => (
        <Box component="span" className={classList.comingSoon}>
            COMING SOON
        </Box>
    )

    return (
        <Box className={classList.root}>
            <Box className={classList.header}>
                <Container maxWidth="xl">
                    <Box className={classList.topLine}>
                        <Image
                            src="/img/logo-pure.svg"
                            width={111}
                            height={39}
                            alt="ITWAY"
                        />
                        <AuthModal isShow={isOpen} />
                    </Box>
                </Container>
            </Box>
            <Box className={classList.body}>
                <Container maxWidth="xl">
                    <Box className={classList.banner}>
                        <Box sx={{ maxWidth: '435px' }}>
                            <Box component="h1" className={classList.title}>
                                Визуальное управление проектами
                            </Box>
                            <Box component="p" className={classList.titleHint}>
                                <Icon
                                    name="home/kanban"
                                    width={15}
                                    height={15}
                                />
                                Kanban-доска
                            </Box>
                            <Box
                                component="p"
                                onClick={handeShowAuth}
                                className={`${classList.connectBtn} ${classList.link}`}
                            >
                                Присоединиться
                                <Icon
                                    name="arrow-right"
                                    width={16}
                                    height={16}
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Box className={classList.grid}>
                        {columns.map((column, index) => (
                            <Card className={classList.gridColumn} key={index}>
                                <Box
                                    sx={{
                                        background: `url(/img/home/${column.image}) center center no-repeat`
                                    }}
                                    className={classList.columnImage}
                                />
                                {column.is_coming && <ComingSoon />}
                                <Box
                                    component="p"
                                    className={classList.gridColumnGroup}
                                    color={column.color}
                                >
                                    <Icon
                                        name={column.icon}
                                        width={15}
                                        height={16}
                                    />
                                    {column.label}
                                </Box>
                                <Box
                                    component="p"
                                    className={classList.gridColumnLabel}
                                >
                                    {column.description}
                                </Box>
                            </Card>
                        ))}
                    </Box>
                </Container>
            </Box>
            <Container maxWidth="xl">
                <Box className={classList.footer}>
                    Copyright © {getCurrentYear()} ITWAY All rights reserved.
                </Box>
            </Container>
        </Box>
    )
}

export default HomeScreen
