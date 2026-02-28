import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import { inputsCustomizations } from "../theme/customization/inputs";
import { navigationCustomization } from "../theme/customization/navigation";
import { typography, darkPalette, lightPalette } from "../theme/customization/themePrimitives";

interface AppThemeProps {
    children: React.ReactNode;
}

const sharedComponents = {
    MuiCssBaseline: {
        styleOverrides: {
            body: {
                backgroundColor: 'unset',
            },
        },
    },
    ...inputsCustomizations,
    ...navigationCustomization,
};

export const publicTheme = createTheme({
    palette: {
        ...darkPalette,
    },
    typography,
    components: {
        ...sharedComponents,
        MuiPaper: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.palette.background.default,
                }),
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: () => ({
                    boxShadow: 'none',
                    backgroundColor: 'transparent',
                    backgroundImage: 'none',
                }),
            },
        },
    },
});

export const dashboardTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-mui-color-scheme',
    },
    colorSchemes: {
        dark: {
            palette: { ...darkPalette },
        },
        light: {
            palette: { ...lightPalette },
        },
    },
    typography,
    components: sharedComponents,
});

export function PublicThemeProvider({ children }: Readonly<AppThemeProps>) {
    return (
        <ThemeProvider theme={publicTheme} disableTransitionOnChange>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}

export function DashboardThemeProvider({ children }: Readonly<AppThemeProps>) {
    return (
        <ThemeProvider theme={dashboardTheme} disableTransitionOnChange defaultMode="dark">
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}
