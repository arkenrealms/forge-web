import React from 'react'
import { createGlobalStyle } from 'styled-components'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'
import Skills from '~/components/Sanctuary/Skills'
import LoreContainer from '~/components/LoreContainer'

const SkillsView = () => {
  return (
    <LoreContainer>
      <Skills />
    </LoreContainer>
  )
}

export default SkillsView
