import React, { StrictMode } from 'react';
import { ColorModeScript, ChakraProvider } from '@chakra-ui/react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil'
import theme from './theme'
import App from './App';
import reportWebVitals from './reportWebVitals';
import './state'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <RecoilRoot>
      <ColorModeScript />
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </RecoilRoot>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
