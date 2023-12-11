'use client'

import { createTheme } from '@mui/material/styles'

const titleCss = {
    color: '#000',
    fontWeight: 600,
    fontFamily: 'Inter, sans-serif'
}

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1F1F1F',
            yellow: '#F9D143',
            green: '#48C64B'
        },
        neutral: {
            gray: '#BBBECA'
        },
        button: {
            main: '#000000',
            transparent: 'transparent'
        },
        blue: {
            main: 'rgba(30, 49, 222, 0.1)',
            contrastText: '#1E31DE'
        },
        colors: {
            bookmark: '#FFB800',
            delete: '#FF2425'
        }
    },

    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1200,
            xl: 1536
        }
    },

    typography: {
        fontFamily: "'Inter', sans-serif",

        'title-24': {
            ...titleCss,
            fontSize: '24px'
        },

        'title-20': {
            ...titleCss,
            fontSize: '20px'
        },

        'subtitle-15': {
            color: '#000',
            fontSize: '15px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500
        },

        'subtitle-16': {
            fontSize: '15px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif'
        },

        'subtitle-18': {
            fontSize: '18px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif'
        },

        font2: {
            fontFamily: "'DIN Alternate', sans-serif",
            fontWeight: 700
        },

        font3: {
            fontFamily: "'DIN Condensed', sans-serif",
            fontWeight: 700
        },

        'p-12': {
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px'
        },

        'big-32': {
            fontFamily: "'DIN Alternate', sans-serif",
            fontWeight: 700,
            fontSize: '32px'
        },

        'small-gray': {
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 400,
            color: 'rgba(0,0,0,.33)'
        },

        'extra-small-gray': {
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            fontWeight: 400,
            color: 'rgba(0,0,0,.33)'
        },

        'default-gray': {
            color: 'rgba(0,0,0,.33)'
        },

        detail: {
            color: '#3C92F6',
            fontWeight: 700,
            fontFamily: "'DIN Alternate', sans-serif",
            textDecoration: 'none'
        },

        'title-32': {
            color: '#000',
            fontSize: '32px',
            lineHeight: '38px !important',
            fontWeight: '700',
            letterSpacing: '-0.02em !important',
            display: 'block'
        },

        'title-38': {
            color: '#000',
            fontSize: '38px',
            lineHeight: '44px !important',
            fontWeight: '700',
            letterSpacing: '-0.02em !important',
            display: 'block'
        },

        'help-text-17': {
            color: '#7E828C',
            fontSize: '17px',
            lineHeight: '22px',
            display: 'block'
        }
    },

    components: {
        MuiTypography: {
            styleOverrides: {
                root: ({ theme }) => ({
                    fontStyle: 'normal',
                    lineHeight: '105%',
                    letterSpacing: '-0.04em'
                })
            }
        },
        MuiPopover: {
            styleOverrides: {
                paper: () => ({
                    boxShadow: 'rgba(104, 112, 118, 0.08) 0px 12px 20px 6px'
                })
            }
        },

        MuiPaper: {
            styleOverrides: {
                root: () => ({
                    borderRadius: '8px'
                })
            }
        },

        MuiCheckbox: {
            styleOverrides: {
                root: () => ({
                    padding: '0px',
                    '&.MuiSvgIcon-root': {
                        fontSize: '12px'
                    }
                })
            }
        },

        MuiFormControlLabel: {
            styleOverrides: {
                root: () => ({
                    marginLeft: '0px',
                    gap: '10px'
                })
            }
        },

        MuiAppBar: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: '#fff',
                    color: theme.palette.primary.main,
                    boxShadow: 'none'
                })
            }
        },
        MuiChip: {
            styleOverrides: {
                label: ({ theme }) => ({
                    fontSize: '11px'
                }),
                root: () => ({
                    borderRadius: '8px'
                })
            }
        },
        MuiAvatar: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 500
                })
            }
        },
        MuiAvatarGroup: {
            styleOverrides: {
                root: ({ theme }) => ({
                    flexDirection: 'initial',
                    '& .MuiAvatar-root': {
                        '&:last-child': {
                            marginLeft: '-8px'
                        },

                        '&:first-of-type': {
                            marginLeft: 0
                        }
                    }
                })
            }
        },
        MuiButtonBase: {
            defaultProps: {
                // The props to change the default for.
                disableRipple: true // No more ripple, on the whole application 💣!
            }
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    borderRadius: '12px !important',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D6D9E0 !important'
                    },

                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#BBBECA !important'
                    },

                    '& .MuiInputBase-input': {
                        padding: '12px',
                        fontSize: '14px',
                        color: '#000'
                    },

                    '& .MuiAutocomplete-input': {
                        '&.MuiInputBase-input': {
                            padding: '3px !important'
                        }
                    },

                    '& .MuiAutocomplete-endAdornment': {
                        right: '12px !important',
                        top: 'calc(50% - 12px)'
                    },

                    '& .MuiSelect-icon': {
                        right: '12px'
                    },

                    '&.Mui-disabled': {
                        backgroundColor: '#eee'
                    }
                }
            }
        },

        MuiFormLabel: {
            styleOverrides: {
                root: {
                    fontSize: '14px',
                    lineHeight: 1,
                    color: 'rgba(0, 0, 0, 0.4)'
                    //transform: 'translate(14px, 16px) scale(1)'
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: '12px',
                    textTransform: 'initial'
                })
            },
            variants: [
                {
                    props: { variant: 'black' },
                    style: ({ theme }) => ({
                        backgroundColor: theme.palette.button.main,
                        color: theme.palette.primary.contrastText,
                        fontWeight: 500,
                        fontSize: '14px',
                        padding: '12px 16px',
                        '&.Mui-disabled': {
                            color: theme.palette.primary.contrastText,
                            backgroundColor: theme.palette.neutral.gray
                        },
                        '&:hover': {
                            backgroundColor: '#ff0000'
                        }
                    })
                },
                {
                    props: { variant: 'borders' },
                    style: ({ theme }) => ({
                        backgroundColor: 'transparent',
                        color: '#000000',
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '18px',
                        padding: '10px 16px',
                        border: '1px solid #C1C6D0'
                    })
                },
                {
                    props: { variant: 'gray-sm' },
                    style: ({ theme }) => ({
                        backgroundColor: '#E6E7EA',
                        padding: '7px',
                        minWidth: 'auto'
                    })
                },
                {
                    props: { variant: 'blue' },
                    style: ({ theme }) => ({
                        backgroundColor: '#4281DB',
                        color: '#fff',

                        '&:hover': {
                            backgroundColor: '#4281DB !important'
                        }
                    })
                }
            ]
        }
    }
})

export default theme
