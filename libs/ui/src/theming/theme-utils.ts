import { Theme } from '@material-ui/core';
import { lightTheme as light } from './light.theme';
import { darkTheme as dark} from './dark.theme';

const themeMap: { [key: string]: Theme } = {
  light,
  dark,
};

export function getThemeByName(theme: string): Theme {
  return themeMap[theme];
}

export const themeNames = {
  light: 'light',
  dark: 'dark',
};
