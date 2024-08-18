import React from 'react'
import { Link, Redirect, useParams } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'
import Area from '~/components/Sanctuary/Area'
import LoreContainer from '~/components/LoreContainer'

const AreaView = ({ match }) => {
  const { id }: { id: string } = match.params
  return (
    <LoreContainer color="dark">
      <Area id={id} />
    </LoreContainer>
  )
}

export default AreaView
