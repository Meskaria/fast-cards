import { createMuiTheme } from '@material-ui/core';
import { typography } from './config/typography';
import { measurements } from './config/measurements';
import { PaletteOptions } from '@material-ui/core/styles/createPalette';

const palette = {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#fe7b37',
    },
    background: {
      default: '#4e586c',
      light: '#717171',
    },
    error: {
      main: '#e05252',
    },
    warning: {
      main: '#ff6000',
    },
    info: {
      main: '#5faaff',
      light: '#e6f2ff',
    },
    success: {
      main: '#5fc89f',
      light: '#ebf8f2',
    },
    divider: '#bec1c9',
    text: {
      secondary: '#97999d',
      primary: '#2c3243',
      disabled: '#92999c',
      hint: '#2c3243',
    },
} as PaletteOptions;

export const darkTheme = createMuiTheme({
  palette,
  typography,
  ...measurements,
});
