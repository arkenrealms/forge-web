import React from 'react'
import { createGlobalStyle } from 'styled-components'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'
import Classes from '~/components/Sanctuary/Classes'
import LoreContainer from '~/components/LoreContainer'

const ClassesView = () => {
  return (
    <LoreContainer color="dark">
      <Classes />
    </LoreContainer>
  )
}

export default ClassesView
