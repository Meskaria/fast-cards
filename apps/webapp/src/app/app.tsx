import React from 'react';
import GlobalStyles from './globalStyles';
import { ThemeProvider } from '../lib/theming/theme-provider';
import Routing from './routing';

export const App = () => {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <Routing />
    </ThemeProvider>
  );
};

export default App;
