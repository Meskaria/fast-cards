import React from 'react';
import { FormControlLabel, Switch } from '@material-ui/core';
import { ThemeContext } from '../../theming/ThemeContext';
import {themeNames} from '../../theming/themeUtils'

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
