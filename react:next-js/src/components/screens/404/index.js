'use client'

import { withStyles } from '@mui/styles'
import Link from 'next/link'

const styles = {
    body: {
        margin: 0,
        padding: 0,
        width: '100%',
        height: '100vh',
        color: '#ed3338',
        display: 'table',
        fontWeight: '100',
        fontFamily: 'Lato'
    },

    container: {
        textAlign: 'center',
        display: 'table-cell',
        verticalAlign: 'middle'
    },

    content: {
        textAlign: 'center',
        display: 'inline-bloc'
    },

    title: {
        fontSize: '96px',
        marginBottom: '40px'
    },

    quote: {
        fontSize: '24px'
    },

    h1: {
        fontSize: '140px',
        margin: '0',
        fontWeight: 300
    },

    a: {
        fontWeight: 600,
        color: '#fff',
        background: '#ed3338',
        padding: '7px 15px',
        display: 'inline-block',
        textDecoration: 'none'
    }
}

const NotFound = withStyles(styles)(({ classes: style }) => {
    return (
        <div className={style.body}>
            <div className={style.container}>
                <div className={style.content}>
                    <h1 className={style.h1}>404</h1>
                    <div className={style.title}>Not Found</div>
                    <Link className={style.a} href="/">
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
})

export default NotFound
