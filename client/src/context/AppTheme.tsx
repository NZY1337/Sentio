import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { inputsCustomizations } from "../theme/customization/inputs";
import { navigationCustomization } from "../theme/customization/navigation";
import { typography, palette} from "../theme/themePrimitives";

interface AppThemeProps {
  children: React.ReactNode;
}

// https://mui.com/material-ui/customization/default-theme/

export default function AppThemeProvider({
  children,
}: Readonly<AppThemeProps>) {

  const theme = React.useMemo(() => {
    return createTheme({
          // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
          cssVariables: {
            // colorSchemeSelector: "data-mui-color-scheme",
            // cssVarPrefix: "template",
          },
          // colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes,
          // defaultColorScheme: 'light',
          typography,
          palette,
          components: {
            ...inputsCustomizations,
            ...navigationCustomization
          },
          
        });
  }, []);
 
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
