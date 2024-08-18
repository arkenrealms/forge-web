import React from 'react'
import { createGlobalStyle } from 'styled-components'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'
import ItemAttributes from '~/components/ItemAttributes'
import LoreContainer from '~/components/LoreContainer'

const ItemAttributesView = () => {
  return (
    <LoreContainer color="dark">
      <ItemAttributes />
    </LoreContainer>
  )
}

export default ItemAttributesView
