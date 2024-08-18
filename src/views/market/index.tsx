import React from 'react'
import { createGlobalStyle } from 'styled-components'
import Page from '~/components/layout/Page'
import Market from '~/components/Market'

const MarketView = (props) => {
  const GlobalStyles = createGlobalStyle`
  input, textarea {
    text-transform: none;
  }
  `

  return (
    <Page>
      <GlobalStyles />
      <Market />
      {/* <p>Maintenance. Please come back later.</p> */}
    </Page>
  )
}

export default MarketView
