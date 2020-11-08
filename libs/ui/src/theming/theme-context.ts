import React from 'react';
import {themeNames} from './theme-utils'

export const ThemeContext = React.createContext({
  theme: themeNames.light,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleTheme: (): void => {},
});
