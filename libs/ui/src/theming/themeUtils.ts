import { Theme } from '@material-ui/core';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';

const themeMap: { [key: string]: Theme } = {
  lightTheme,
  darkTheme,
};

export function getThemeByName(theme: string): Theme {
  return themeMap[theme];
}

export const themeNames = {
  light: 'lightTheme',
  dark: 'darkTheme',
};
