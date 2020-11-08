import React from 'react';
import { getThemeByName, themeNames } from './theme-utils';

export const ThemeContext = React.createContext({
  theme: getThemeByName(themeNames.light),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleTheme: (): void => {},
});
