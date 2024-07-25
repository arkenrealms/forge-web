import React from 'react'
import App from '../App'

import '../index.less'

export const decorators = [
  (Story) => (
    <App>
      <Story />
    </App>
  ),
]

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
