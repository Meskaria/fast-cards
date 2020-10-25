import React from 'react';
import { FormControlLabel, Switch } from '@material-ui/core';
import { ThemeContext } from '../../theming/ThemeContext';

const ThemeSwitcher: React.FC = () => (
  <ThemeContext.Consumer>
    {({theme, toggleTheme}) => (
      <FormControlLabel
        control={
          <Switch
            checked={theme === 'lightTheme'}
            onChange={() => toggleTheme()}
            color="primary"
          />
        }
        label="Primary"
      />
  )}
  </ThemeContext.Consumer>
);

export default ThemeSwitcher;
