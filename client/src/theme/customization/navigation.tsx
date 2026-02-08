import { type Theme, type Components } from '@mui/material/styles';

export const navigationCustomization: Components<Theme> = {
  MuiAppBar: {
    styleOverrides: {
        root: () => ({
            boxShadow: 'none',  
            backgroundColor: 'transparent',
            position: 'absolute',   
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
        },
        '&:hover': {   
            backgroundColor: 'transparent',
        },
      }),
    },
  },
};

