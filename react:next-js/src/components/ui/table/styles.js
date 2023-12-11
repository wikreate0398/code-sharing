import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    table: ({ version }) => {
        if (version === 1) {
            return {
                width: '100%',
                maxWidth: '100%',
                border: 'none',
                position: 'relative',
                borderCollapse: 'separate',
                borderSpacing: '0',
                overflow: 'auto',

                '& thead': {
                    zIndex: 2
                },

                '& td, th': {
                    padding: '12px',
                    fontSize: '12px',
                    borderBottom: '1px solid rgba(0, 0, 0, .08)'
                },

                '& th': {
                    color: 'rgba(0, 0, 0, .33)'
                }
            }
        } else {
            return {
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: '0 10px',

                '& th': {
                    padding: '8px 0 5px 8px',
                    ...theme.typography['small-gray'],
                    '&:first-of-type': {
                        paddingLeft: '12px'
                    }
                },

                '& th, td': {
                    textAlign: 'left'
                },

                '& td': {
                    padding: '12px 8px',

                    '&:first-of-type': {
                        borderRadius: '8px 0 0 8px',
                        cursor: 'pointer',
                        padding: '12px 8px 12px 12px'
                    },

                    '&:last-child': {
                        borderRadius: '0 8px 8px 0',
                        padding: '12px 12px 12px 8px'
                    },

                    '&.skill': {
                        fontSize: '11px'
                    }
                },

                '& tbody tr': {
                    backgroundColor: '#F4F5F7'
                }
            }
        }
    }
}))

export default useStyles
