import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { inputsCustomizations } from "../theme/customization/inputs";
import { navigationCustomization } from "../theme/customization/navigation";
import { typography, darkPalette, lightPalette } from "../theme/themePrimitives";

interface AppThemeProps {
  children: React.ReactNode;
}

export const appTheme = createTheme({
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
  components: {
    ...inputsCustomizations,
    ...navigationCustomization,
  },
});

export default function AppThemeProvider({ children }: Readonly<AppThemeProps>) {
  return (
    <ThemeProvider theme={appTheme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
