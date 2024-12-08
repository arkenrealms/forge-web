import React from 'react'
import { createGlobalStyle } from 'styled-components'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'
import ItemTypes from '~/components/Sanctuary/ItemTypes'
import LoreContainer from '~/components/LoreContainer'

const ItemTypesView = () => {
  return (
    <LoreContainer>
      <ItemTypes />
    </LoreContainer>
  )
}

export default ItemTypesView
