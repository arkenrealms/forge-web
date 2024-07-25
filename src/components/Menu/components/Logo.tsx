import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { LogoIcon } from '../../Svg'
import Flex from '../../Box/Flex'
import { HamburgerIcon, HamburgerCloseIcon, LogoIcon as LogoWithText } from '../icons'
import MenuButton from './MenuButton'

interface Props {
  isPushed: boolean
  isDark: boolean
  isMobile: boolean
  togglePush: () => void
  href: string
  imageUrl: string
  heading: any
  subheading: any
}

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  .mobile-icon {
    width: 32px;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: none;
    }
  }
  .desktop-icon {
    width: 156px;
    display: none;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: block;
    }
  }
`

const Logo: React.FC<Props> = ({ isPushed, togglePush, isDark, isMobile, href, imageUrl, heading, subheading }) => {
  const isAbsoluteUrl = href.startsWith('http')
  const innerLogo = (
    <>
      {/* <LogoIcon className="mobile-icon" /> */}
      {/* <LogoWithText className="mobile-icon" isDark={isDark} /> */}
      <LogoWithText
        className="desktop-icon"
        isDark={isDark}
        isMobile={isMobile}
        heading={heading}
        subheading={subheading}
      />
    </>
  )

  return (
    <Flex style={{ zoom: 0.9 }}>
      <MenuButton aria-label="Toggle menu" onClick={togglePush} mr="0px">
        <Img src={imageUrl} isPushed={isPushed} />
      </MenuButton>
      {isAbsoluteUrl ? (
        <StyledLink as="a" href={href}>
          {innerLogo}
        </StyledLink>
      ) : (
        <StyledLink to={href}>{innerLogo}</StyledLink>
      )}
    </Flex>
  )
}

const Img = styled.img<{ isPushed: boolean }>`
  width: 45px;
  height: 45px;
  max-width: 45px;
  image-rendering: auto;
  filter: drop-shadow(0px 0px 2px black);

  // &:hover {
  //   animate: transform 1s;
  //   filter: sepia(1);

  //   animation-name: spin;
  //   animation-duration: 4000ms;
  //   animation-iteration-count: infinite;
  //   animation-timing-function: linear;
  // }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  transform: rotate(0deg);

  // ${({ isPushed }) => (isPushed ? 'transform: rotate(180deg);' : 'transform: rotate(0deg);')}
`

export default React.memo(Logo, (prev, next) => prev.isPushed === next.isPushed && prev.isDark === next.isDark)
