import React from 'react'
import { createGlobalStyle } from 'styled-components'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'
import Monsters from '~/components/Sanctuary/Monsters'
import LoreContainer from '~/components/LoreContainer'

const MonstersView = () => {
  return (
    <LoreContainer color="dark">
      <Monsters />
    </LoreContainer>
  )
}

export default MonstersView
