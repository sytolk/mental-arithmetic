import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { sendMessageToHost } from './utils';

// mdContent is not received without this message.
sendMessageToHost({ command: 'loadDefaultTextContent' });

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
