import React, { useEffect } from 'react'
import Section, { SectionContent } from './ChampionSection'

const ChampionHome = (props) => {
  return (
    <Section className={props.className}>
      <SectionContent className={props.contentClassName} bgImage={props.bgImage} containerCss={props.containerCss}>
        {props.children}
      </SectionContent>
    </Section>
  )
}

export default ChampionHome
