import React from 'react'
import { createGlobalStyle } from 'styled-components'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'
import Stats from '~/components/Stats'

const StatsView = () => {
  return (
    <Page>
      <PageWindow>
        <Stats />
      </PageWindow>
    </Page>
  )
}

export default StatsView
