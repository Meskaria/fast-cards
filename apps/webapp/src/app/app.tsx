import React from 'react';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import ThemeProvider from 'libs/ui/src/theming/ThemeProvider';
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
