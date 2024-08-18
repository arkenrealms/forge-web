import React from 'react'
import { Link, Redirect, useParams } from 'react-router-dom'
import Faction from '~/components/Sanctuary/Faction'
import LoreContainer from '~/components/LoreContainer'

const FactionView = ({ match }) => {
  const { id }: { id: string } = match.params
  return (
    <LoreContainer color="red">
      <Faction id={id} />
    </LoreContainer>
  )
}

export default FactionView
