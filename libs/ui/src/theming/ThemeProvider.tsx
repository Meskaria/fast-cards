import React, { useState } from 'react';
import { MuiThemeProvider } from "@material-ui/core";
import { getThemeByName, themeNames } from './themeUtils';
import {ThemeContext} from './ThemeContext';

const ThemeProvider: React.FC = (props) => {
  const {light, dark} = themeNames;
  // Get form the api instead ???
  const initialThemeName = localStorage.getItem("appTheme") || light;
  // State to hold the selected theme name
  const [themeName, _setThemeName] = useState(initialThemeName);
  // Get the theme object by theme name
  const theme = getThemeByName(themeName);
  const toggleTheme = (): void => {
    const newTheme = themeName === light ? dark : light;
    _setThemeName(newTheme);
    localStorage.setItem("appTheme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{theme: themeName , toggleTheme}}>
      <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
