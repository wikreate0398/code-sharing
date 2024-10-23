//@ts-nocheck

import { createTheme } from '@mui/material'

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        ['small-gray']: true
        ['extra-small-gray']: true
        ['title-24']: true
        ['subtitle-13']: true
    }
}

const titleCss = {
    color: '#000',
    fontWeight: 600,
    fontFamily: 'Inter, sans-serif'
}

const theme = createTheme({
    palette: {
        mode: 'light',
        black: '#000000',
        white: '#ffffff',
        primary: {
            main: '#1F1F1F',
            yellow: '#F9D143',
            green: '#48C64B'
        },
        neutral: {
            900: 'rgba(25, 25, 25, 1)',
            800: '#656A76',
            700: '#9499A4',
            600: '#9EA2B2',
            500: 'rgba(187, 192, 203, 1)',
            200: '#F3F4F7',
            100: '#F8F9FB',
            gray: '#BBBECA',
            text: '#6C7885',
            black_50: '#00000080' // opacity 50%
        },
        button: {
            main: 'rgba(25, 25, 25, 1)',
            transparent: 'transparent'
        },
        blue: {
            main: 'rgba(30, 49, 222, 0.1)',
            contrastText: '#1E31DE',
        },
        colors: {
            bookmark: '#FFB800',
            delete: '#FF2425',
            border: '#C2CCD6',
            urgent: '#FA1010',
        },
        icons: {
            v1: {
                color: '#9EA2B2',
                hoverColor: '#656A76',
                activeColor: '#656A76'
            }
        },
        tags: {
            red: '#E41805',
            yellow: '#FEBF1F',
            green: '#11A259',
            blue: '#006AFF',
            fiol: '#4427B8'
        },
        scrollbar: (size = 5) => ({
            /* width */
            '&::-webkit-scrollbar': {
                width: size,
                height: size
            },

            /* Track */
            '&::-webkit-scrollbar-track': {
                background: 'transparent'
            },

            /* Handle */
            '&::-webkit-scrollbar-thumb': {
                background: 'black'
            },

            /* Handle on hover */
            '&::-webkit-scrollbar-thumb:hover': {
                background: 'grey'
            }
        })
    },

    button: {
        large: {
            height: 50,
            borderRadius: 12,
            fontSize: 16
        },
        medium: {
            height: 38,
            borderRadius: 8,
            fontSize: 14
        },
        small: {
            height: 28,
            borderRadius: 8,
            fontSize: 13,
            lineHeight: '16px'
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

        'subtitle-12': {
            color: '#000',
            fontSize: '12px',
            lineHeight: '15px'
        },

        'subtitle-13': {
            color: '#000',
            fontSize: '13px',
            lineHeight: '16px',
            fontFamily: 'Inter, sans-serif'
        },

        'subtitle-14': {
            color: '#191919',
            fontSize: '14px',
            lineHeight: '18px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500
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
            lineHeight: '16px',
            fontWeight: 400,
            color: '#9499A4'
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
        MuiPickersToolbar: {
            styleOverrides: {
                root: {
                    color: '#bbdefb',
                    borderRadius: 2,
                    borderWidth: 1,
                    borderColor: '#2196f3',
                    border: '1px solid',
                    backgroundColor: '#0d47a1'
                }
            }
        },

        MuiTypography: {
            styleOverrides: {
                root: ({ theme }) => ({
                    fontStyle: 'normal',
                    lineHeight: '100%',
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
            },

            variants: [
                {
                    props: { variant: 'blue' },
                    style: ({ theme }) => ({
                        '&.MuiChip-root': {
                            background: '#E8F0FE',
                            color: '#4260F2',
                            borderRadius: '4px'
                        }
                    })
                }, {
                    props: { variant: 'neutral' },
                    style: ({ theme }) => ({
                        '&.MuiChip-root': {
                            background: '#F3F4F7',
                            color: '#9499A4',
                            borderRadius: '4px'
                        }
                    })
                }
            ]
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

        MuiTextField: {
            variants: [
                {
                    props: { size: 'normal' },
                    style: ({ theme }) => ({
                        '& input.MuiInputBase-input, div.MuiInputBase-input': {
                            padding: '12px',
                            fontSize: '13px'
                        }
                    })
                },

                {
                    props: { size: 'big' },
                    style: ({ theme }) => ({
                        '& input.MuiInputBase-input, div.MuiInputBase-input': {
                            padding: '15px 20px !important'
                        },

                        '& label.MuiInputLabel-root': {
                            transform: 'translate(18px, 18px) scale(1)'
                        }
                    })
                }
            ]
        },

        MuiInputBase: {
            styleOverrides: {
                root: {
                    borderRadius: '12px !important',

                    '& input.MuiInputBase-input': {
                        fontSize: '14px',
                        color: '#000'
                    },

                    '& fieldset.MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D6D9E0',
                        transition: '0.3s all',

                        '& legend': {
                            opacity: 0,
                            maxWidth: 0
                        }
                    },

                    '&:hover:not(.Mui-error) fieldset.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(66, 96, 242, 1) !important',
                        boxShadow: '0px 0px 0px 3px rgba(232, 240, 254, 1)'
                    },

                    '&.Mui-focused:not(.Mui-error) fieldset.MuiOutlinedInput-notchedOutline': {
                        borderWidth: '1px',
                        borderColor: 'rgba(66, 96, 242, 1)',
                        boxShadow: '0px 0px 0px 3px rgba(232, 240, 254, 1)'
                    },

                    // '& .MuiAutocomplete-input': {
                    //     '&.MuiInputBase-input': {
                    //         padding: '0 3px !important'
                    //     }
                    // },

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
                }
            }
        },

        MuiInputLabel: {
            styleOverrides: {
                root: {
                    '&.MuiInputLabel-shrink': {
                        transform:
                            'translate(14px, -9px) scale(0.75) !important',
                        padding: '5px 10px',
                        background: '#fff',
                        bottom: 'auto',
                        display: 'block',
                        borderRadius: '8px'
                    }
                }
            }
        },

        MuiButton: {
            styleOverrides: {
                root: ({ theme, ownerState }) => {
                    return {
                        borderRadius: 8,
                        textTransform: 'initial',
                        boxShadow: 'none',
                        ...getCustomButtonStyle(ownerState)
                    }
                }
            },
            variants: [
                {
                    props: { variant: 'contained' },
                    style: ({ theme }) => {
                        return {
                            backgroundColor: theme.palette.button.main,
                            color: theme.palette.primary.contrastText,

                            '&.Mui-disabled': {
                                color: theme.palette.primary.contrastText,
                                backgroundColor: theme.palette.neutral.gray
                            },
                            '&:hover': {
                                backgroundColor: '#ff0000'
                            }
                        }
                    }
                },
                {
                    props: { variant: 'outlined' },
                    style: ({ theme }) => {
                        return {
                            backgroundColor: theme.palette.white,
                            color: theme.palette.neutral[900],
                            borderColor: theme.palette.neutral[500],

                            '&.Mui-disabled': {
                                color: theme.palette.primary.contrastText,
                                backgroundColor: theme.palette.neutral.gray
                            },
                            '&:hover': {
                                borderColor: theme.palette.neutral[500]
                            }
                        }
                    }
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
                        backgroundColor: '#4260F2',
                        color: '#fff',

                        '&:hover': {
                            backgroundColor: '#4260F2 !important'
                        }
                    })
                },
            ]
        }
    }
})

const getCustomButtonStyle = (ownerState) => {
    const { label, size, variant } = ownerState || {}

    if (['outlined', 'contained'].includes(variant)) {
        const {
            padding = 12,
            height = 50,
            borderRadius = 12,
            fontSize = 14,
            lineHeight = '18px'
        } = theme.button[size]

        return {
            height,
            borderRadius,
            fontSize,
            lineHeight,
            fontWeight: 500,
            paddingLeft: padding,
            paddingRight: padding,
            textTransform: 'initial',
            '& .MuiButton-startIcon': {
                marginRight: label ? 8 : 0,
                marginLeft: label ? -4 : 0
            },
            '& .MuiButton-endIcon': {
                marginLeft: label ? 8 : 0,
                marginRight: label ? -4 : 0
            }
        }
    }

    return {}
}

export default theme
