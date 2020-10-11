import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

export default createGlobalStyle`
  ${normalize}

  h1, h2, h3 {
   font-family: 'Montserrat', sans-serif;';
 }
`;
