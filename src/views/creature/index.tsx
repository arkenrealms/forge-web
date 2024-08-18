import React from 'react'
import { createGlobalStyle } from 'styled-components'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'
import Creature from '~/components/Creature'
import LoreContainer from '~/components/LoreContainer'

const CreatureView = () => {
  return (
    <LoreContainer color="dark">
      <Creature />
    </LoreContainer>
  )
}

export default CreatureView
