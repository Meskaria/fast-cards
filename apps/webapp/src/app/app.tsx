import 'antd/dist/antd.css';
import React from 'react';
import styled, { ThemeProvider } from '@xstyled/styled-components';

import GlobalStyles from './globalStyles';
import theme from '../theme';

import Routing from './routing';

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Routing />
    </ThemeProvider>
  );
};

export default App;
