import React from 'react'
import { createGlobalStyle } from 'styled-components'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'
import Items from '~/components/Sanctuary/Items'
import LoreContainer from '~/components/LoreContainer'

const ItemsView = () => {
  return (
    <LoreContainer color="dark">
      <Items />
    </LoreContainer>
  )
}

export default ItemsView
