import React from 'react'
import Page from '~/components/layout/Page'
import Rune from '~/components/Rune'

const RuneView = ({ match }) => {
  return (
    <Page>
      <Rune match={match} />
    </Page>
  )
}

export default RuneView
