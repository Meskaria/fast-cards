import 'antd/dist/antd.css';
import React from 'react';
import styled, { ThemeProvider } from '@xstyled/styled-components';
import GlobalStyles from './globalStyles';

import { Route, Link } from 'react-router-dom';
import theme from '../theme';

const StyledApp = styled.div`
  font-family: sans-serif;
  min-width: 300px;
  max-width: 600px;
  margin: 50px auto;
`;

export const App = () => {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./app.styled-components file.
   */
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <StyledApp>
        <div role="navigation">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </div>
        <Route
          path="/"
          exact
          render={() => <div>This is the generated root route. </div>}
        />
        {/* END: routes */}
      </StyledApp>
    </ThemeProvider>
  );
};

export default App;
