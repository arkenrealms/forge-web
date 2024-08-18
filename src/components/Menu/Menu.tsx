import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import useWeb3 from '~/hooks/useWeb3';
import { useRunePrice, useProfile } from '~/state/hooks';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import Overlay from '../Overlay/Overlay';
import Flex from '../Box/Flex';
import Logo from './components/Logo';
import Panel from './components/Panel';
import UserBlock from './components/UserBlock';
import { NavProps } from './types';
import Avatar from './components/Avatar';
import { MENU_HEIGHT, SIDEBAR_WIDTH_REDUCED, SIDEBAR_WIDTH_FULL } from './config';
import useInterval from '~/hooks/useInterval';
import useBrand from '~/hooks/useBrand';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledNav = styled.nav<{ showMenu: boolean }>`
  position: fixed;
  top: ${({ showMenu }) => (showMenu ? 0 : `-${MENU_HEIGHT}px`)};
  left: 0;
  transition: top 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 8px;
  padding-right: 16px;
  width: 100%;
  height: ${MENU_HEIGHT}px;
  z-index: 20;
`;

const BodyWrapper = styled.div`
  position: relative;
  display: flex;
`;

const Inner = styled.div<{ isPushed: boolean; showMenu: boolean }>`
  // top: 66px;
  // left: 0;
  // width: 100%;
  // position: absolute;
  flex-grow: 1;
  // margin-top: ${({ showMenu }) => (showMenu ? `${MENU_HEIGHT}px` : 0)};
  // transition: margin-top 0.2s;
  transform: translate3d(0, 0, 0);
  max-width: 100%;
  margin-top: 64px;

  ${({ theme }) => theme.mediaQueries.nav} {
    margin-left: ${({ isPushed }) => `${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px`};
    max-width: ${({ isPushed }) => `calc(100% - ${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px)`};
  }
`;

const MobileOnlyOverlay = styled(Overlay)`
  position: fixed;
  height: 100%;

  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
`;

let init = false;

const Menu: React.FC<NavProps> = ({
  location,
  login,
  logout,
  isDark,
  toggleTheme,
  langs,
  setLang,
  currentLang,
  runePriceUsd,
  links,
  children,
  content,
}) => {
  const { address: account } = useWeb3();
  const { isXl } = useMatchBreakpoints();
  const { profile: profile2 } = useProfile(account);
  const profile = {
    username: profile2?.username,
    image: profile2?.nft ? `/images/nfts/${profile2.nft?.images.sm}` : undefined,
    profileLink: '/account',
    noProfileLink: '/account',
    showPip: !profile2?.username,
  };
  const isMobile = isXl === false;
  const [isPushed, setIsPushed] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const { brand } = useBrand();
  // const refPrevOffset = useRef(window.pageYOffset)
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const currentOffset = window.pageYOffset;
  //     const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight;
  //     const isTopOfPage = currentOffset === 0;
  //     // Always show the menu when user reach the top
  //     if (isTopOfPage) {
  //       setShowMenu(true);
  //     }
  //     // Avoid triggering anything at the bottom because of layout shift
  //     else if (!isBottomOfPage) {
  //       if (currentOffset < refPrevOffset.current) {
  //         // Has scroll up
  //         setShowMenu(true);
  //       } else {
  //         // Has scroll down
  //         setShowMenu(false);
  //       }
  //     }
  //     refPrevOffset.current = currentOffset;
  //   };
  //   const throttledHandleScroll = throttle(handleScroll, 200);

  //   window.addEventListener("scroll", throttledHandleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", throttledHandleScroll);
  //   };
  // }, []);

  useInterval(() => {
    const pushedSetting = window.localStorage
      ? !!parseInt(window.localStorage.getItem('autoPushSidebar') || '1')
      : true;
    if (pushedSetting !== isPushed) {
      setIsPushed(pushedSetting);
    }
  }, 1 * 1000);

  useEffect(() => {
    if (init) return;

    init = true;

    setIsPushed(true);
  }, [isPushed]);

  useEffect(() => {
    if (!window || !window.localStorage) return;

    const pushedSetting = window.localStorage
      ? !!parseInt(window.localStorage.getItem('autoPushSidebar') || '1')
      : true;
    if (pushedSetting !== isPushed) {
      setIsPushed(pushedSetting);
    }
  }, [isPushed, setIsPushed]);
  // Find the home link if provided
  const homeLink = links.find((link) => link.label === 'Home');

  const brandHeading = {
    rune: 'ARKEN',
    w4: 'ARKEN',
  };

  const brandSubheading = {
    rune: 'REALMS',
    raid: 'RAID',
    evolution: 'EVOLUTION',
    infinite: 'INFINITE',
    sanctuary: 'SANCTUARY',
    guardians: 'GUARDIANS',
    w4: 'GAME SERVICES',
  };

  const headingText = brandHeading[brand] || brandHeading.rune;
  const subheadingText = brandSubheading[brand] || brandSubheading.rune;

  return (
    <Wrapper>
      <StyledNav showMenu={showMenu} className="app__styled-nav">
        <Logo
          isPushed={isPushed}
          togglePush={() => {
            setIsPushed((prevState: boolean) => {
              window.localStorage.setItem('autoPushSidebar', prevState ? '0' : '1');
              return !prevState;
            });
          }}
          isDark={isDark}
          isMobile={isMobile}
          href={homeLink?.href ?? '/'}
          imageUrl={`/images/${brand}-256x256.png`}
          heading={
            <>
              <span style={{ fontSize: 35 }}>{headingText.slice(0, 1)}</span>
              {headingText.slice(1)}
            </>
          }
          subheading={subheadingText}
        />
        {content}
        <Flex>
          <UserBlock username={profile?.username} account={account} login={login} logout={logout} />
          {profile && <Avatar profile={profile} />}
        </Flex>
      </StyledNav>
      <BodyWrapper>
        <Panel
          location={location}
          isPushed={isPushed}
          isMobile={isMobile}
          showMenu={showMenu}
          isDark={isDark}
          toggleTheme={toggleTheme}
          langs={langs}
          setLang={setLang}
          currentLang={currentLang}
          runePriceUsd={runePriceUsd}
          pushNav={(pushed) => {
            setIsPushed(pushed);
            window.localStorage.setItem('autoPushSidebar', pushed ? '1' : '0');
          }}
          links={links}
        />
        <Inner isPushed={isPushed} showMenu={showMenu}>
          {children}
        </Inner>
        <MobileOnlyOverlay
          show={isPushed}
          onClick={() => {
            setIsPushed(false);
            window.localStorage.setItem('autoPushSidebar', '0');
          }}
          role="presentation"
        />
      </BodyWrapper>
    </Wrapper>
  );
};

export default Menu;
