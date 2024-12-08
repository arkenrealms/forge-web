import React from 'react'
import { createGlobalStyle } from 'styled-components'
import Page from '~/components/layout/Page'
import Tournament from '~/components/Tournament'

const TournamentView = () => {
  return (
    <Page>
      <Tournament />
    </Page>
  )
}

export default TournamentView
