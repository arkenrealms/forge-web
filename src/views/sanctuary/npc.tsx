import React from 'react'
import { Link, Redirect, useParams } from 'react-router-dom'
import NPC from '~/components/Sanctuary/NPC'
import LoreContainer from '~/components/LoreContainer'

const NPCView = ({ match }) => {
  const { id }: { id: string } = match.params
  return (
    <LoreContainer color="dark">
      <NPC id={id} />
    </LoreContainer>
  )
}

export default NPCView
