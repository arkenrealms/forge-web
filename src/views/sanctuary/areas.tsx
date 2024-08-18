import React from 'react'
import { createGlobalStyle } from 'styled-components'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'
import Areas from '~/components/Sanctuary/Areas'
import LoreContainer from '~/components/LoreContainer'

const AreasView = () => {
  return (
    <LoreContainer color="dark">
      <Areas />
    </LoreContainer>
  )
}

export default AreasView
