import React from 'react'
import { createGlobalStyle } from 'styled-components'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'
import Bosses from '~/components/Sanctuary/Bosses'
import LoreContainer from '~/components/LoreContainer'

const BossesView = () => {
  return (
    <LoreContainer color="dark">
      <Bosses />
    </LoreContainer>
  )
}

export default BossesView
