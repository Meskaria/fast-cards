import React from 'react';
import {themeNames} from './themeUtils'

export const ThemeContext = React.createContext({
  theme: themeNames.light,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleTheme: (): void => {},
});
