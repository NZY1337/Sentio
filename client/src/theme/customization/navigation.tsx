import { type Theme, type Components } from '@mui/material/styles';

export const navigationCustomization: Components<Theme> = {

    MuiDrawer: {
        styleOverrides: {
            paper: ({ theme }: { theme: Theme }) => ({
                '& .MuiListItemButton-root.Mui-selected': {
                    backgroundColor: theme.palette.action.selected,
                },
                '& .MuiListItemButton-root.Mui-selected:hover': {
                    backgroundColor: theme.palette.action.selected,
                },
                '& .MuiListItemButton-root.Mui-selected .MuiListItemText-primary, & .MuiListItemButton-root.Mui-selected .MuiTypography-root': {
                    color: theme.palette.warning.light
                },
                '& .MuiListItemButton-root.Mui-selected .MuiListItemIcon-root, & .MuiListItemButton-root.Mui-selected .MuiSvgIcon-root': {
                    color: theme.palette.warning.light
                },
            }),
        },
    },
    MuiMenuItem: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                '& .MuiTypography-root': {
                    color: theme.palette.grey[100],
                    textDecoration: 'none',
                    '&:hover': {
                        color: theme.palette.grey[500],
                    },
                    ...theme.applyStyles('light', {
                        color: theme.palette.text.primary,
                        '&:hover': {
                            color: theme.palette.text.secondary,
                        },
                    }),
                },
                '& .MuiLink-root': {
                    color: theme.palette.grey[100],
                    textDecoration: 'none',
                },
                '&:hover': {
                    backgroundColor: 'transparent',
                },
            }),
        },
    },
};

