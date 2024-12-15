import { BsX } from 'react-icons/bs';
import { PurchaseModal } from '~/components/PurchaseModal';
import { SwapModal } from '~/components/SwapModal';
import { EN } from '~/config/localisation/languageCodes';
import { motion } from 'framer-motion';

import Layout from '~/components/Layout2';
import { useEagerConnect, useInactiveListener } from '~/hooks';
import Moveable, { type OnResize, type OnDrag, type OnScale } from 'react-moveable';
import InfiniteViewer from 'react-infinite-viewer';
import { useAuth } from '~/hooks/useAuth';
import useBrand from '~/hooks/useBrand';
import useMarket from '~/hooks/useMarket';
import { AuthProvider } from '~/hooks/useAuth';
import { NavProvider } from '~/hooks/useNav';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import useTheme from '~/hooks/useTheme';
import useWeb3 from '~/hooks/useWeb3';
import { TourProvider } from './hooks/useTour';
import { SettingsProvider } from './hooks/useSettings';
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMaximize, FiMaximize2, FiMinimize, FiMinimize2 } from 'react-icons/fi';
import { Rnd } from 'react-rnd';
import {
  Link as RouterLink,
  matchPath,
  Navigate,
  Route,
  Routes,
  BrowserRouter,
  useNavigate,
  useLocation,
  useParams,
} from 'react-router-dom';
import { Panel } from 'react95';
import { useProfile } from '~/state/hooks';
import GlobalStyle from '~/global-styles';
import styled, { css } from 'styled-components';
import { Button, Flex, Skeleton } from '~/ui';
import Menu from '~/components/Menu/Menu';
import { useModal } from '~/components/Modal';
import PageFooter from '~/components/PageFooter';
import ToastListener from '~/components/ToastListener';
import { useEnv } from '~/hooks/useEnv';
import config from '~/config/menu';
import { trpc } from '~/utils/trpc';

import history from '~/routerHistory';

import useReferral from '~/hooks/useReferral';
import useSettings from '~/hooks/useSettings2';
import useWindows from '~/hooks/useWindows';
import './assets/styles/index.css';

// import { useFeathers } from '~/hooks/useFeathers'

// import MarketTrade from '~/views/Trade'
import i18n, { onRouteChange, updateLanguage, whitelist } from '~/config/i18n';

import NotFound from './views/404';

// const GlobalStyle = createGlobalStyle<{ useExocetFont: boolean }>
const FullPageWindow = styled.div`
  box-sizing: border-box;
  position: relative;

  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  color: ${({ theme }) => theme.colors.text};
  position: relative;

  // &:before {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  //   pointer-events: none;
  //   content: " ";
  //   // background-color: rgba(0,0,0,0.4);
  // }
  // background-color: rgba(0, 0, 0, 1);
  // background-image: radial-gradient(transparent 40%, rgba(0, 0, 0, 0.6) 80%), url(/images/background.jpeg);
  // background-size: 100%, 400px;
  // background-position: 0 64px;

  line-height: 1.8rem;
  // font-size: 1rem;
  // text-shadow: 1px 1px 1px #000;

  p,
  a {
    font-family: 'Alegreya Sans', sans-serif, monospace;
    text-transform: none;
    color: #ccc;
  }

  p > a {
    border-bottom: 1px solid #ccc;

    &:hover {
      // border-color: #fff;
      // color: #fff;
    }
  }

  &:empty {
    display: none;
  }
`;

const WindowHeader = styled.div<{ active: boolean }>`
  display: flex;
  position: relative;
  padding: 0px;
  // border-bottom: 1px solid #000;
  z-index: 2;
  background: #11111e;
  border-bottom: 1px solid #000;
  flex-direction: column;

  :hover {
    cursor: move;
  }

  ${({ active }) => (active ? 'cursor: move;' : '')}
`;

// const LinkButtonBase = (props) => {
//   const {
//     goBack,
//     to,
//     children,
//     onClick,
//     history: history2,
//     ...otherProps
//   } = props
//   const location = useLocation();
//   // if previous location is present then go back to it
//   // otherwise go to main page
//   // @ts-ignore
//   const previousLocation = location.state ? location.state.from : "/";
//   return (
//     <React95Button
//       onClick={() => {
//         onClick && onClick();
//         goBack ? history2.push(previousLocation) : history2.push(to);
//       }}
//       {...otherProps}
//     >
//       {children}
//     </React95Button>
//   );
// };
// const LinkButton = withRouter(LinkButtonBase);

// console.log('Binzy: Hi there ᕙ(^_^‶)ᕗ');
// console.log('Binzy: Welcome to my realm.');
// console.log(
//   `Binzy: No cheating. I know every cheat in the book. If you use them here, you will be met with a swift ban from the entire Arken network (including farms/tokens).`
// );
// console.log('Binzy: Enjoy your stay!');
// console.log('Binzy: ┌(▀Ĺ̯ ▀-͠ )┐');

window.onerror = function (msg, url, line, col, error) {
  // Note that col & error are new to the HTML 5 spec and may not be
  // supported in every browser.  It worked for me in Chrome.
  let extra = !col ? '' : '\ncolumn: ' + col;
  extra += !error ? '' : '\nerror: ' + error;

  // You can view the information in an alert to see things working like this:
  alert('Error: ' + msg + '\nurl: ' + url + '\nline: ' + line + extra);

  // TODO: Report this error via ajax so you can keep track
  //       of what pages have JS issues

  const suppressErrorAlert = true;
  // If you return true, then error alerts (like in older versions of
  // Internet Explorer) will be suppressed.
  return suppressErrorAlert;
};

function getZoom() {
  const stdWidth = 1200;
  const stdHeight = 1000;

  const width = window.innerWidth;
  const height = window.innerHeight;

  return Math.min(height / stdHeight, width / stdWidth);
}

function autoSize() {
  if (!window || !window.document) return;
  if (window.innerWidth >= 968) {
    const zoomFactor = getZoom();

    document.querySelector('html')!.style.setProperty('zoom', zoomFactor + '');

    if (document.querySelector('.video-react')) {
      document
        .querySelector('.video-react')
        // @ts-ignore
        .style.setProperty('zoom', 1 / zoomFactor);
    }

    const sliders = document.getElementsByClassName('slider')!;
    for (let i = 0; i < sliders.length; i++) {
      // @ts-ignore
      sliders[i].style.setProperty('zoom', 1 / zoomFactor);
    }
  } else {
    document.querySelector('html')!.style.setProperty('zoom', '1');
  }
}

// autoSize()

window.onerror = function (message, url, lineNumber) {
  console.warn(message, url, lineNumber);
  return true;
};

window.addEventListener('unhandledrejection', function (promiseRejectionEvent) {
  console.warn(promiseRejectionEvent);
});

// if (typeof process !== 'undefined') {
//   process.on('unhandledRejection', (error) => {});
// }

function FallbackComponent() {
  return <div style={{ color: '#fff' }}>An error has occurred. Please report in t.me/Arken_Reports</div>;
}

const myFallback = <FallbackComponent />;

const baseRouteUrl = `/:locale(${whitelist.join('|')})?`;
export const baseUrl = i18n.language === 'en' ? '' : '/' + i18n.language;

const PageWrapper = styled.div`
  position: relative;
  height: 100%;
  height: calc(100vh - var(--safe-area-inset-bottom));

  // filter: url("#goo");
`;

const BigCard = styled.div`
  color: ${({ theme }) => theme.colors.text};
  position: relative;

  border-width: 15px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 80 repeat;
  border-image-width: 80px;
  background-color: rgba(0, 0, 0, 0.4);
  background-image: url(/images/background.jpeg);
  background-size: 400px;
  box-shadow:
    0 2px 0 0 rgb(0 0 0 / 80%),
    inset 0 -1px 0 0 rgb(0 0 0 / 10%),
    0 0 66px 66px rgb(0 0 0 / 10%);
  // background-color: rgba(0,0,0,0.4);
  line-height: 1.8rem;
  // font-size: 1rem;
  text-shadow: 1px 1px 1px #000;
  p,
  a {
    font-family: 'Alegreya Sans', sans-serif, monospace;
    text-transform: none;
    color: #ccc;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    border-width: 40px 40px;
  }
`;

const TopBanner = styled.div`
  height: 60px;
  text-align: center;
  color: #fff;
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 20px;
  border-bottom: 2px solid #99d6d8;
  font-weight: bold;
  font-size: 12px;
  line-height: 12px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 22px;
    line-height: 22px;
  }
`;

const TopBannerBg = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
  background: #3cc2d4 url(/images/evolution-map.png) no-repeat 50% 140%;
  background-size: cover;
  height: 766px;
  image-rendering: pixelated;

  body.good-quality & {
    animation-name: MOVE-BG;
    animation-duration: 30s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  @keyframes MOVE-BG {
    0% {
      transform: translateY(0%);
    }
    50% {
      transform: translateY(-65%);
    }
    100% {
      transform: translateY(0%);
    }
  }
`;

const TopBanner2 = styled.div`
  height: 60px;
  text-align: center;
  color: #fff;
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 20px;
  text-shadow: 2px 2px 2px #000;
  font-size: 12px;
  line-height: 12px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 22px;
    line-height: 22px;
  }
`;
const TopBannerBg2 = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
  background: #84111b url(/images/banners/rxs-released.png) no-repeat 50% 140%;
  background-size: cover;
  height: 766px;

  body.good-quality & {
    animation-name: MOVE-BG;
    animation-duration: 30s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  @keyframes MOVE-BG {
    0% {
      transform: translateY(0%);
    }
    50% {
      transform: translateY(-65%);
    }
    100% {
      transform: translateY(0%);
    }
  }
`;

const TopBanner3 = styled.div`
  height: 60px;
  text-align: center;
  color: #fff;
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 20px;
  border-bottom: 2px solid #2d3f54;
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;

  filter: drop-shadow(rgba(0, 0, 0, 0.6) 1px 1px 1px) drop-shadow(rgba(0, 0, 0, 0.6) 0px 0px 4px);
  box-shadow:
    0 2px 0 0 rgb(0 0 0 / 80%),
    inset 0 -1px 0 0 rgb(0 0 0 / 10%),
    0 0 66px 66px rgb(0 0 0 / 10%);

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 24px;
    line-height: 24px;
  }
`;

const TopBannerBg3 = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
  background: #2d3f54 url(/images/evolution-map-new.png) no-repeat 50% 0%;
  background-size: cover;
  height: 766px;
  image-rendering: pixelated;

  body.good-quality & {
    animation-name: MOVE-BG;
    animation-duration: 30s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  @keyframes MOVE-BG {
    0% {
      transform: translateY(0%);
    }
    50% {
      transform: translateY(-90%);
    }
    100% {
      transform: translateY(0%);
    }
  }
`;

const SWindowContent = styled.div<{ theme: any }>`
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  position: relative;
  // height: 100%;
  // padding-top: 4px;
  // padding-bottom: 37px;
  // padding-left: 0.25rem;
  // padding-right: 0.25rem;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 1;
  padding: 0;

  @media ${({ theme }) => theme.MEDIA_TABLET_OR_MORE} {
    // min-width: 500px;
    // min-height: 700px;
  }
`;

const AppToolbar = styled.div<{ showMenu: boolean; theme: any }>`
  position: relative;
  z-index: 3;
  padding: 0px 5px 0px 20px;
  width: 100%;
  line-height: 40px;
  // margin-top: 50px;
  display: none;
  height: 40px;

  span {
    padding-top: 3px;
    display: inline-block;
  }

  button {
    display: inline-flex;
    align-items: center;
    color: #fff;
  }

  overflow: hidden;

  ${({ theme }) => theme.mediaQueries.md} {
    display: ${({ showMenu }) => (showMenu ? 'block' : 'none')};
  }
`;
const CloseIcon = styled.div`
  image-rendering: pixelated;
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-left: -1px;
  margin-top: -1px;
  transform: rotateZ(45deg);
  position: relative;
  :before,
  :after {
    content: '';
    position: absolute;
  }
  :before {
    height: 100%;
    width: 3px;
    left: 50%;
    transform: translateX(-50%);
  }
  :after {
    height: 3px;
    width: 100%;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const SiteNav = ({ id }) => {
  const auth = useAuth();

  return (
    <div className="sitenav lore-container app__sitenav" css={css``}>
      {id === 'items' ? (
        <div id="menu-items" className="sitenav-sub">
          <div>
            <div className="w-layout-grid grid-4">
              <div className="subnav-list first">
                <div className="text-block-3">PRIMARY&nbsp;Types</div>
                <div className="w-layout-grid grid-subnav-list">
                  <a
                    data-load-page="/runeforms"
                    id="w-node-_3516db66-66a0-079a-08d5-2070d10b7433-1186d119"
                    href="/runeforms"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/runeforms');
                    }}>
                    <div className="icon" />
                    <div>Runewords</div>
                  </a>
                  <a
                    data-load-page="/item-types"
                    id="w-node-_3516db66-66a0-079a-08d5-2070d10b7437-1186d119"
                    href="/item-types"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/item-types');
                    }}>
                    <div className="icon" />
                    <div>Pets</div>
                  </a>
                  <a
                    data-load-page="/item-types"
                    id="w-node-_3516db66-66a0-079a-08d5-2070d10b743b-1186d119"
                    href="/item-types"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/item-types');
                    }}>
                    <div className="icon" />
                    <div>Trinkets</div>
                  </a>
                  <a
                    data-load-page="/item-types"
                    id="w-node-_1d44a78a-f3ca-5fe7-445c-30df9bea5df3-1186d119"
                    href="/item-types"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/item-types');
                    }}>
                    <div className="icon" />
                    <div>Jewelry</div>
                  </a>
                </div>
                <div className="subnavcolshadow" />
              </div>
              <div className="subnav-list">
                <div className="text-block-3">Primary Types</div>
                <div className="w-layout-grid grid-subnav-list">
                  <a
                    data-load-page="/items"
                    id="w-node-_3516db66-66a0-079a-08d5-2070d10b7444-1186d119"
                    href="/items"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/items');
                    }}>
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">Crafted Items</div>
                    </div>
                  </a>
                  <a
                    data-load-page="/items"
                    id="w-node-_3516db66-66a0-079a-08d5-2070d10b744b-1186d119"
                    href="/items"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/items');
                    }}>
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">Rewarded Items</div>
                    </div>
                  </a>
                  <a
                    data-load-page="/items"
                    id="w-node-_3516db66-66a0-079a-08d5-2070d10b7459-1186d119"
                    href="/items"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/items');
                    }}>
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">Airdropped Items</div>
                    </div>
                  </a>
                  <a
                    data-load-page="/items"
                    id="w-node-_3516db66-66a0-079a-08d5-2070d10b7460-1186d119"
                    href="/items"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/items');
                    }}>
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">Fundraiser Items</div>
                    </div>
                  </a>
                </div>
                <div className="subnavcolshadow" />
              </div>
              <div id="w-node-_3516db66-66a0-079a-08d5-2070d10b7468-1186d119" className="subnav-list">
                <div className="text-block-3">Popular Items</div>
                <div className="w-layout-grid grid-subnav-list twocols">
                  <a
                    data-load-page="/games/oasis/item/wrath"
                    id="w-node-_3516db66-66a0-079a-08d5-2070d10b746c-1186d119"
                    href="/games/oasis/item/wrath"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/item/wrath');
                    }}>
                    <div className="icon" />
                    <div>Wrath</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/item/instinct"
                    id="w-node-_3516db66-66a0-079a-08d5-2070d10b7470-1186d119"
                    href="/games/oasis/item/instinct"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/item/instinct');
                    }}>
                    <div className="icon" />
                    <div>Instinct</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/item/smoke"
                    id="w-node-_3516db66-66a0-079a-08d5-2070d10b7474-1186d119"
                    href="/games/oasis/item/smoke"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/item/smoke');
                    }}>
                    <div className="icon" />
                    <div>Smoke</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/item/flow"
                    id="w-node-_3516db66-66a0-079a-08d5-2070d10b7478-1186d119"
                    href="/games/oasis/item/flow"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/item/flow');
                    }}>
                    <div className="icon" />
                    <div>Flow</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/item/dragonlight"
                    id="w-node-_3516db66-66a0-079a-08d5-2070d10b747c-1186d119"
                    href="/games/oasis/item/dragonlight"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/item/dragonlight');
                    }}>
                    <div className="icon" />
                    <div>Dragonlight</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/item/titan"
                    id="w-node-_3516db66-66a0-079a-08d5-2070d10b7480-1186d119"
                    href="/games/oasis/item/titan"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/item/titan');
                    }}>
                    <div className="icon" />
                    <div>Titan</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/item/flash"
                    id="w-node-_3516db66-66a0-079a-08d5-2070d10b7484-1186d119"
                    href="/games/oasis/item/flash"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/item/flash');
                    }}>
                    <div className="icon" />
                    <div>Flash</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/item/grace"
                    id="w-node-_3516db66-66a0-079a-08d5-2070d10b748c-1186d119"
                    href="/games/oasis/item/grace"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/item/grace');
                    }}>
                    <div className="icon" />
                    <div>Grace</div>
                  </a>
                </div>
                <div className="subnavcolshadow" />
              </div>
            </div>
          </div>
          <div className="div-block-23" />
        </div>
      ) : null}
      {id === 'sanctuary-getting-started' ? (
        <div id="menu-intro" className="sitenav-sub">
          <div>
            <div className="w-layout-grid grid-4">
              <div className="subnav-list first">
                <div className="text-block-3">NEW?</div>
                <div className="w-layout-grid grid-subnav-list">
                  <a
                    data-load-page="/games/oasis"
                    id="w-node-_904a9d28-258f-5392-b05b-501c2ac91af8-1186d119"
                    href="/games/oasis"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>Introduction</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/lore"
                    id="w-node-_57489108-b964-155a-220b-22824d4f10d3-1186d119"
                    href="/games/oasis/lore"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>Lore</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/guides"
                    id="w-node-_8b6265b8-9773-ee57-d44f-7a7f695a5fab-1186d119"
                    href="/games/oasis/guides"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>Guides</div>
                  </a>
                </div>
                <div className="subnavcolshadow" />
              </div>
              <div className="subnav-list">
                <div className="text-block-3">GAMES</div>
                <div className="w-layout-grid grid-subnav-list">
                  {/* <a
                    data-load-page="/raid"
                    id="w-node-_6e51a4f0-1355-a7fe-5f82-acad18b13394-1186d119"
                    href="/games/raids"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">Runic Raids</div>
                      <div className="text-block-4">Hyperfarm {auth?.isCryptoMode ? '(NFTs)' : ''}</div>
                    </div>
                  </a> */}
                  <a
                    data-load-page="/games/evolution"
                    id="w-node-_56aace6e-5b81-8524-2dd0-06eb44f98501-1186d119"
                    href="/games/evolution"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">Evolution Isles</div>
                      <div className="text-block-4">
                        Casual Arcade Game {auth?.isCryptoMode ? '(Play 4 Rewards)' : ''}
                      </div>
                    </div>
                  </a>
                  <a
                    data-load-page="/infinite"
                    id="w-node-_16f54588-832f-0790-bccc-e07a3e82b8f2-1186d119"
                    href="/games/infinite"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">Infinite Arena</div>
                      <div className="text-block-4">Battle Arena (E-Sports style)</div>
                    </div>
                  </a>
                  {/* <a
                    data-load-page="/guardians"
                    id="w-node-e2c58bf5-9541-8730-9039-86388f955177-1186d119"
                    href="/games/guardians"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">Guardians Unleashed</div>
                      <div className="text-block-4">Casual Pet world {auth?.isCryptoMode ? '(NFT-powered)' : ''}</div>
                    </div>
                  </a> */}
                  <a
                    data-load-page=""
                    id="w-node-b2fe26cf-713f-4251-42cd-b9ef47e006ff-1186d119"
                    href="/games/oasis"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">Heart of the Oasis</div>
                      <div className="text-block-4">Dark Fantasy ARPG</div>
                    </div>
                  </a>
                </div>
                <div className="subnavcolshadow" />
              </div>
              <div id="w-node-_32af612e-56d2-f32f-1647-b17483dc6e7b-1186d119" className="subnav-list">
                <div className="text-block-3">⠀</div>
                <div className="w-layout-grid grid-subnav-list twocols">
                  <a
                    data-load-page="/games/oasis/classes"
                    id="w-node-_32af612e-56d2-f32f-1647-b17483dc6e7f-1186d119"
                    href="/games/oasis/classes"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/classes');
                    }}>
                    <div className="icon" />
                    <div>Classes</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/races"
                    id="w-node-_3b21ae9a-55f7-7cba-41e9-847d9ce8aa0a-1186d119"
                    href="/games/oasis/races"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/races');
                    }}>
                    <div className="icon" />
                    <div>Races</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/skills"
                    id="w-node-_08fa9b25-0de5-d310-12ae-878d58359ca6-1186d119"
                    href="/games/oasis/skills"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/skills');
                    }}>
                    <div className="icon" />
                    <div>Skills</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/areas"
                    id="w-node-_2629ee21-7661-5350-357c-d6459940d276-1186d119"
                    href="/games/oasis/areas"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/areas');
                    }}>
                    <div className="icon" />
                    <div>Areas</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/runeforms"
                    id="w-node-c16538f4-fa64-7ea2-171e-d88e5b99a3eb-1186d119"
                    href="/games/oasis/runeforms"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/runeforms');
                    }}>
                    <div className="icon" />
                    <div>Runewords</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/mechanics"
                    id="w-node-_61340ed2-41c9-a146-8011-a8857d6fc016-1186d119"
                    href="/games/oasis/mechanics"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/mechanics');
                    }}>
                    <div className="icon" />
                    <div>Mechanics</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/item-attributes"
                    id="w-node-_1d1f7e81-8273-dc5d-e1eb-b0cb63e72a39-1186d119"
                    href="/games/oasis/item-attributes"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/attributes');
                    }}>
                    <div className="icon" />
                    <div>Attributes</div>
                  </a>
                </div>
                <div className="subnavcolshadow" />
              </div>
            </div>
          </div>
          <div className="div-block-23" />
        </div>
      ) : null}
      {id === 'docs' ? (
        <div id="menu-docs" className="sitenav-sub">
          <div>
            <div className="w-layout-grid grid-4">
              <div className="subnav-list first">
                <div className="text-block-3">ECOSYSTEM</div>
                <div className="w-layout-grid grid-subnav-list">
                  <a
                    data-load-page="/games/oasis/runes"
                    id="w-node-_3880f8bd-4ecf-8be2-3c2c-61b9eb4cdedd-1186d119"
                    href="/games/oasis/runes"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>Runes</div>
                  </a>
                  <a
                    data-load-page="/about/smart-contracts"
                    id="w-node-_3880f8bd-4ecf-8be2-3c2c-61b9eb4cdee1-1186d119"
                    href="/about/smart-contracts"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>Smart Contracts</div>
                  </a>
                </div>
                <div className="subnavcolshadow" />
              </div>
              <div className="subnav-list">
                <div className="text-block-3">RESOURCES</div>
                <div className="w-layout-grid grid-subnav-list">
                  <a
                    data-load-page="/about/faq"
                    id="w-node-_3880f8bd-4ecf-8be2-3c2c-61b9eb4cdeea-1186d119"
                    href="/about/faq"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">FAQ</div>
                    </div>
                  </a>
                  <a
                    data-load-page="/affiliate-program"
                    id="w-node-_3880f8bd-4ecf-8be2-3c2c-61b9eb4cdef1-1186d119"
                    href="/affiliate-program"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">Affiliate Program</div>
                    </div>
                  </a>
                  <a
                    data-load-page="/about/useful-links"
                    id="w-node-_3880f8bd-4ecf-8be2-3c2c-61b9eb4cdef8-1186d119"
                    href="/about/useful-links"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">Useful Links</div>
                    </div>
                  </a>
                  <a
                    data-load-page="/about/polls"
                    id="w-node-_3880f8bd-4ecf-8be2-3c2c-61b9eb4cdeff-1186d119"
                    href="/about/polls"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">Polls</div>
                    </div>
                  </a>
                  <a
                    data-load-page="/about/source"
                    id="w-node-_3880f8bd-4ecf-8be2-3c2c-61b9eb4cdf06-1186d119"
                    href="/about/source"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">Source Code</div>
                    </div>
                  </a>
                </div>
                <div className="subnavcolshadow" />
              </div>
              <div className="subnav-list">
                <div className="text-block-3">DEX&nbsp;Guide</div>
                <div className="w-layout-grid grid-subnav-list">
                  <a
                    data-load-page="/how-to-use-runeswap"
                    id="w-node-_2af1d11b-9582-6ff0-61ae-f19a65392325-1/how-to86d119"
                    href="/guide/how-to-use-runeswap"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">How to Use Arken Swap</div>
                    </div>
                  </a>
                  <a
                    data-load-page="/how-to-add-bsc-to-metamask"
                    id="w-node-_2af1d11b-9582-6ff0-6/how-toae-f19a6539232a-1186d119"
                    href="/guide/how-to-add-bsc-to-metamask"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">How to Add BSC&nbsp;To Metamask</div>
                    </div>
                  </a>
                  <a
                    data-load-page="/yield-farming"
                    id="w-node-_2af1d11b-9582-6ff0-61ae-f19a6539232f-1186d119"
                    href="/guide/yield-farming"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">Yield Farming</div>
                    </div>
                  </a>
                  <a
                    data-load-page="/impermanent-loss"
                    id="w-node-_2af1d11b-9582-6ff0-61ae-f19a65392334-1186d119"
                    href="/guide/impermanent-loss"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">Impermanent Loss</div>
                    </div>
                  </a>
                </div>
                <div className="subnavcolshadow" />
              </div>
              <div className="subnav-list">
                <div className="text-block-3">⠀</div>
                <div className="subnavcolshadow" />
              </div>
            </div>
          </div>
          <div className="div-block-23" />
        </div>
      ) : null}
      {id === 'sanctuary-lore' ? (
        <div id="menu-lore" className="sitenav-sub">
          <div>
            <div className="w-layout-grid grid-4">
              <div className="subnav-list first">
                <div className="text-block-3">Primary NPCs</div>
                <div className="w-layout-grid grid-subnav-list">
                  <a
                    data-load-page="/games/oasis/npcs/zeno"
                    id="w-node-_6dae65cb-1c7c-423e-b30f-70c35f7ac0b5-1186d119"
                    href="/games/oasis/npcs/zeno"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/npcs/zeno');
                    }}>
                    <div className="icon" />
                    <div>Zeno</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/npcs/azorag"
                    id="w-node-_6dae65cb-1c7c-423e-b30f-70c35f7ac0b9-1186d119"
                    href="/games/oasis/npcs/azorag"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/npcs/azotag');
                    }}>
                    <div className="icon" />
                    <div>Azorag</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/npcs/eledon"
                    id="w-node-_6dae65cb-1c7c-423e-b30f-70c35f7ac0bd-1186d119"
                    href="/games/oasis/npcs/eledon"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/npcs/eledon');
                    }}>
                    <div className="icon" />
                    <div>Eledon</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/npcs/logos"
                    id="w-node-_5cd2fa3d-2b22-4c46-8866-6157c5070de4-1186d119"
                    href="/games/oasis/npcs/logos"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/npcs/logos');
                    }}>
                    <div className="icon" />
                    <div>Logos</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/npcs/delaran"
                    id="w-node-be8330cc-f2ff-d197-dcc9-b6995e710e61-1186d119"
                    href="/games/oasis/npcs/delaran"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/npcs/delaran');
                    }}>
                    <div className="icon" />
                    <div>Delaran</div>
                  </a>
                </div>
                <div className="subnavcolshadow" />
              </div>
              <div className="subnav-list">
                <div className="text-block-3">Primary ZONES</div>
                <div className="w-layout-grid grid-subnav-list">
                  <a
                    data-load-page="/games/oasis/areas/elysium"
                    id="w-node-_6dae65cb-1c7c-423e-b30f-70c35f7ac0c6-1186d119"
                    href="/games/oasis/areas/elysium"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/areas/elysium');
                    }}>
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">Elysium</div>
                    </div>
                  </a>
                  <a
                    data-load-page="/games/oasis/areas/irondell"
                    id="w-node-_6dae65cb-1c7c-423e-b30f-70c35f7ac0cd-1186d119"
                    href="/games/oasis/areas/irondell"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/areas/irondell');
                    }}>
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">Irondell</div>
                    </div>
                  </a>
                  <a
                    data-load-page="/games/oasis/areas/qiddir"
                    id="w-node-_6dae65cb-1c7c-423e-b30f-70c35f7ac0d4-1186d119"
                    href="/games/oasis/areas/qiddir"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/areas/qiddir');
                    }}>
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">Qiddir</div>
                    </div>
                  </a>
                  <a
                    data-load-page="/games/oasis/areas/arreat-summit"
                    id="w-node-_6dae65cb-1c7c-423e-b30f-70c35f7ac0db-1186d119"
                    href="/games/oasis/areas/arreat-summit"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/areas/arreat-summit');
                    }}>
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">Arreat Summit</div>
                    </div>
                  </a>
                  <a
                    data-load-page="/games/oasis/areas/end-of-time"
                    id="w-node-_6dae65cb-1c7c-423e-b30f-70c35f7ac0e2-1"
                    href="/games/oasis/areas/end-of-time"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/areas/end-of-time');
                    }}>
                    <div className="icon" />
                    <div>
                      <div className="text-block-5">End Of Time</div>
                    </div>
                  </a>
                </div>
                <div className="subnavcolshadow" />
              </div>
              <div id="w-node-_6dae65cb-1c7c-423e-b30f-70c35f7ac0ea-1186d119" className="subnav-list">
                <div className="text-block-3">⠀</div>
                <div className="w-layout-grid grid-subnav-list twocols">
                  <a
                    data-load-page="/eras"
                    id="w-node-_6dae65cb-1c7c-423e-b30f-70c35f7ac0f2-1186d119"
                    href="/games/oasis/eras"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/eras');
                    }}>
                    <div className="icon" />
                    <div>Eras</div>
                  </a>
                  <a
                    data-load-page="/races"
                    id="w-node-_6dae65cb-1c7c-423e-b30f-70c35f7ac0f6-1186d119"
                    href="/games/oasis/races"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/races');
                    }}>
                    <div className="icon" />
                    <div>Races</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/acts"
                    id="w-node-_6dae65cb-1c7c-423e-b30f-70c35f7ac0fa-1186d119"
                    href="/games/oasis/acts"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/acts');
                    }}>
                    <div className="icon" />
                    <div>Acts</div>
                  </a>
                  <a
                    data-load-page="/factions"
                    id="w-node-_6dae65cb-1c7c-423e-b30f-70c35f7ac0fe-1186d119"
                    href="/games/oasis/factions"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/factions');
                    }}>
                    <div className="icon" />
                    <div>Factions</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/areas"
                    id="w-node-_6dae65cb-1c7c-423e-b30f-70c35f7ac106-1186d119"
                    href="/games/oasis/areas"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/areas');
                    }}>
                    <div className="icon" />
                    <div>Areas</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/energies"
                    id="w-node-_6dae65cb-1c7c-423e-b30f-70c35f7ac10a-1186d119"
                    href="/games/oasis/energies"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/energies');
                    }}>
                    <div className="icon" />
                    <div>Energies</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/bosses"
                    id="w-node-_6dae65cb-1c7c-423e-b30f-70c35f7ac10e-1186d119"
                    href="/games/oasis/bosses"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/bosses');
                    }}>
                    <div className="icon" />
                    <div>Bosses</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/npcs"
                    id="w-node-_68e4aae3-6703-3c62-0536-6a5fec49528d-1186d119"
                    href="/games/oasis/npcs"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/npcs');
                    }}>
                    <div className="icon" />
                    <div>NPCs</div>
                  </a>
                  <a
                    data-load-page="/games/oasis/monsters"
                    id="w-node-_6dae65cb-1c7c-423e-b30f-70c35f7ac112-1186d119"
                    href="/games/oasis/monsters"
                    className="subnavlink w-inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      history.push('/games/oasis/monsters');
                    }}>
                    <div className="icon" />
                    <div>Monsters</div>
                  </a>
                </div>
                <div className="subnavcolshadow" />
              </div>
            </div>
          </div>
          <div className="div-block-23" />
        </div>
      ) : null}
      {id === 'social' ? (
        <div id="menu-more" className="sitenav-sub">
          <div>
            <div className="w-layout-grid grid-4">
              <div className="subnav-list first">
                <div className="text-block-3">Socials</div>
                <div className="w-layout-grid grid-subnav-list twocols">
                  <a
                    id="w-node-a2225d83-8a45-b781-a79e-a8b045efde29-1186d119"
                    href="https://discord.arken.gg/"
                    target="_blank"
                    rel="noreferrer"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>Discord</div>
                  </a>
                  <a
                    id="w-node-_72d3b942-4be6-9e12-7c52-5a22e3d5aebd-1186d119"
                    href="https://telegram.arken.gg"
                    target="_blank"
                    rel="noreferrer"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>Telegram</div>
                  </a>
                  <a
                    id="w-node-c7945639-64b1-6bce-4e66-c692eae2c1f8-1186d119"
                    href="https://twitter.arken.gg"
                    target="_blank"
                    rel="noreferrer"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>Twitter</div>
                  </a>
                  {/* <a
                    id="w-node-_49d6ec76-61aa-ffb2-59dc-64c14234c347-1186d119"
                    href="https://facebook.com/ArkenRealms"
                    target="_blank"
                    rel="noreferrer"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>Facebook</div>
                  </a> */}
                  {/* <a
                    id="w-node-_8841d407-ece8-48ad-8af8-9290166c0132-1186d119"
                    href="https://arkenrealms.medium.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>Medium</div>
                  </a> */}
                  <a
                    id="w-node-_04966c78-8932-1c1e-fab2-552bee552675-1186d119"
                    href="https://youtube.arken.gg"
                    target="_blank"
                    rel="noreferrer"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>YouTube</div>
                  </a>
                  <a
                    id="w-node-_8374083c-5a6a-eb38-a7f0-bd016b05a62b-1186d119"
                    href="https://twitch.arken.gg"
                    target="_blank"
                    rel="noreferrer"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>Twitch</div>
                  </a>
                  <a
                    id="w-node-_28c8cafc-0b52-4949-7657-6eaf9f785b2b-1186d119"
                    href="https://www.reddit.com/r/ArkenRealms"
                    target="_blank"
                    rel="noreferrer"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>Reddit</div>
                  </a>
                  <a
                    id="w-node-cc0d921f-e677-a5a8-186f-7a427f931279-1186d119"
                    href="https://www.linkedin.com/company/rune-games/people/?viewAsMember=true"
                    target="_blank"
                    rel="noreferrer"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>LinkedIn</div>
                  </a>
                  <a
                    id="w-node-_36c94766-8dfb-7fbb-0509-9c2ac1f45dd8-1186d119"
                    href="https://github.arken.gg"
                    target="_blank"
                    rel="noreferrer"
                    className="subnavlink w-inline-block">
                    <div className="icon" />
                    <div>Github</div>
                  </a>
                </div>
                <div className="subnavcolshadow" />
              </div>
              <div className="subnav-list">
                <div className="text-block-3">⠀</div>
                <div className="subnavcolshadow" />
              </div>
              <div id="w-node-_49258651-3947-9530-d22e-936bcc790c50-1186d119" className="subnav-list">
                <div className="text-block-3">⠀</div>
                <div className="subnavcolshadow" />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const ToolbarBanner = ({ path, id, to, children }) => {
  const cacheKey = `ToolbarBanner-${id}`;

  const [isClosed, _setIsClosed] = useState(() => {
    if (!window.localStorage) return false;

    return window.localStorage.getItem(cacheKey) === 'closed';
  });

  const setIsClosed = (val) => {
    _setIsClosed(val);
    window.localStorage.setItem(cacheKey, 'closed');
  };

  useEffect(() => {
    if (!window) return;

    setTimeout(() => {
      setIsClosed(true);
    }, 30 * 1000);
  }, []);

  if (isClosed) return null;
  if (!['/', '/games'].includes(path)) return null;

  return (
    <RouterLink to={to} onClick={() => setIsClosed(true)}>
      {children}
    </RouterLink>
  );
};

const ToolbarNotification = () => {
  const [faded, setFaded] = useState(true);
  const messageId = useRef(-1);

  const messages = [
    {
      text: 'Play Evolution Isles Season Ladder',
      to: '/evolution',
    },
    // {
    //   text: 'Check out the new leaderboard',
    //   to: '/leaderboard',
    // },
    // {
    //   text: 'Craft a new runeform',
    //   to: '/craft',
    // },
    {
      text: 'Catch up on the lore',
      to: '/lore',
    },
    // {
    //   text: 'Check out the tokenomics',
    //   to: '/tokenomics',
    // },
    {
      text: 'Do the latest quests',
      to: '/account/quests',
    },
  ];

  useEffect(() => {
    let timeout;

    const setRandomMessage = () => {
      messageId.current = messageId.current === messages.length - 1 ? 0 : messageId.current + 1;
      setFaded(false);

      timeout = setTimeout(function () {
        setFaded(true);
        timeout = setTimeout(setRandomMessage, 3 * 1000);
      }, 10 * 1000);
    };

    timeout = setTimeout(setRandomMessage, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const variants = {
    unfaded: { opacity: 1 },
    faded: { opacity: 0 },
  };

  return (
    <div
      css={css`
        display: none;
        @media (min-width: 1280px) {
          display: block;
        }
      `}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={faded ? 'faded' : 'unfaded'}
        variants={variants}
        transition={{ duration: 2 }}>
        {messageId.current >= 0 ? (
          <Button
            scale="sm"
            variant="text"
            onClick={() => history.push(messages[messageId.current].to)}
            style={{ color: '#ddd' }}>
            {messages[messageId.current].text}
          </Button>
        ) : null}
      </motion.div>
    </div>
  );
};

const SWindowFooter = styled(Panel)`
  display: block;
  margin: 0.25rem;
  height: 31px;
  line-height: 31px;
  padding-left: 0.25rem;
`;
const DraggableWindow: React.FC<any> = React.memo(
  ({
    path,
    title,
    routePath,
    match,
    brand,
    windowPosition,
    windowSize,
    data,
    active,
    toolbarNav,
    routeIndex,
    onDragStart,
    minimized,
    onDragStop,
    onClose,
    onFocus,
    onMinimize,
    open,
    persist,
    children,
    footer,
    onPresentPurchaseModal,
    onPresentSwapModal,
    settings,
  }) => {
    // const [activeTab, setActiveTab] = useState(0);
    // const [saveOpen, setSaveOpen] = useState(false);
    // const handleChange = (e, value) => setActiveTab(value);
    const pageElement = useRef(null);
    const [subnav, _setSubnav] = useState(null);
    const rnd = useRef(null);
    const [zIndex, setZIndex] = useState(routeIndex);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(windowSize.width === '100%' && windowSize.height === '100%');

    const setSubnav = function (_subnav) {
      if (_subnav === subnav) _setSubnav(null);
      else _setSubnav(_subnav);
    };

    const goUnmaximized = function (_rnd) {
      if (!_rnd) return;

      _rnd.current.updateSize({ width: 700, height: 700 });
      _rnd.current.updatePosition({ x: 300, y: 300 });

      window.localStorage.setItem(`WindowPath-${routePath}`, match?.pathname);
      window.localStorage.setItem(`WindowPosition-${routePath}`, JSON.stringify({ x: 300, y: 300 }));
      window.localStorage.setItem(`WindowSize-${routePath}`, JSON.stringify({ width: 700, height: 700 }));
      window.localStorage.setItem(`WindowStatus-${routePath}`, 'opened');

      setIsMaximized(false);
    };

    const goMaximized = function (_rnd) {
      if (!_rnd) return;

      _rnd.current.updatePosition({ x: 0, y: 0 });
      _rnd.current.updateSize({ width: '100%', height: '100%' });

      window.localStorage.removeItem(`WindowPath-${routePath}`);
      window.localStorage.removeItem(`WindowStatus-${routePath}`);
      window.localStorage.removeItem(`WindowPosition-${routePath}`);
      window.localStorage.removeItem(`WindowSize-${routePath}`);

      setIsMaximized(true);
    };

    const goFullscreen = (_pageElement) => {
      //  if (!window.screenTop && !window.screenY) goFullscreen

      if (!_pageElement) return;
      // const ActivateFullscreen = function()
      // {
      if (_pageElement.requestFullscreen) {
        /* API spec */
        _pageElement.requestFullscreen();
      }
      // @ts-ignore
      else if (_pageElement.mozRequestFullScreen) {
        /* Firefox */
        // @ts-ignore
        _pageElement.mozRequestFullScreen();
      }
      // @ts-ignore
      else if (_pageElement.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        // @ts-ignore
        _pageElement.webkitRequestFullscreen();
      }
      // @ts-ignore
      else if (_pageElement.msRequestFullscreen) {
        /* IE/Edge */
        // @ts-ignore
        _pageElement.msRequestFullscreen();
      }

      setIsFullscreen(true);
      //     _pageElement.removeEventListener('touchend', ActivateFullscreen);
      // }

      // _pageElement.addEventListener('touchend', ActivateFullscreen, false);
    };

    const exitFullscreen = () => {
      document.exitFullscreen();
      setIsFullscreen(false);
    };

    // if (!active && !persist) return <></>
    // if (!routePath) return <></>

    console.log('Render page:', title);

    // @ts-ignore
    return (
      <>
        {/* @ts-ignore */}
        <Rnd
          ref={rnd}
          default={{
            x: windowPosition.x < 0 ? 0 : windowPosition.x,
            y: windowPosition.y < 0 ? 0 : windowPosition.y,
            width: windowSize.width,
            height: windowSize.height,
          }}
          dragHandleClassName="handle"
          resizeGrid={[50, 50]}
          dragGrid={[50, 50]}
          disableDragging={isMaximized}
          enableResizing={!isMaximized}
          onDragStart={() => {
            onFocus(function (index) {
              setZIndex(index);
            });
          }}
          onDrag={(e, d) => {
            // this.setState({ x: d.x, y: d.y });
            window.localStorage.setItem(`WindowPath-${routePath}`, match?.pathname);
            window.localStorage.setItem(`WindowStatus-${routePath}`, 'opened');
            window.localStorage.setItem(`WindowPosition-${routePath}`, JSON.stringify({ x: d.x, y: d.y }));
          }}
          onResizeStart={() => {
            onFocus(function (index) {
              setZIndex(index);
            });
          }}
          onResize={(e, direction, ref, delta, _position) => {
            // debugger
            window.localStorage.setItem(`WindowPath-${routePath}`, match?.pathname);
            window.localStorage.setItem(`WindowStatus-${routePath}`, 'opened');
            window.localStorage.setItem(
              `WindowPosition-${routePath}`,
              JSON.stringify({ x: _position.x, y: _position.y })
            );
            window.localStorage.setItem(
              `WindowSize-${routePath}`,
              JSON.stringify({ width: ref.offsetWidth, height: ref.offsetHeight })
            );

            rnd.current.updateSize({ width: ref.offsetWidth, height: ref.offsetHeight });
            // this.setState({
            //   width: ref.style.width,
            //   height: ref.style.height,
            //   ...position
            // });
          }}
          bounds="parent"
          minWidth="360px"
          minHeight="500px"
          key={match?.pathname || routePath}
          style={{ zIndex }}>
          <FullPageWindow ref={pageElement} className="app__fullpage-window">
            <WindowHeader active={active} className="app__fullpage-window__header handle">
              <SiteNav id={subnav} />
              <AppToolbar key="app-toolbar" showMenu className="app__toolbar">
                <Flex
                  alignItems={['start', null, 'center']}
                  justifyContent={['start', null, 'space-between']}
                  flexDirection={['column', null, 'row']}
                  style={{ maxHeight: 43 }}>
                  <Flex
                    justifyContent="start"
                    alignItems="center"
                    css={css`
                      button {
                        border-bottom: 2px solid transparent;

                        &.active,
                        &:hover {
                          border-bottom: 2px solid #fff;
                          border-radius: 0;
                          color: #fff;
                        }
                      }
                    `}>
                    {toolbarNav ? toolbarNav(subnav, setSubnav) : title && brand === 'w4' ? title : null}
                    {/* (
                    <Button scale="sm" variant="text" onClick={() => {}}>
                      {title}
                    </Button>
                  ) */}
                    {/* {isMobile ? (
                  <Button scale="sm" onClick={() => setShowMenu(!showMenu)} style={{ zoom: 0.8, marginLeft: 10 }}>
                    {showMenu ? 'Hide' : 'Show'} Menu
                  </Button>
                ) : (
                  <Button
                    scale="sm"
                    onClick={() => {
                      pauseGame()
                      onPresentTutorialModal()
                    }}
                    style={{ zoom: 0.8, marginLeft: 10 }}
                  >
                    Tutorial 
                  </Button>
                )} */}
                  </Flex>
                  <Flex justifyContent="space-between" alignItems="center">
                    {isMaximized ? <ToolbarNotification /> : null}
                    {/* {isMaximized && settings?.isCrypto ? (
                      <div css={{ marginTop: -8 }}>
                        <Button
                          scale="sm"
                          onClick={onPresentPurchaseModal}
                          style={{ zoom: 0.7, marginLeft: 10, marginRight: 10, fontFamily: 'arial, sans-serif' }}>
                          Buy $RXS
                        </Button>
                        <Button
                          scale="sm"
                          onClick={() => history.push('/swap')}
                          style={{ zoom: 0.7, marginLeft: 10, marginRight: 10, fontFamily: 'arial, sans-serif' }}>
                          Swap Runes
                        </Button>
                      </div>
                    ) : null} */}
                    <span>&nbsp;</span>{' '}
                    <Button
                      scale="sm"
                      variant="text"
                      onClick={() => (isMaximized ? goUnmaximized(rnd) : goMaximized(rnd))}
                      style={{ padding: '0 5px' }}>
                      {isMaximized ? <FiMinimize style={{ zoom: 0.9 }} /> : <FiMaximize style={{ zoom: 0.9 }} />}
                    </Button>
                    <Button
                      scale="sm"
                      variant="text"
                      onClick={() => (isFullscreen ? exitFullscreen() : goFullscreen(pageElement.current))}
                      style={{ padding: '0 5px' }}>
                      {isFullscreen ? <FiMinimize2 style={{ zoom: 0.9 }} /> : <FiMaximize2 style={{ zoom: 0.9 }} />}
                    </Button>
                    <Button
                      scale="sm"
                      variant="text"
                      onClick={() => {
                        window.localStorage.removeItem(`WindowPath-${routePath}`);
                        window.localStorage.removeItem(`WindowStatus-${routePath}`);
                        window.localStorage.removeItem(`WindowPosition-${routePath}`);
                        window.localStorage.removeItem(`WindowSize-${routePath}`);
                        onClose(routePath);
                      }}
                      style={{ padding: '0 5px' }}>
                      <BsX style={{ zoom: 1.3 }} />
                    </Button>
                    {/* {loaded && !claimRewardStatus ? (
                  <Button scale="sm" onClick={claimRewards} style={{zoom: 0.8, marginTop: 5}}>
                    Claim Rewards
                  </Button>
                ) : null} */}
                    {/* {!isMobile && isGameStarted && !isGameHidden ? (
                  <span
                    id="breakCountdown"
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      filter: 'drop-shadow(rgba(0,0,0,0.6) 1px 1px 1px) drop-shadow(rgba(0,0,0,0.6) 0px 0px 4px)',
                    }}
                  ></span>
                ) : null} */}
                    {/* {!isMobile && isGameStarted && !isGameHidden ? (
                    <Button scale="sm" variant="text" onClick={hideGame} style={{ marginLeft: 10 }}>
                      Rewards: ${totalRewardValue.toFixed(2)}
                    </Button>
                  ) : null} */}
                    {/* {isMobile ? (
                  <Button
                    scale="sm"
                    onClick={() => {
                      pauseGame()
                      onPresentTutorialModal()
                    }}
                    style={{ zoom: 0.8, marginLeft: 10 }}
                  >
                    Tutorial
                  </Button>
                ) : null} */}
                    {/* {isGameStarted && !isGameHidden ? (
                    <Button
                      scale="sm"
                      onClick={() => onPresentReportModal()}
                      style={{ zoom: 0.8, marginLeft: 10, marginRight: 10 }}
                    >
                      Report
                    </Button>
                  ) : null} */}
                    {/* {isGameStarted && !isGameHidden ? (
                  <Button scale="sm" onClick={hideGame} style={{ zoom: 0.8, marginLeft: 10, marginRight: 10 }}>
                    Show Intro
                  </Button>
                ) : null}
                {isGameStarted && isGameHidden ? (
                  <Button scale="sm" onClick={showGame} style={{ zoom: 0.8, marginLeft: 10, marginRight: 10 }}>
                    Show Game
                  </Button>
                ) : null} */}
                    {/* {isGameStarted && !isGameHidden && !isGamePaused ? (
                    <Button scale="sm" onClick={pauseGame} style={{ zoom: 0.8, marginLeft: 10, marginRight: 10 }}>
                      Pause Game
                    </Button>
                  ) : null}
                  {isGameStarted && !isGameHidden && isGamePaused ? (
                    <Button scale="sm" onClick={resumeGame} style={{ zoom: 0.8, marginLeft: 10, marginRight: 10 }}>
                      Resume Game
                    </Button>
                  ) : null} */}
                    {/* {isGameStarted && !isGameHidden ? (
                  <Button scale="sm" variant="text" onClick={goFullscreen}>
                    <BsArrowsFullscreen />
                  </Button>
                ) : null} */}
                  </Flex>
                </Flex>
              </AppToolbar>

              {/* <RouterLink to="/evolution">
              <TopBanner>
                <TopBannerBg />
                Play Evolution Isles Beta
              </TopBanner>
            </RouterLink>
            <RouterLink to="/shards">
              <TopBanner2>
                <TopBannerBg2 />
                $RXS released. Shard $RUNE now!
              </TopBanner2>
            </RouterLink> */}
              {brand === 'arken' ? (
                <ToolbarBanner path={path} id="evolutionSeason1" to="/evolution">
                  <TopBanner3>
                    <TopBannerBg3 />
                    Play Evolution Isles Season Ladder
                  </TopBanner3>
                </ToolbarBanner>
              ) : null}
            </WindowHeader>
            <SWindowContent
              onMouseDown={() =>
                onFocus(function (index) {
                  setZIndex(index);
                })
              }
              className="app__fullpage-window__content">
              {isMaximized &&
              !['/lore', '/evolution', '/whitepaper', '/art', '/swap', '/swap/pool', '*'].includes(routePath) &&
              brand !== 'w4' ? (
                <div
                  css={css`
                    position: relative;
                    // padding: 20px;
                  `}>
                  <div
                    css={css`
                      position: absolute;
                      left: 0;
                      top: 0;
                      right: 0;
                      bottom: 0;
                      z-index: -2;

                      pointer-events: none;
                      ${isMaximized ? 'min-height: 100vh;' : ''}
                    `}
                    className="app__window-content-bg"></div>
                  {children}
                  <PageFooter />
                </div>
              ) : (
                children
              )}
            </SWindowContent>
            {footer ? (
              <SWindowFooter variant="well" onMouseDown={onFocus}>
                {footer}
              </SWindowFooter>
            ) : null}
          </FullPageWindow>
        </Rnd>
      </>
    );
  }
);

// const GlobalCSS = createGlobalStyle`

// `

// let currentRouteIndex = 1001

const AppContent = ({
  pendingPageUpdate,
  setPendingPageUpdate,
  brand,
  pageState,
  setPageState,
  pageSort,
  setPageSort,
  onChangePage,
}) => {
  // const history2 = useNavigate()
  // const location = useLocation()
  // const { user } = useFeathers()
  const { address } = useWeb3();
  // const { profile, hasProfile } = useProfile(address)
  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />);
  const [onPresentSwapModal] = useModal(<SwapModal onSuccess={() => {}} />);
  // const location = {
  //   pathname: '/',
  //   search: ''
  // }
  // const theme = useContext(ThemeContext);
  // const dispatch = useDispatch();
  // const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { t } = useTranslation();
  // const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints()
  // const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl

  for (const brandItem of Object.values(config)) {
    for (const menuItem of brandItem) {
      menuItem.label = t(menuItem.label);

      if (menuItem.items) {
        for (const subMenuItem of menuItem.items) {
          subMenuItem.label = t(subMenuItem.label);
        }
      }
    }
  }

  const routes = pageState;

  const [refresh, setRefresh] = useState(false);
  // const [lastPageActive, setLastPageActive] = useState('') //useState(undefined);

  // const [currentLocationPath, setCurrentLocationPath] = useState(location.pathname)

  // const { address: account } = useWeb3()

  // useEffect(
  //   function () {
  //     if (!hasProfile) return

  //     if (location.pathname !== '/account/link' && !user) {
  //       history2.push('/account/link')
  //     }
  //   },
  //   [profile, hasProfile, user, location],
  // )

  useEffect(() => {
    // setInterval(autoSize, 300);

    // window.addEventListener("resize", autoSize, true);

    document.addEventListener('dragover', (event) => {
      event.preventDefault();
      return false;
    });

    document.addEventListener('drop', (event) => {
      event.preventDefault();
      return false;
    });
  }, []);

  // useEffect(() => {
  //   if (pendingPageUpdate) {
  //     console.log("Running pending page update: ", pendingPageUpdate);

  //     const { page, data, path, close } = pendingPageUpdate;
  //     if (lastPageActive !== page) {
  //       setLastPageActive(page);
  //     }

  //     // @ts-ignore
  //     window.mixpanel?.track("Change Page", {
  //       page
  //     });

  //     // if (!pageState[page].open) {
  //     //   UpdatePage(page, { open: true });
  //     // }
  //     // if (!pageState[page].focused) {
  //     //   UpdatePage(page, { focused: true });
  //     // }
  //     if (close) {
  //       pageSort.items.splice(
  //         pageSort.items.findIndex((v) => v === page),
  //         1
  //       );
  //       setPageSort(pageSort);
  //     } else if (!pageSort.items.includes(page)) {
  //       pageSort.items = [...pageSort.items, page];
  //       setPageSort(pageSort);
  //     }

  //     if (data.focused) {
  //       for (const page2 in pageState) {
  //         const state = pageState[page2];
  //         if (state.focused) state.focused = false;
  //       }
  //     }

  //     pageState[page] = {
  //       ...pageState[page],
  //       open: true,
  //       focused: true,
  //       minimized: false,
  //       ...data,
  //     };

  //     console.log('Updating page state', page, pageState)

  //     setPageState(pageState);

  //     setPendingPageUpdate(undefined);

  //     const currentUrl = location.pathname + location.search;

  //     setCurrentLocationPath(currentUrl)

  //     if (path !== currentUrl) {
  //       setTimeout(() => history2.push(path), 500);
  //     }
  //   }
  // }, [
  //   history2,
  //   lastPageActive,
  //   location.pathname,
  //   location.search,
  //   pageSort,
  //   pageState,
  //   pendingPageUpdate,
  // ]);

  // useEffect(() => {
  //   const page = currentLocationPath
  //     .replace("/games/", "")
  //     .replace(/:coin/g, "")
  //     .replace(/\/[0-9]*/g, "")
  //     .replace(/\/[A-Z]*/g, "")
  //     .replace(/\//g, "");

  //   const route = routes.find(
  //     r => matchPath(location.pathname, r)
  //   )
  //   const match = route ?? matchPath(location.pathname, route)

  //   if (page) {
  //     console.log(222, page, route, match)
  //     setPendingPageUpdate({
  //       path: currentLocationPath,
  //       page: (match as any)?.path.replace(/\//g, "") || page,
  //       data: { open: true, focused: true, minimized: false },
  //     });
  //   }
  // }, [currentLocationPath]);

  // useEffect(() => {
  //   const page = currentLocationPath
  //     .replace("/games/", "")
  //     .replace(/:coin/g, "")
  //     .replace(/\/[0-9]*/g, "")
  //     .replace(/\/[A-Z]*/g, "")
  //     .replace(/\//g, "");

  //   const route = routes.find(
  //     r => matchPath(location.pathname, r)
  //   ) as any
  //   const match = route ?? matchPath(location.pathname, route)

  //   console.log(333, page, route, match, location, currentLocationPath)
  //   if (route && match && !pendingPageUpdate && currentLocationPath !== route?.path) {
  //     setPendingPageUpdate({
  //       path: route.path,
  //       page: (match as any).path.replace(/\//g, "") || page,
  //       data: { open: true, focused: true, minimized: false },
  //     });
  //   }
  // }, [location.pathname, pendingPageUpdate, currentLocationPath]);

  const RouteHandler = function ({ ...query }) {
    const params = useParams();
    const location2 = useLocation();
    const { setTab } = useMarket();
    const settings = useSettings();

    const route = query.routes.find((r) => matchPath(r.path, location2.pathname));

    if (!route) {
      console.log('Page not found', location2, query);
      return null;
    }

    // Updated matchPath usage
    const match = matchPath(route.path, location2.pathname);

    const currentRouteIndex = Math.max(
      ...query.routes.map((r) => (r.props.routeIndex > 0 ? r.props.routeIndex : 1000))
    );
    const currentRoute = query.routes.find((r) => r.props.routeIndex === currentRouteIndex);

    if (
      currentRouteIndex === 1000 ||
      route.props.routeIndex !== currentRouteIndex ||
      (match?.pathname.startsWith('/swap/add') && currentRoute.match?.pathname !== match?.pathname)
    ) {
      console.log('Page setting up', query, location2, route);

      // const match = matchPath(location2.pathname, route.path)

      // const rIndex = routes.findIndex((r) => r.path === route.path)
      // route = {...route}
      // routes.splice(rIndex, 1)
      // routes.push(route)
      // console.log('vvv3', routes)

      route.props = {
        // ...props2,
        // ...pageState[page],
        ...route.props,
        ...query,
        params,
        location: location2,
        persist: route.persist,
        active: route.props.active,
        open: true,
        toolbarNav: route.toolbarNav,
        routePath: route.path,
        routeIndex: currentRouteIndex + 1,
        windowPosition: window.localStorage.getItem(`WindowPosition-${route.path}`)
          ? JSON.parse(window.localStorage.getItem(`WindowPosition-${route.path}`))
          : { x: 0, y: 0 },
        windowSize: window.localStorage.getItem(`WindowSize-${route.path}`)
          ? JSON.parse(window.localStorage.getItem(`WindowSize-${route.path}`))
          : { width: '100%', height: '100%' },

        // match,
        // history: history2,
        // active: lastPageActive === page,
        // zIndex:
        //   lastPageActive === page
        //     ? 50
        //     : pageSort.items.findIndex((v) => v === page) !== -1
        //     ? pageSort.items.findIndex((v) => v === page) + 1
        //     : 1,
        onFocus: (e, data) => {
          // if (lastPageActive !== page) {
          //   setPendingPageUpdate({
          //     path,
          //     page,
          //     data: { focused: true, minimized: false },
          //   });
          // }
          //setTimeout(() => history.push(path), 1000);
        },
        onDragStart: (e, data) => {},
        onDragStop: (e, data) => {
          // const { x, y } = data;
          // setPendingPageUpdate({
          //   path,
          //   page,
          //   data: { focused: true, x, y },
          // });
          //setTimeout(() => history.push(path), 1000);
        },
        onMinimize: (minimized) => {
          // @ts-ignore
          // const previousLocation = location.state ? location.state.from! : "/";
          // setPendingPageUpdate({
          //   path: previousLocation,
          //   page,
          //   data: { focused: false, open: true, minimized },
          // });
        },
        onClose: (path) => {
          // @ts-ignore
          // const previousLocation = location.state ? location.state.from! : "/";
          // setPendingPageUpdate({
          //   path: previousLocation,
          //   page,
          //   close: true,
          //   data: { focused: false, open: false },
          // });
          //setTimeout(() => history.push(previousLocation), 1000);

          const r2 = query.routes.find((r) => r.path === path);

          r2.props.open = false;
          r2.props.active = false;
          r2.props.persist = false;
          r2.props.routeIndex = 1000;
          const r3 = query.routes.filter((r) => !!r.props.open);

          if (r3.length > 0) {
            history.push(r3.sort((a, b) => a.props.routeIndex - b.props.routeIndex)[r3.length - 1].path);
          } else {
            history.push('/desktop');
          }
        },
      };

      // setCurrentRouteIndex(currentRouteIndex + 1)
      // for (const r of query.routes) {
      //   r.props.active = false
      // }

      route.props.active = true;

      route.props.routeIndex = currentRouteIndex + 1;

      route.props.match = match;

      route.props.history = history;

      onRouteChange(location2.pathname);
      // console.log('zzz', currentRoute.props.location.search, location2.search)
      if (
        (currentRoute.path !== '/market' ||
          currentRoute.props.location.search === '?query=0x191727d22f2693100acef8e48F8FeaEaa06d30b1') &&
        route.path === '/market' &&
        location2.search !== '?query=0x191727d22f2693100acef8e48F8FeaEaa06d30b1'
      ) {
        console.log('Resetting market params', location2, params);
        setTab(2);
      }
    }

    // if (!props.open || props.minimized) {
    //   // console.log('Page is closed or minimized:', page)
    //   return <></>;
    // }

    // console.log('vvvv2', route)

    return (
      <DraggableWindow
        settings={settings}
        path={match.pathname || route.path}
        {...route.props}
        brand={brand}
        key={match.pathname || route.path}
        onPresentPurchaseModal={onPresentPurchaseModal}
        onPresentSwapModal={onPresentSwapModal}>
        <Suspense
          fallback={
            <Skeleton
              height="300px"
              m="20px"
              css={css`
                max-width: 1200px;
                margin: 30px auto;
              `}
            />
          }>
          {route.props.open ? <route.component {...route.props} /> : null}
        </Suspense>
      </DraggableWindow>
    );

    // <AppRoutes key={route.matchUrl || route.path} route={route} />
  };

  // const { toastError, toastSuccess } = useToast()

  // useEffect(function () {
  //   if (!window) return

  //   async function init() {
  //     try {
  //       const endpoint = 'https://s1.envoy.arken.asi.sh'
  //       const response = await fetch(endpoint + `/notices.json`)
  //       const notices = await response.json()

  //       const findNotice = function () {
  //         if (!notices.length) {
  //           setTimeout(findNotice, 1 * 1000)
  //           return
  //         }

  //         const notice = notices[Math.floor(Math.random() * Math.floor(notices.length - 1))]
  //         const cacheKey = `notice_${notice.id}`
  //         if (window.localStorage.getItem(cacheKey)) {
  //           setTimeout(findNotice, 1 * 1000)
  //           return
  //         }

  //         // console.log('New notices', notices)

  //         let dateCreated
  //         try {
  //           dateCreated = formatDistance(parseISO(notice.createdAt), new Date())
  //         } catch (e) {
  //           dateCreated = formatDistance(parseISO(new Date(notice.createdAt).toISOString()), new Date())
  //         }

  //         let message
  //         if (notice.type === 'achievement') {
  //           message = notice.data.message
  //         }

  //         if (message) {
  //           toastSuccess(message)

  //           window.localStorage.setItem(cacheKey, 'true')
  //         }
  //       }

  //       setTimeout(findNotice, 30 * 1000)
  //     } catch (e) {
  //       console.log(e)
  //     }
  //   }

  //   init()

  //   const inter = setInterval(init, 10 * 60 * 1000)

  //   return () => {
  //     clearInterval(inter)
  //   }
  // }, [])

  useEffect(function () {
    if (!window) return;

    console.log('Refreshing views');
    setRefresh(true);
  }, []);

  const location3 = useLocation();

  const getRoute = function () {
    return routes.find((r) => matchPath(r.path, location3.pathname));
  };

  const routeNotFound = !getRoute();

  return (
    <>
      <PageWrapper id="app">
        {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            css={css`
              display: none;
            `}
          >
            <defs>
              <filter id="goo">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation={1}
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                  result="goo"
                />
                <feBlend in="SourceGraphic" in2="goo" />
              </filter>
            </defs>
          </svg>

           */}
        {/* <AnimatePresence> */}
        {/* <Route path={baseRouteUrl + '/fundraiser'}>
            <Navigate to="/market?query=0x191727d22f2693100acef8e48F8FeaEaa06d30b1&advanced=false" />
          </Route> */}
        {routes.map((route: any) => {
          if (window.localStorage.getItem(`WindowStatus-${route.path}`) !== 'opened') return null;

          route.props.open = true;
          route.props.persist = true;
          route.props.active = true;
          route.props.windowPosition = window.localStorage.getItem(`WindowPosition-${route.path}`)
            ? JSON.parse(window.localStorage.getItem(`WindowPosition-${route.path}`))
            : { x: 0, y: 0 };
          route.props.windowSize = window.localStorage.getItem(`WindowSize-${route.path}`)
            ? JSON.parse(window.localStorage.getItem(`WindowSize-${route.path}`))
            : { width: '100%', height: '100%' };
          // location: location2,
          // title: route.title,
          // toolbarNav: route.toolbarNav,
          route.props.routePath = route.path;
          // routeIndex: currentRouteIndex + 1,

          route.props.onClose = (path) => {
            // @ts-ignore
            // const previousLocation = location.state ? location.state.from! : "/";
            // setPendingPageUpdate({
            //   path: previousLocation,
            //   page,
            //   close: true,
            //   data: { focused: false, open: false },
            // });
            //setTimeout(() => history.push(previousLocation), 1000);

            const r2 = routes.find((r) => r.path === path);

            r2.props.open = false;
            r2.props.active = false;
            r2.props.persist = false;
            r2.props.routeIndex = 1000;
            const r3 = routes.filter((r) => !!r.props.open);

            if (r3.length > 0) {
              history.push(r3.sort((a, b) => a.props.routeIndex - b.props.routeIndex)[r3.length - 1].path);
            } else {
              history.push('/desktop');
            }
          };

          // const location2 = useLocation()
          // const { setTab } = useMarket()

          // const route = routes.find((r) =>
          //   matchPath(location2.pathname, {
          //     path: r.path,
          //     exact: r.exact,
          //     strict: r.strict,
          //   }),
          // )

          // if (window.localStorage.getItem(`WindowStatus-${route.path}`) === 'opened') return null // We can assume its already opened by the other logic

          // if (!route) {
          //   console.log('Page not found', location2)
          //   return <NotFound key="approutes2" defaultNotFoundValue />
          // }

          const pathToMatch = window.localStorage.getItem(`WindowPath-${route.path}`) || route.path;

          const match = matchPath(pathToMatch, route.path);

          const currentRouteIndex = window.localStorage.getItem(`WindowIndex-${route.path}`)
            ? parseInt(window.localStorage.getItem(`WindowIndex-${route.path}`))
            : Math.max(...(routes.map((r) => (r.props.routeIndex > 0 ? r.props.routeIndex : 1000)) + 1));

          route.props.routeIndex = currentRouteIndex;

          route.props.match = match;

          route.props.history = history;

          route.props.onFocus = function (cb) {
            const currentRouteIndex2 = Math.max(
              ...routes.map((r) => (r.props.routeIndex > 0 ? r.props.routeIndex : 1000))
            );

            route.props.routeIndex = currentRouteIndex2 + 1;

            window.localStorage.setItem(`WindowIndex-${route.path}`, route.props.routeIndex);

            cb?.(route.props.routeIndex);
          };

          console.log('Rendering saved window', route);

          return (
            <DraggableWindow
              path={match?.pathname || route.path}
              {...route.props}
              key={match?.pathname || route.path}
              onPresentPurchaseModal={onPresentPurchaseModal}
              onPresentSwapModal={onPresentSwapModal}>
              <Suspense fallback={<></>}>{route.props.open ? <route.component {...route.props} /> : null}</Suspense>
            </DraggableWindow>
          );
          // <Route exact={route.exact} path={baseRouteUrl + route.path} key={route.matchUrl || route.path}>
          // </Route>
        })}
        {useMemo(
          () => (
            <RouteHandler routes={routes} />
          ),
          [refresh, routes]
        )}
        {routeNotFound ? <NotFound key="approutes2" defaultNotFoundValue /> : null}
        {/* <Route path="*" component={NotFound} /> */}
        <div id="blackhole"></div>
        <div id="guardian" style={{ display: 'none' }}></div>

        {/* </AnimatePresence> */}
      </PageWrapper>
    </>
  );
};

const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
};

const mediaWidthTemplates = Object.keys(MEDIA_WIDTHS).reduce((accumulator, size) => {
  accumulator[size] = (a: any, b: any, c: any) => css`
    @media (max-width: ${MEDIA_WIDTHS[size]}px) {
      ${css(a, b, c)}
    }
  `;
  return accumulator;
}, {});

const App: React.FC<any> = (props) => {
  const { address: account } = useWeb3();
  const { brand } = useBrand();
  const settings = useSettings();
  // Monkey patch warn() because of web3 flood
  // To be removed when web3 1.3.5 is released
  useEffect(() => {
    console.warn = () => null;
    document.addEventListener('touchstart', function () {}, true);
  }, []);

  useEffect(() => {
    document.body.classList.add(`brand-${brand}`);
  }, [brand]);

  // useFetchPublicData();
  // useFetchProfile(account);
  // useFetchPriceList()
  // useReferral();

  const { connector } = useWeb3();

  const [activatingConnector, setActivatingConnector] = React.useState<any>();
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager || !!activatingConnector);

  const { pendingPageUpdate, setPendingPageUpdate, pageState, setPageState, pageSort, setPageSort, onChangePage } =
    useWindows();

  // const { profile } = useProfile(account);
  const { isProd } = useEnv();
  // const { login, logout } = useAuth();
  // const { isDark, toggleTheme } = useTheme();

  // const isHome = window.location?.pathname === '/';

  // const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  // const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;

  return (
    <>
      <GlobalStyle useExocetFont={i18n.language === 'en'} />
      {/* <Sentry.ErrorBoundary fallback={myFallback} showDialog={false}> */}
      <div
        id="app-wrapper"
        css={css`
          position: relative;
          z-index: 2;
        `}>
        {/* <GlobalStyle useExocetFont={i18n.language === 'en'} /> */}
        {/* @ts-ignore */}
        <BrowserRouter>
          <AuthProvider trpc={trpc}>
            <NavProvider>
              <TourProvider>
                <SettingsProvider>
                  <Layout pageState={pageState}>
                    <AppContent
                      pendingPageUpdate={pendingPageUpdate}
                      setPendingPageUpdate={setPendingPageUpdate}
                      pageState={pageState}
                      setPageState={setPageState}
                      pageSort={pageSort}
                      setPageSort={setPageSort}
                      onChangePage={onChangePage}
                      brand={brand}
                    />
                  </Layout>
                </SettingsProvider>
              </TourProvider>
            </NavProvider>
          </AuthProvider>
          <ToastListener />
        </BrowserRouter>
        {/* <EasterEgg iterations={2} /> */}
        {/* <GlobalCheckBullHiccupClaimStatus /> */}
      </div>
      {/* </Sentry.ErrorBoundary> */}
      {isProd ? (
        <>
          {/* <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>
          <div id="moon">
            <div className="craterCon">
              <div className="craters"></div>
            </div>
            <div className="glow"></div>
          </div>
          <div id="sun">
            <div className="craterCon">
              <div className="craters"></div>
            </div>
            <div className="glow"></div>
          </div> */}
        </>
      ) : null}
      {/* {isHome ? <div id="sun"></div> : null} */}
      {/* <div id="moon"></div> */}
      {/* <Trollbox /> */}
      {/* <ChatConnector /> */}
    </>
  );
};

export default React.memo(App);

// {
//   user: {
//     theme: 'original',
//     background: 'transparent',
//     vintageFont: 'arial',
//     fontSize: 1,
//     matrix: false,
//     distortion: false,
//     distortionIntensity: false,
//     scanLines: false,
//     scanLinesIntensity: false
//   }
// }
