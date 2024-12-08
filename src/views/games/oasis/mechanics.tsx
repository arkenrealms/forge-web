import React from 'react'
import { createGlobalStyle } from 'styled-components'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'
import Mechanics from '~/components/Sanctuary/Mechanics'
import LoreContainer from '~/components/LoreContainer'

const MechanicsView = () => {
  return (
    <LoreContainer>
      <Mechanics />
    </LoreContainer>
  )
}

export default MechanicsView
