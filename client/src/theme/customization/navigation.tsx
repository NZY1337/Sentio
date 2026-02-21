import { type Theme, type Components } from '@mui/material/styles';

export const navigationCustomization: Components<Theme> = {
  MuiAppBar: {
    styleOverrides: {
      root: ({ ownerState }) => ({
        boxShadow: 'none',
        backgroundColor: 'transparent !important',
        backgroundImage: 'none',
        // Only apply absolute positioning to dashboard AppBar (from Toolpad)
        ...(ownerState.position === 'fixed' && {
          position: 'absolute',
        }),
      }),
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: () => ({
        backgroundColor: 'transparent',
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
          color: 'white',
          textDecoration: 'none',
          '&:hover': {
            color: 'rgba(255,255,255,0.8)',
          },
        },
        '&:hover': {
          backgroundColor: 'transparent',
        },
      }),
    },
  },
};

