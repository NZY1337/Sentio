import { alpha, type Theme, type Components } from '@mui/material/styles';
import type { } from '@mui/x-data-grid/themeAugmentation';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';

// colors
import { grey } from '@mui/material/colors';

export const inputsCustomizations: Components<Theme> = {
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
    MuiInputAdornment: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                color: theme.palette.grey[400],
            }),
        },
    },
    MuiDataGrid: {
        styleOverrides: {
            root: () => ({
                backgroundColor: 'unset',
                '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                    outline: 'none',
                },
                '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
                    outline: 'none',
                },
            }),
        },
    }
}
