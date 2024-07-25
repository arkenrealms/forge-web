import React from 'react'
import styled, { css } from 'styled-components'
import PanelBody from './PanelBody'
import PanelFooter from './PanelFooter'
import { SIDEBAR_WIDTH_REDUCED, SIDEBAR_WIDTH_FULL } from '../config'
import { PanelProps, PushedProps } from '../types'

interface Props extends PanelProps, PushedProps {
  showMenu: boolean
  isMobile: boolean
  location: string
}

const StyledPanel = styled.div<{ isPushed: boolean; showMenu: boolean }>`
  position: fixed;
  padding-top: ${({ showMenu }) => (showMenu ? '65px' : 0)};
  top: 0;
  left: 0;
  display: ${({ isPushed }) => (isPushed ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  width: ${({ isPushed }) => (isPushed ? `${SIDEBAR_WIDTH_FULL}px` : 0)};
  height: auto;
  z-index: 11;
  overflow: ${({ isPushed }) => (isPushed ? 'initial' : 'hidden')};
  transform: translate3d(0, 0, 0);

  ${({ theme }) => theme.mediaQueries.nav} {
    // border-left: 2px solid rgba(133, 133, 133, 0.1);
    // border-right: 2px solid rgba(133, 133, 133, 0.1);
    width: ${({ isPushed }) => `${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px`};
  }

  overflow: hidden;

  display: flex;
  flex-direction: column;
  overflow: hidden auto;
  height: 100%;
`

const Panel: React.FC<Props> = (props) => {
  const { isPushed, showMenu } = props
  return (
    <StyledPanel isPushed={isPushed} showMenu={showMenu} className="app__styled-panel">
      <PanelBody {...props} />
      <PanelFooter {...props} />
    </StyledPanel>
  )
}

export default Panel
