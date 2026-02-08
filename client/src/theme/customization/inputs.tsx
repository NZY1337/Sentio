import { alpha, type Theme, type Components } from '@mui/material/styles';
import { svgIconClasses } from '@mui/material/SvgIcon';
import { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import { toggleButtonClasses } from '@mui/material/ToggleButton';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { brand } from '../themePrimitives';

// colors
import { grey } from '@mui/material/colors';

// ...theme.applyStyles('dark', {}),
// ...theme.applyStyles('light', {}),

export const inputsCustomizations: Components<Theme> = {
    MuiButtonBase: {
        defaultProps: {
            disableTouchRipple: true,
            disableRipple: true,
        },
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                boxSizing: 'border-box',
                transition: 'all 100ms ease-in',
                '&:focus-visible': {
                    outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                    outlineOffset: '2px',
                },
            }),
        },
    },
    MuiButton: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                boxShadow: 'none',
                borderRadius: theme.shape.borderRadius,
                textTransform: 'none',
                variants: [
                    {
                        props: {
                            size: 'small',
                        },
                        style: {
                            height: '2.25rem',
                            padding: '8px 12px',
                        },
                    },
                    {
                        props: {
                            size: 'medium',
                        },
                        style: {
                            height: '2.5rem', // 40px
                        },
                    },
                    {
                        props: {
                            color: 'primary',
                            variant: 'contained',
                        },
                        style: {
                            color: 'black',
                            backgroundColor: grey[50],
                            backgroundImage: `linear-gradient(to bottom, ${grey[100]}, ${grey[50]})`,
                            boxShadow: `inset 0 -1px 0  hsl(220, 30%, 80%)`,
                            border: `1px solid ${grey[50]}`,
                            '&:hover': {
                                backgroundImage: 'none',
                                backgroundColor: grey[300],
                                boxShadow: 'none',
                            },
                            '&:active': {
                                backgroundColor: grey[400],
                            },
                        },
                    },
                    {
                        props: {
                            color: 'secondary',
                            variant: 'contained',
                        },
                        style: {
                            color: 'white',
                            backgroundColor: brand[300],
                            backgroundImage: `linear-gradient(to bottom, ${alpha(brand[400], 0.8)}, ${brand[500]})`,
                            boxShadow: `inset 0 2px 0 ${alpha(brand[200], 0.2)}, inset 0 -2px 0 ${alpha(brand[700], 0.4)}`,
                            border: `1px solid ${brand[500]}`,
                            '&:hover': {
                                backgroundColor: brand[700],
                                boxShadow: 'none',
                            },
                            '&:active': {
                                backgroundColor: brand[700],
                                backgroundImage: 'none',
                            },
                        },
                    },
                    {
                        props: {
                            variant: 'outlined',
                        },
                        style: {
                            color: theme.palette.text.primary,
                            border: '1px solid',
                            borderColor: grey[700],
                            backgroundColor: grey[800],

                            '&:active': {
                                backgroundColor: grey[900],
                            },
                        },
                    },
                    {
                        props: {
                            color: 'secondary',
                            variant: 'outlined',
                        },
                        style: {
                            color: brand[50],
                            border: '1px solid',
                            borderColor: brand[900],
                            backgroundColor: alpha(brand[900], 0.3),
                            '&:hover': {
                                backgroundColor: brand[700],
                                borderColor: alpha(brand[900], 0.6),
                            },
                            '&:active': {
                                backgroundColor: alpha(brand[900], 0.5),
                            },
                        },
                    },
                    {
                        props: {
                            variant: 'text',
                        },
                        style: {
                            '&:active': {
                                backgroundColor: alpha(grey[700], 0.7),
                            },
                        },
                    },
                    {
                        props: {
                            color: 'secondary',
                            variant: 'text',
                        },
                        style: {
                            color: brand[100],
                            '&:active': {
                                backgroundColor: alpha(brand[900], 0.3),
                            },
                        },
                    },
                ],
            }),
        },
    },
    MuiIconButton: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                boxShadow: 'none',
                borderRadius: theme.shape.borderRadius,
                textTransform: 'none',
                fontWeight: theme.typography.fontWeightMedium,
                letterSpacing: 0,
                color: theme.palette.text.primary,
                variants: [
                    {
                        props: {
                            size: 'small',
                        },
                        style: {
                            width: '2.25rem',
                            height: '2.25rem',
                            padding: '0.25rem',
                            [`& .${svgIconClasses.root}`]: { fontSize: '1rem' },
                        },
                    },
                    {
                        props: {
                            size: 'medium',
                        },
                        style: {
                            width: '2.5rem',
                            height: '2.5rem',
                        },
                    },
                ],
            }),
        },
    },
    MuiToggleButtonGroup: {
        styleOverrides: {
            root: () => ({
                borderRadius: '10px',
                [`& .${toggleButtonGroupClasses.selected}`]: {
                    color: '#fff',
                },
                boxShadow: `0 4px 16px ${alpha(brand[700], 0.5)}`,
            }),
        },
    },
    MuiToggleButton: {
        styleOverrides: {
            root: () => ({
                padding: '12px 16px',
                textTransform: 'none',
                borderRadius: '10px',
                fontWeight: 500,
                color: grey[400],
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
                [`&.${toggleButtonClasses.selected}`]: {
                    color: brand[300],
                },
            }),
        },
    },
    MuiCheckbox: {
        defaultProps: {
            disableRipple: true,
            icon: (
                <CheckBoxOutlineBlankRoundedIcon sx={{ color: 'hsla(210, 0%, 0%, 0.0)' }} />
            ),
            checkedIcon: <CheckRoundedIcon sx={{ height: 14, width: 14 }} />,
            indeterminateIcon: <RemoveRoundedIcon sx={{ height: 14, width: 14 }} />,
        },
        styleOverrides: {
            root: () => ({
                margin: 10,
                height: 16,
                width: 16,
                borderRadius: 5,
                border: '1px solid ',
                transition: 'border-color, background-color, 120ms ease-in',
                '&:hover': {
                    borderColor: brand[300],
                },
                '&.Mui-checked': {
                    color: 'white',
                    backgroundColor: brand[500],
                    borderColor: brand[500],
                    boxShadow: `none`,
                    '&:hover': {
                        backgroundColor: brand[600],
                    },
                },
                borderColor: alpha(grey[700], 0.8),
                boxShadow: '0 0 0 1.5px hsl(210, 0%, 0%) inset',
                backgroundColor: alpha(grey[900], 0.8),
                '&.Mui-focusVisible': {
                    borderColor: brand[400],
                    outline: `3px solid ${alpha(brand[500], 0.5)}`,
                    outlineOffset: '2px',
                },
            }),
        },
    },
    MuiInputBase: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                input: {
                    '&::placeholder': {
                        opacity: 0.7,
                        color: grey[500],
                    },
                    "&:-webkit-autofill, input:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 100px #212121 inset !important",
                        // WebkitTextFillColor: "red !important",
                        borderRadius: 0,

                    },
                },

                color: theme.palette.grey[400],
            }),
            multiline: () => ({
                "&.MuiInputBase-multiline": {
                    height: "auto",
                }
            }),
        },
    },
    MuiOutlinedInput: {
        styleOverrides: {
            input: {
                padding: 0,
            },
            root: ({ theme }: { theme: Theme }) => ({
                padding: '8px 12px',
                color: theme.palette.text.primary,
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette.divider}`,
                transition: 'border 120ms ease-in',
                '&:hover': {
                    borderColor: grey[500],
                },
                '& .MuiInputBase-inputMultiline': {
                    height: '100%!important'
                },
                variants: [
                    {
                        props: {
                            size: 'small',
                        },
                        style: {
                            height: '2.25rem',
                        },
                    },
                    {
                        props: {
                            size: 'medium',
                        },
                        style: {
                            height: '2.5rem',
                        },
                    },
                ],
            }),
            notchedOutline: {
                border: 'none',
            },
        },
    },
    MuiInputAdornment: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                color: theme.palette.grey[400],
            }),
        },
    },
    MuiFormLabel: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                typography: theme.typography.caption,
                marginBottom: 8,
            }),
        },
    },
    MuiFormHelperText: {
        styleOverrides: {
            root: () => ({
                color: '#fff',
                marginLeft: 0,
            }),
        },
    },
    MuiTypography: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                color: theme.palette.grey[100],
                backgroundColor: 'unset',
            }),
        }
    },
};

