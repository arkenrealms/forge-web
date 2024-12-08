import React from 'react'
import { createGlobalStyle } from 'styled-components'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'
import Roadmap from '~/components/Roadmap'

const RoadmapView = () => {
  return (
    <Page>
      <PageWindow>
        <Roadmap />
      </PageWindow>
    </Page>
  )
}

export default RoadmapView
