import React, { useState } from 'react';
import { MuiThemeProvider, useMediaQuery } from '@material-ui/core';
import { getThemeByName, themeNames } from './theme-utils';
import {ThemeContext} from './theme-context';

export const ThemeProvider: React.FC = (props) => {
  const {light, dark} = themeNames;

  const setPreferredMode = useMediaQuery('(prefers-color-scheme: dark)') ? dark : light;
  // Get form the api instead ???
  const initialThemeName = localStorage.getItem("appTheme") || setPreferredMode;
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
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

