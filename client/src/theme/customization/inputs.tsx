import { alpha, type Theme, type Components } from '@mui/material/styles';
import { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { brand } from '../themePrimitives';

// colors
import { grey } from '@mui/material/colors';


export const inputsCustomizations: Components<Theme> = {
    MuiButtonBase: {
        styleOverrides: {
            root: () => ({

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
                            ...theme.applyStyles('light', {
                                borderColor: grey[300],
                                backgroundColor: grey[50],
                                '&:active': { backgroundColor: grey[200] },
                            }),
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
                            ...theme.applyStyles('light', {
                                color: brand[700],
                                borderColor: brand[400],
                                backgroundColor: alpha(brand[400], 0.1),
                                '&:hover': {
                                    backgroundColor: alpha(brand[400], 0.2),
                                    borderColor: brand[500],
                                },
                            }),
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
                            ...theme.applyStyles('light', {
                                '&:active': { backgroundColor: alpha(grey[300], 0.7) },
                            }),
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
                            ...theme.applyStyles('light', {
                                color: brand[600],
                                '&:active': { backgroundColor: alpha(brand[400], 0.2) },
                            }),
                        },
                    },
                ],
            }),
        },
    },
    MuiIconButton: {
        styleOverrides: {
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
        },
    },
    MuiInputBase: {
        styleOverrides: {
            root: () => ({
            }),
        },
    },
    MuiOutlinedInput: {
        styleOverrides: {
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
            root: ({ theme }: { theme: Theme }) => ({
                color: '#fff',
                marginLeft: 0,
                ...theme.applyStyles('light', {
                    color: theme.palette.text.secondary,
                }),
            }),
        },
    },
    MuiTypography: {
        styleOverrides: {
            root: () => ({
                backgroundColor: 'unset',
            }),
        }
    },
};

