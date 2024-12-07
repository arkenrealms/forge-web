import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import useWeb3 from '~/hooks/useWeb3';
import { Link as RouterLink } from 'react-router-dom';
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

const Nav = styled.div`
  width: calc(100% - 300px);
  padding: 0px 5px 0px 20px;
  line-height: 40px;
  color: #fff;
  margin: -20px 0;
  overflow-x: auto;
  overflow-y: hidden;

  span {
    padding-top: 3px;
    display: inline-block;
  }

  button {
    display: inline-flex;
    align-items: center;
    color: #fff;
  }
`;

const NavItem = styled(RouterLink)<{ isFocused?: boolean }>`
  font-size: 1.35rem;
  padding: 15px 20px 10px;
  // border-right: 2px solid #030303;
  color: #bb955e;
  // background-color: #222;
  // background-image: linear-gradient(180deg,transparent 0,rgba(0,0,0,1) 50%,transparent);
  height: 65px;
  text-shadow:
    0 0 5px #000,
    00 0 10px #000,
    0 0 15px #000000,
    0 0 20px #000000;

  ${({ isFocused }) =>
    isFocused
      ? `
    font-weight: bold;
    text-shadow: 0 0 5px #000, 0 0 5px #000, 0 0 5px #000, 0 0 10px #000, 0 0 10px #000, 0 0 10px #000, 0 0 15px #000000,
      0 0 15px #000000, 0 0 15px #000000, 0 0 20px #000000, 0 0 20px #000000, 0 0 20px #000000;
  `
      : ''}

  &:last-child {
    // border-right: 2px solid #030303;
    // border-right: none;
  }

  &:hover {
    filter: brightness(1.4);
  }
`;

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
  return <></>;
};

export default Menu;
