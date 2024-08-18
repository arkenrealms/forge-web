import React from 'react'
import { createGlobalStyle } from 'styled-components'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'
import Eras from '~/components/Sanctuary/Eras'
import LoreContainer from '~/components/LoreContainer'

const ErasView = () => {
  return (
    <LoreContainer color="dark">
      <Eras />
    </LoreContainer>
  )
}

export default ErasView
