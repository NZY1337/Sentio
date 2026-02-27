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
                            variant: 'contained',
                        },
                        style: {
                            color: '#000',
                            backgroundColor: theme.palette.warning.light,
                            // backgroundImage: `linear-gradient(to bottom, ${grey[100]}, ${theme.palette.warning.light})`,
                            boxShadow: `inset 0 -1px 0   ${theme.palette.warning.dark}`,
                            border: `1px solid ${theme.palette.warning.light}`,
                            '&:hover': {
                                backgroundImage: 'unset',
                                boxShadow: 'none',
                            },
                            '&:active': {
                                // backgroundColor: grey[400],
                            },
                        },
                    },
                    {
                        props: {
                            variant: 'outlined',
                        },
                        style: {
                            border: `none`,
                            backgroundColor: grey[500],
                            color: '#000',
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
                ],
            }),
        },
    },
    MuiIconButton: {
        styleOverrides: {
        },
    },
    MuiToggleButtonGroup: {
        // styleOverrides: {
        //     root: () => ({
        //         borderRadius: '10px',
        //         [`& .${toggleButtonGroupClasses.selected}`]: {
        //             color: '#fff',
        //         },
        //         boxShadow: `0 4px 16px ${alpha(brand[700], 0.5)}`,
        //     }),
        // },
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

