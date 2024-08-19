import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import App from './App';
import createApolloClient from './apollo-client';

async function bootstrap() {
  const apolloClient = await createApolloClient();

  ReactDOM.render(
    <App history={createBrowserHistory()} apolloClient={apolloClient} />,
    document.getElementById('root')
  );
}

bootstrap();
