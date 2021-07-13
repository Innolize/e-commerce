import { createContext, useState } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { getTheme } from "../utils/getTheme";
import { PaletteType } from "@material-ui/core";

interface ThemeTypes {
  currentTheme: string;
  setTheme: null | ((name: string) => void);
}

export const ThemeContext = createContext<ThemeTypes>({
  currentTheme: "light",
  setTheme: null,
});

const CustomThemeProvider = (props: any) => {
  const { children } = props;
  const currentTheme = localStorage.getItem("appTheme") || "light";
  const [themeName, _setThemeName] = useState(currentTheme);
  const theme = getTheme(themeName as PaletteType);

  const setThemeName = (name: string) => {
    localStorage.setItem("appTheme", name);
    _setThemeName(name);
  };

  const contextValue = {
    currentTheme: themeName,
    setTheme: setThemeName,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default CustomThemeProvider;
