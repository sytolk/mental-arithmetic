import React from 'react';
import ReactDOM from 'react-dom';
import i18n from './i18n';
import App from './App';
import { sendMessageToHost } from './utils';

// historyResult is not received without this message.
sendMessageToHost({ command: 'loadDefaultTextContent' });

// @ts-ignore
i18n.changeLanguage(window.locale);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
