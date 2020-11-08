import React from 'react';
import { ThemeProvider } from '@meskaria/ui'
import GlobalStyles from './globalStyles';

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
