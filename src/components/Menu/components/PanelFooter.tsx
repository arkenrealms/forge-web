import React from 'react'
import styled from 'styled-components'
import useBrand from '~/hooks/useBrand'
import IconButton from '../../Button/IconButton'
import { MENU_ENTRY_HEIGHT } from '../config'
import { PanelProps, PushedProps } from '../types'
import SocialLinks from './SocialLinks'
import LangSelector from './LangSelector'
import { SvgProps } from '../../Svg'
import * as IconModule from '../icons'

interface Props extends PanelProps, PushedProps {}

const Container = styled.div`
  flex: none;
  padding: 8px 4px;
  position: relative;

  &:before {
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #37374c;
    mix-blend-mode: color-dodge;
    // filter: hue-rotate(20deg) sepia(20);
  }
`

const SettingsEntry = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${MENU_ENTRY_HEIGHT}px;
  padding: 0 8px;
`

const SocialEntry = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${MENU_ENTRY_HEIGHT}px;
  padding: 0 16px;
`

const Icons = IconModule as unknown as { [key: string]: React.FC<SvgProps> }
const { LanguageIcon } = Icons

const PanelFooter: React.FC<Props> = ({
  isPushed,
  pushNav,
  toggleTheme,
  isDark,
  runePriceUsd,
  currentLang,
  langs,
  setLang,
}) => {
  const { brand } = useBrand()
  if (!isPushed) {
    return (
      <Container>
        <IconButton variant="text" onClick={() => pushNav(true)}>
          <LanguageIcon />
        </IconButton>
      </Container>
    )
  }

  return (
    <Container>
      {brand !== 'w4' ? (
        <SocialEntry>
          <LangSelector currentLang={currentLang} langs={langs} setLang={setLang} />
          <SocialLinks />
        </SocialEntry>
      ) : null}
      {/* <SettingsEntry>
        <LangSelector currentLang={currentLang} langs={langs} setLang={setLang} />
      </SettingsEntry> */}
    </Container>
  )
}

export default PanelFooter
