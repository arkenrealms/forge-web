import React from 'react'
import { Link, Redirect, useParams } from 'react-router-dom'
import Item from '~/components/Sanctuary/Item'
import LoreContainer from '~/components/LoreContainer'

const ItemView = ({ match }) => {
  const { id }: { id: string } = match.params
  return (
    <LoreContainer>
      <Item id={id} />
    </LoreContainer>
  )
}

export default ItemView
