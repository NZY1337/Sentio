import { createTheme, alpha, } from '@mui/material/styles';
import { grey, green, red, orange } from '@mui/material/colors';

const defaultTheme = createTheme();

export const brand = {
  50: 'hsl(210, 100%, 95%)',
  100: 'hsl(210, 100%, 92%)',
  200: 'hsl(210, 100%, 80%)',
  300: 'hsl(210, 100%, 65%)',
  400: 'hsl(210, 98%, 48%)',
  500: 'hsl(210, 98%, 42%)',
  600: 'hsl(210, 98%, 55%)',
  700: 'hsl(210, 100%, 35%)',
  800: 'hsl(210, 100%, 16%)',
  900: 'hsl(210, 100%, 21%)',
};

export const  palette = {
    primary: {
        contrastText: brand[50],
        light: brand[300],
        main: brand[400],
        dark: brand[700],
    },
    info: {
        contrastText: brand[300],
        light: brand[500],
        main: brand[700],
        dark: brand[900],
    },
    warning: {
        light: orange[400],
        main: orange[500],
        dark: orange[700],
    },
    error: {
        light: red[400],
        main: red[500],
        dark: red[700],
    },
    success: {
        light: green[400],
        main: green[500],
        dark: green[700],
    },
    grey: {
        ...grey,
    },
    divider: alpha(grey[700], 0.6),
    background: {
        default: grey[900],
        paper: 'hsl(220, 30%, 7%)',
    },
    text: {
        primary: 'hsl(0, 0%, 100%)',
        secondary: grey[400],
    },
    action: {
        hover: alpha(grey[600], 0.2),
        selected: alpha(grey[600], 0.3),
    },
}

export const typography = {
  h1: {
    fontSize: defaultTheme.typography.pxToRem(48),
    lineHeight: 1.2,
    letterSpacing: -0.5,
    fontFamily: 'Playfair Display, serif',
    fontWeight: 400,
  },
  h2: {
    fontSize: defaultTheme.typography.pxToRem(36),
    fontWeight: 600,
    lineHeight: 1.2,
    fontFamily: 'Playfair Display, serif',
  },
  h3: {
    fontSize: defaultTheme.typography.pxToRem(30),
    lineHeight: 1.2,
    fontFamily: 'Playfair Display, serif',
  },
  h4: {
    fontSize: defaultTheme.typography.pxToRem(24),
    fontWeight: 600,
    lineHeight: 1.5,
    fontFamily: 'Playfair Display, serif',
  },
  h5: {
    fontSize: defaultTheme.typography.pxToRem(20),
    fontWeight: 600,
    fontFamily: 'Playfair Display, serif',
  },
  h6: {
    fontSize: defaultTheme.typography.pxToRem(18),
    fontWeight: 600,
    fontFamily: 'Playfair Display, serif',
  },
  subtitle1: {
    fontSize: defaultTheme.typography.pxToRem(18),
    fontFamily: 'Poppins, serif',
  },
  subtitle2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 500,
    fontFamily: 'Poppins, serif',
  },
  body1: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontFamily: 'Poppins, serif',
  },
  body2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontFamily: 'Poppins, serif',
    fontWeight: 400,
    
  },
  caption: {
    fontSize: defaultTheme.typography.pxToRem(12),
    fontFamily: 'Poppins, serif',
    fontWeight: 400,
  },
  button: {
    fontFamily: 'Poppins, serif',
  },
  input: {
    fontFamily: 'Poppins, serif',
  }
};

export const shape = {
  borderRadius: 8,
};

