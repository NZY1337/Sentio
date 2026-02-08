import { type Theme, } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';

// export const breakpoints = {
//     values: {
//         xs: 0,
//         sm: 600,
//         md: 600,
//         lg: 1200,
//         xl: 1536,
//     },
// };
export const palette = {
    // primary: {
    //     main: purple[500],
    // },
    // success: {
    //     main: green[500],
    // },
};

export const colorSchemes = {
    light: true,
    dark: true,
};

export const typography = {
    h1: {
        lineHeight: 1.2,
        letterSpacing: -0.5,
        fontFamily: 'Playfair Display, serif',
        fontWeight: 400,
    },
    h2: {
        fontWeight: 600,
        lineHeight: 1.2,
        fontFamily: 'Playfair Display, serif',
    },
    h3: {
        lineHeight: 1.2,
        fontFamily: 'Playfair Display, serif',
    },
    h4: {
        fontWeight: 600,
        lineHeight: 1.5,
        fontFamily: 'Playfair Display, serif',
    },
    h5: {
        fontWeight: 600,
        fontFamily: 'Playfair Display, serif',
    },
    h6: {
        fontWeight: 600,
        fontFamily: 'Playfair Display, serif',
    },
    subtitle1: {
        fontFamily: 'Poppins, serif',
    },
    subtitle2: {
        fontWeight: 500,
        fontFamily: 'Poppins, serif',
    },
    body1: {
        fontFamily: 'Poppins, serif',
        fontSize: '.9rem',
    },
    body2: {
        fontFamily: 'Poppins, serif',
        fontWeight: 400,
    },
    caption: {
        fontFamily: 'Poppins, serif',
        fontWeight: 400,
    },
    button: {
        fontFamily: 'Poppins, serif',
    },
};

export const components = {
    MuiButtonBase: {
        styleOverrides: {
            root: ({ theme }: { theme: Theme }) => ({
                // transition: 'all 100ms ease-in',
                // color: theme.palette.mode === 'dark' ? 'yellow' : 'green',
            }),
        },
    },
};
