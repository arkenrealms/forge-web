import React from 'react';
import ReactDOM from 'react-dom';
import LogRocket from 'logrocket';
import { createBrowserHistory } from 'history';
import App from './App';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}

async function bootstrap() {
  const logRocketConfig = {
    console: {
      isEnabled: {
        log: false, // Enable logging for console.log
        info: false, // Disable logging for console.info
        warn: true, // Enable logging for console.warn
        error: true, // Enable logging for console.error
      },
    },
    network: {
      requestSanitizer: (request) => {
        // Exclude WebSocket requests
        if (request.url.startsWith('ws://') || request.url.startsWith('wss://')) {
          return null; // Returning null skips logging this request
        }
        return request;
      },
      responseSanitizer: (response) => {
        // console.log('LogRocket Response:', response); // Log the response object
        // Currently, no filtering applied
        return response;
      },
    },
    // dom: {
    //   textSanitizer: true,
    //   inputSanitizer: true,
    // },
    shouldCaptureIP: false,
  };

  if (process.env.ARKEN_ENV === 'production') LogRocket.init('nr5faq/arken-realms', logRocketConfig);
  else if (process.env.ARKEN_ENV === 'beta') LogRocket.init('nr5faq/arken-realms', logRocketConfig);

  ReactDOM.render(<App history={createBrowserHistory()} />, document.getElementById('root'));
}

bootstrap();
