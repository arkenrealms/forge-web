import React from 'react'
import { createGlobalStyle } from 'styled-components'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'
import Acts from '~/components/Sanctuary/Acts'
import LoreContainer from '~/components/LoreContainer'

const ActsView = () => {
  return (
    <LoreContainer color="dark">
      <Acts />
    </LoreContainer>
  )
}

export default ActsView
