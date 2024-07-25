import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'
import App from './App'
import createApolloClient from './apollo-client'

async function bootstrap() {
  const apolloClient = await createApolloClient()

  // try {
  ReactDOM.render(
    <App history={createBrowserHistory()} apolloClient={apolloClient} />,
    document.getElementById('root')
  )
  // } catch (err) {
  //   if ((err + '').indexOf('ResizeObserver') !== -1) {
  //     console.log('Ignored: ResizeObserver loop limit exceeded')
  //   } else {
  //     throw err
  //   }
  // }
}

bootstrap()
