import React from 'react';
import { FormControlLabel, Switch } from '@material-ui/core';
import { ThemeContext } from '../../theming/theme-context';
import {themeNames} from '../../theming/theme-utils'

export const ThemeSwitcher: React.FC = () => (
  <ThemeContext.Consumer>
    {({theme, toggleTheme}) => (
      <FormControlLabel
        control={
          <Switch
            checked={theme === themeNames.light}
            onChange={() => toggleTheme()}
            color="primary"
          />
        }
        label="Primary"
      />
    )}
  </ThemeContext.Consumer>
);
