import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
  }
`;

export default GlobalStyles;
