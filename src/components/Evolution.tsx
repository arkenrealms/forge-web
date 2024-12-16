import React, { useCallback, useEffect, useRef, useState } from 'react';
import utf8 from 'utf8';

import { formatDistance } from 'date-fns';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { rewardTokenIdMap } from '@arken/node/data/items';
import { generateShortId } from '@arken/node/util/db';
import { decodeItem } from '@arken/node/util/decoder';
import io from 'socket.io-client';
import styled, { createGlobalStyle, css } from 'styled-components';
import ItemInformation from '~/components/ItemInformation';
import Page from '~/components/layout/Page';
import Linker from '~/components/Linker';
import { Modal, useModal } from '~/components/Modal';
import Paragraph from '~/components/Paragraph';
import SeasonRankings from '~/components/SeasonRankings';
import useBrand from '~/hooks/useBrand';
import useCache from '~/hooks/useCache';
import { useRuneSender } from '~/hooks/useContract';
import useFetch from '~/hooks/useFetch';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import useSettings from '~/hooks/useSettings2';
import { serialize, deserialize } from '@arken/node/util/rpc';
import useWeb3 from '~/hooks/useWeb3';
import { useProfile, useToast } from '~/state/hooks';
import { getUsername } from '~/state/profiles/getProfile';
import {
  BaseLayout,
  Button,
  Card2,
  Card3,
  Card4,
  Card,
  CardBody,
  Flex,
  Heading,
  Link,
  OpenNewIcon,
  Text,
  Toggle,
} from '~/ui';
import { trpc, clients } from '~/utils/trpc';
import type * as Arken from '@arken/node/types';

import addresses from '@arken/node/contractInfo';

// var unityProvider = UnityLoader.instantiate("unityContainer", "Build/public.json", {onProgress: UnityProgress});
let unityProvider;

// @ts-ignore
window.unityBridge = {
  name: 'Loading',
};

let focusInterval;
let originalAlert;

const testMode = true;
const logCommonEvents = testMode;
let gameInitialized = false;
// let accountInitialized = false
let currentPlayerId;
const debug = process.env.NODE_ENV !== 'production';
const playerWhitelist = ['Botter', 'Sdadasd'];

const contractAddressToKey = {};

for (const contractKey of Object.keys(addresses)) {
  contractAddressToKey[addresses[contractKey][56]] = contractKey;
}

const ModalContent = styled.div`
  margin-bottom: 16px;
  color: #bb955e;
  text-shadow: 1px 1px 1px black;
  font-weight: bold;
  max-width: 600px;
`;

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`;

const BreakModal = ({ onResume, onDismiss }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title="Break Time"
      onDismiss={() => {
        onResume();
        onDismiss();
      }}>
      <ModalContent>
        <Flex flexDirection="column" alignItems="left" mb="8px" justifyContent="start">
          {/* <Heading as="h2" size="xl" color="#fff" mb="24px">
              How To Play
            </Heading> */}
          <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
            Stay Hydrated!
          </Heading>
          <br />
          <HelpText>You died. This popup didn't kill you. Time to take a break!</HelpText>
          <br />
          <HelpText>Make sure you take a break to stretch your legs and drink water.</HelpText>
          <br />
          <br />
        </Flex>
      </ModalContent>
      <Actions>
        <Button
          width="100%"
          variant="secondary"
          onClick={() => {
            onResume();
            onDismiss();
          }}>
          Back
        </Button>
      </Actions>
    </Modal>
  );
};

const RulesModal = ({ onResume, onDismiss }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title="Rules"
      onDismiss={() => {
        onResume();
        onDismiss();
      }}>
      <ModalContent>
        <Flex flexDirection="column" alignItems="left" mb="8px" justifyContent="start">
          {/* <Heading as="h2" size="xl" color="#fff" mb="24px">
              How To Play
            </Heading> */}
          <HelpText>
            Please play clean. Play one game client, play normally, play to win. We will sometimes temporarily restrict
            accounts that are reported for breaking the rules. Permanent bans are rare, but you should read the rules
            carefully:
            <br />
            <ul>
              <li>No teaming up. There are no team game modes yet.</li>
              <li>No purposefully using walls to teleport multiple times to avoid death.</li>
              <li>No playing 2 servers at same time.</li>
              <li>No sharing accounts. 1 account = 1 player = 1 server.</li>
              <li>No using third-party tools to get an advantage.</li>
              <li>No running the game client twice to increase rewards or get an advantage against other players.</li>
              <li>
                No spectating on a different PC to see the map. It will be obvious if you know where everyone and every
                item is, and other players will report you.
              </li>
              <li>No "wintrading" ie. trading kills to a different player so alternate wins.</li>
              <li>
                No "feeding" ie. purposefully dying to help somebody else win. Even if you know you're going to lose,
                it's not fair to give kills to a specific player. If you have a bad connection are constantly being
                killed by the same player, other players will think you are feeding them and your account may be
                restricted.
              </li>
              <li>
                If you find an exploit and use it <strong>purposefully</strong> instead of reporting it, that is
                considered cheating.
              </li>
            </ul>
            <br />
            <br />
            If we believe you are intentionally not playing the game normally or circumventing normal gameplay, you may
            be temporarily restricted from playing for 24 hours or 48 hours, 1 week, or 1 month.
            <br />
            <br />
            If you aren't sure something is againt the rules, just ask.
          </HelpText>
          <br />
          <HelpText>
            If you are permanently banned, you will lose access to Arken games and will not receive rewards. It's
            against the rules to circumvent the ban by creating a new account. If it is proven you've done this, you
            will be banned again.
          </HelpText>
          <br />
          <br />
        </Flex>
      </ModalContent>
      <Actions>
        <Button
          width="100%"
          variant="secondary"
          onClick={() => {
            onResume();
            onDismiss();
          }}>
          Back
        </Button>
      </Actions>
    </Modal>
  );
};

const WarningsModal = ({ onResume, onDismiss }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title="Warnings"
      onDismiss={() => {
        onResume();
        onDismiss();
      }}>
      <ModalContent>
        <Flex flexDirection="column" alignItems="left" mb="8px" justifyContent="start">
          <HelpText>
            <em>This video game may trigger seizures for people with photosensitive epilepsy.</em>
          </HelpText>
          <br />
          <br />
        </Flex>
      </ModalContent>
      <Actions>
        <Button
          width="100%"
          variant="secondary"
          onClick={() => {
            onResume();
            onDismiss();
          }}>
          Back
        </Button>
      </Actions>
    </Modal>
  );
};

const Cards = styled(BaseLayout)`
  align-items: flex-start;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 12;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    & > div {
      grid-column: span 4;
      min-height: 550px;
    }
  }
`;

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`;

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  margin-bottom: 20px;

  justify-content: space-between;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 100%;
  margin-bottom: 10px;

  ${Text} {
    margin-left: 8px;
  }
`;

const HeadingFire = styled.div<{
  fireStrength: number;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
}>`
  background-image: -webkit-linear-gradient(
    top,
    #bcbcbc 0%,
    #bcbcbc 17.5%,
    #cecece 33.75%,
    #f0f0f0 50%,
    #cecece 63.75%,
    #bcbcbc 77.5%,
    #bcbcbc 100%
  );
  -webkit-background-clip: text;
  // -webkit-text-fill-color: transparent;
  // filter: sepia(1) saturate(5) hue-rotate(-25deg);
  // sepia(1) saturate(5) hue-rotate(-25deg) grayscale(1) drop-shadow(0px 0px 10px #000) invert(1)

  -webkit-animation: fire 0.4s infinite;

  @keyframes fire {
    0% {
      text-shadow:
        0 0 2px ${(props) => props.color1},
        0 ${(props) => props.fireStrength * -5}px ${(props) => props.fireStrength * 4}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 2}px ${(props) => props.fireStrength * -10}px
          ${(props) => props.fireStrength * 6}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -15}px
          ${(props) => props.fireStrength * 11}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
          ${(props) => props.fireStrength * 18}px ${(props) => props.color4};
    }
    25% {
      text-shadow:
        0 0 3px ${(props) => props.color1},
        ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -6}px
          ${(props) => props.fireStrength * 5}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -11}px
          ${(props) => props.fireStrength * 7}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -16}px
          ${(props) => props.fireStrength * 13}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -0}px ${(props) => props.fireStrength * -26}px
          ${(props) => props.fireStrength * 20}px ${(props) => props.color4};
    }
    50% {
      text-shadow:
        0 0 3px ${(props) => props.color1},
        ${(props) => props.fireStrength * -1}px ${(props) => props.fireStrength * -4}px
          ${(props) => props.fireStrength * 6}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 0}px ${(props) => props.fireStrength * -12}px
          ${(props) => props.fireStrength * 6}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -3}px ${(props) => props.fireStrength * -16}px
          ${(props) => props.fireStrength * 15}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -1}px ${(props) => props.fireStrength * -28}px
          ${(props) => props.fireStrength * 22}px ${(props) => props.color4};
    }
    75% {
      text-shadow:
        0 0 2px ${(props) => props.color1},
        ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -7}px
          ${(props) => props.fireStrength * 4}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -11}px
          ${(props) => props.fireStrength * 8}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -1}px ${(props) => props.fireStrength * -14}px
          ${(props) => props.fireStrength * 12}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
          ${(props) => props.fireStrength * 21}px ${(props) => props.color4};
    }
    100% {
      text-shadow:
        0 0 2px ${(props) => props.color1},
        0 ${(props) => props.fireStrength * -5}px ${(props) => props.fireStrength * 4}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 2}px ${(props) => props.fireStrength * -10}px
          ${(props) => props.fireStrength * 6}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -15}px
          ${(props) => props.fireStrength * 11}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
          ${(props) => props.fireStrength * 18}px ${(props) => props.color4};
    }
  }
`;

const SpecialButton = styled.div<{ title: string }>`
  position: relative;
  // height: 110px;
  // width: 260px;
  // padding: 44px 132px;
  // border-width: 44px 132px;
  // border-style: solid;
  // border-color: rgba(0, 0, 0, 0);
  // border-image-source: url(/images/special-button.png);
  // border-image-slice: 110 330 fill;
  padding: 0 0 50px 0;
  cursor: url('/images/cursor3.png'), pointer;
  font-family: 'webfontexl', sans-serif !important;
  text-transform: uppercase;
  background-color: #642c08;
  border-radius: 10px;
  padding: 30px 103px;
  filter: drop-shadow(rgba(0, 0, 0, 0.6) 1px 1px 1px) drop-shadow(rgba(0, 0, 0, 0.6) 0px 0px 4px);
  box-shadow: 0px -1px 0px 0px rgb(14 14 44 / 40%) inset;

  &:before {
    content: '${({ title }) => title}';
    position: absolute;
    top: 0;
    color: #000;
    white-space: nowrap;
    font-size: 24px;
    left: 20px;
    top: 20px;
  }

  filter: contrast(1.2);
  &:hover {
    filter: contrast(1.3) brightness(1.3);
  }
`;

const HelpText = styled.p`
  font-size: 0.9rem;
  line-height: 1.3rem;
  font-family: 'Alegreya Sans', Cambria, Verdana, Arial, Helvetica, sans-serif;
  text-transform: none;

  li {
    font-size: 0.9rem;
  }
`;

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 125px);
  justify-content: center;
`;

const log = (...args) => {
  if (debug) console.log(...args);
};

const RewardCardContainer = styled(Flex)`
  padding: 10px;
  margin-bottom: 10px;
`;

const RewardCardRune = ({ reward }) => {
  return (
    <RewardCardContainer>
      <Text>{reward.quantity} Rune</Text>
    </RewardCardContainer>
  );
};

// const getSocket = (endpoint) => {
//   console.log('Connecting to', endpoint);
//   return io(endpoint, {
//     transports: ['websocket'],
//     upgrade: false,
//     // extraHeaders: {
//     //   "my-custom-header": "1234"
//     // }
//   });
// };

const RewardCardItem = ({ reward }) => {
  reward.tokenId = rewardTokenIdMap[reward.name][reward.rarity];

  const item = decodeItem(reward.tokenId);
  return (
    <RewardCardContainer>
      <ItemInformation item={item} showActions={false} hideMetadata quantity={reward.quantity} showBranches={false} />
    </RewardCardContainer>
  );
};

// const RewardCard = ({ reward }) => {
//   return <RewardCardItem reward={reward} />;
// };

// const sendUserInfo = (username, address, isMobile, signature) => {};

// const goFullscreen = () => {
//   if (!gameCanvas) return;
//   // const ActivateFullscreen = function()
//   // {
//   if (gameCanvas.requestFullscreen) {
//     /* API spec */
//     gameCanvas.requestFullscreen();
//   }
//   // @ts-ignore
//   else if (gameCanvas.mozRequestFullScreen) {
//     /* Firefox */
//     // @ts-ignore
//     gameCanvas.mozRequestFullScreen();
//   }
//   // @ts-ignore
//   else if (gameCanvas.webkitRequestFullscreen) {
//     /* Chrome, Safari and Opera */
//     // @ts-ignore
//     gameCanvas.webkitRequestFullscreen();
//   }
//   // @ts-ignore
//   else if (gameCanvas.msRequestFullscreen) {
//     /* IE/Edge */
//     // @ts-ignore
//     gameCanvas.msRequestFullscreen();
//   }
// };

// let gameCanvas;

const config = {
  username: 'Testman', // || 'Guest' + Math.floor(Math.random() * 999),
  address: '0x1a367CA7bD311F279F1dfAfF1e60c4d797Faa6eb',
  isMobile: false,
};

// const formatCountdown = (secs) => {
//   function pad(n) {
//     return n < 10 ? '0' + n : n;
//   }

//   const h = Math.floor(secs / 3600);
//   const m = Math.floor(secs / 60) - h * 60;
//   const s = Math.floor(secs - h * 3600 - m * 60);

//   return pad(m) + ':' + pad(s); // pad(h) +":"+
// };

const parseMatch = (location) => {
  const match = {
    params: queryString.parse(location?.search || ''),
  };

  for (const key in match.params) {
    if (match.params[key] === 'false') {
      // @ts-ignore
      match.params[key] = false;
    } else if (match.params[key] === 'true') {
      // @ts-ignore
      match.params[key] = true;
    }
  }

  return match;
};

const GlobalStyles = createGlobalStyle`
#server-menu > div {
  display: block;
}
`;

const BoxHeading = styled(Heading)`
  margin-bottom: 16px;
`;

// const LogoImg = styled.img``;
// const BigCard = styled.div<{ align?: string }>`
//   color: ${({ theme }) => theme.colors.text};
//   position: relative;

//   border-width: 10px 10px;
//   border-style: solid;
//   border-color: transparent;

//   border-image-width: 80px;
//   background-color: rgba(0, 0, 0, 0.4);

//   background-size: 400px;
//   // background-color: rgba(0,0,0,0.4);
//   line-height: 1.6rem;
//   font-size: 1rem;
//   text-shadow: 1px 1px 1px #000;
//   p,
//   a,
//   span {
//     font-family: 'Alegreya Sans', sans-serif, monospace !important;
//     text-transform: none;
//     color: #ddd;
//   }
//   & > div > p {
//     line-height: 1.7rem;
//   }
//   ${({ theme }) => theme.mediaQueries.sm} {
//     border-width: 40px 40px;
//   }

//   ${({ align }) =>
//     align === 'right'
//       ? `
//     text-align: right;
//   `
//       : ''}
// `;
const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

let realm2;
let unityInstance;
let account2;
let sig2;

// @ts-ignore
window.socket = {
  on: (...args) => {},
  emit: (...args) => {},
};

const userIdToName = {};
let assumedTimeDiff = 0;
const assumedTimeDiffList = [];

const Isles: any = ({ open }) => {
  const location = useLocation();
  // const history = useNavigate();
  // const settings = useSettings();
  const cache = useCache();
  const match = parseMatch(location);
  const { t } = useTranslation();
  // const [didError, setDidError] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');
  const [signature, setSignature] = useState('');
  // const [progression, setProgression] = useState(0);
  const { account, library } = useWeb3();
  account2 = account;
  const { web3 } = useWeb3();
  const gameRef = useRef(null);
  const { unityProvider, UNSAFE__unityInstance, loadingProgression } = useUnityContext({
    loaderUrl: '/Build/MemeIsles/MemeIsles.loader.js',
    dataUrl: '/Build/MemeIsles/MemeIsles.data',
    frameworkUrl: '/Build/MemeIsles/MemeIsles.framework.js',
    codeUrl: '/Build/MemeIsles/MemeIsles.wasm',
    webglContextAttributes: {
      alpha: false,
      depth: false,
      stencil: false, // also interesting to test 'false'
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      // powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false,
      desynchronized: false,
    },
  });
  // @ts-ignore
  window.unityInstance = unityInstance = UNSAFE__unityInstance;
  const [isGameStarted, setIsGameStarted] = useState(loadingProgression !== 1);
  const [_realm, setRealm] = useState(null);
  const [username, setUsername] = useState(config.username);
  const [address, setAddress] = useState(config.address);
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState('disconnected');
  const [tab, setTab] = useState(match?.params?.realm ? parseInt(match?.params?.realm + '') : 0);
  const [isServerOffline, setIsServerOffline] = useState(false);
  const [isAdmin, setIsAdmin] = useState(
    window.location.hostname === 'dev.arken.gg' || playerWhitelist.includes(username)
  );
  const { toastError, toastSuccess, toastInfo } = useToast();
  const [onPresentRulesModal] = useModal(<RulesModal onResume={() => {}} onDismiss={() => {}} />);
  const [onPresentWarningsModal] = useModal(<WarningsModal onResume={() => {}} onDismiss={() => {}} />);

  // useEffect(
  //   function () {
  //     if (!account) return;

  //     // accountInitialized = true

  //     async function init() {
  //       try {
  //         const res = await getUsername(account);
  //         // @ts-ignore
  //         if (res) {
  //           setUsername(res);
  //           config.username = res;
  //           config.address = account;

  //           if (playerWhitelist.includes(res)) {
  //             setIsAdmin(true);
  //           }
  //         } else {
  //           // setUsername(account.slice(0, 5))
  //         }
  //       } catch (e) {
  //         // @ts-ignore
  //         // setUsername(account.slice(0, 5))
  //       }
  //     }

  //     const inter = setInterval(init, 1 * 60 * 1000);
  //     init();

  //     return () => {
  //       clearInterval(inter);
  //     };
  //   },
  //   [account, setUsername, setAddress]
  // );

  const { data: realms } = trpc.seer.core.getRealms.useQuery<Arken.Core.Types.Realm[]>();
  console.log('Realms', realms);
  // @ts-ignore
  const servers = realms?.[0].realmShards?.filter((s) => s.status === 'online' || s.status === 'Offline') || [];

  //   const realms = servers;
  const realm = _realm || servers[tab];
  realm2 = realm;

  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;

  config.isMobile = isMobile;

  const startOldGame = async () => {
    // unityProvider = new UnityContext({
    //   loaderUrl: '/Build/MemeIsles/MemeIsles.loader.js',
    //   dataUrl: '/Build/MemeIsles/MemeIsles.data',
    //   frameworkUrl: '/Build/MemeIsles/MemeIsles.framework.js',
    //   codeUrl: '/Build/MemeIsles/MemeIsles.wasm',
    //   webglContextAttributes: {
    //     alpha: false,
    //     depth: false,
    //     stencil: false, // also interesting to test 'false'
    //     antialias: false,
    //     premultipliedAlpha: false,
    //     preserveDrawingBuffer: false,
    //     powerPreference: 'high-performance',
    //     failIfMajorPerformanceCaveat: false,
    //     desynchronized: false,
    //   },
    // });

    // // @ts-ignore
    // window.unityProvider = unityProvider;

    startGame();
  };

  const startGame = async () => {
    let sig = signature;
    if (!sig) {
      sig = (await getSignature('evolution')).hash;
      setSignature(sig);
      sig2 = sig;
    }

    document.body.classList.add(`override-bad-quality`);

    setIsGameStarted(true);

    gameInitialized = true;

    clearInterval(focusInterval);

    document.addEventListener('keyup', (event) => {
      if (event.code === 'Space') {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
      }
    });

    // unityProvider.on('canvas', function (canvas) {
    //   if (canvas) {
    //     if (isMobile) {
    //       canvas.width = window.innerWidth;
    //       canvas.height = window.innerHeight;
    //     } else {
    //       canvas.width = window.innerWidth - 40;
    //     }

    //     canvas.height = window.innerHeight - 104;

    //     canvas.tabIndex = 1;
    //     canvas.setAttribute('id', 'unityCanvas');
    //     window.scrollTo(0, 0);

    //     gameCanvas = canvas;

    //     // if (isMobile) {
    //     document.body.appendChild(canvas);
    //     document.getElementById('root').style.display = 'none';
    //     // }

    //     window.addEventListener(
    //       'resize',
    //       function () {
    //         if (isMobile) {
    //           gameCanvas.width = window.innerWidth;
    //           gameCanvas.height = window.innerHeight;
    //         } else {
    //           gameCanvas.width = window.innerWidth - 40;
    //         }
    //         gameCanvas.height = window.innerHeight - 104;
    //         window.scrollTo(0, 0);
    //       },
    //       true
    //     );
    //   }
    // });

    // unityProvider.on('error', function (message) {
    //   setDidError(true);
    //   setErrorMessage(message);
    // });

    // unityProvider.on('progress', function (p) {
    //   setProgression(p);

    //   if (p === 1) {
    //     UNSAFE__unityInstance.SendMessage('NetworkManager', 'Connect');
    //   }
    // });
  };

  originalAlert = window.alert;

  async function getSignature(text = null) {
    const value = text || Math.floor(Math.random() * 999) + '';
    const hash = library?.bnbSign
      ? (await library.bnbSign(account, value))?.signature
      : await web3.eth.personal.sign(value, account, null);

    return {
      value,
      hash,
    };
  }

  const addLocalRealm = () => {
    setIsAdmin(true);
  };

  const updateRealm = (r) => {
    if (!r) return;
    setRealm(r);
  };

  const now = new Date().getTime() / 1000;

  // @ts-ignore
  window.socket = {
    on: (...args) => {
      log('socket.on', !!clients.evolutionShard.socket, args);

      if (clients.evolutionShard.socket)
        clients.evolutionShard.socket.on(args[0], function (...args2) {
          if (
            logCommonEvents ||
            (args[0] !== 'onUpdatePickup' && args[0] !== 'onUpdateMyself' && args[0] !== 'onUpdatePlayer')
          ) {
            log('socket.on called', !!clients.evolutionShard.socket, args[0], args2);
          }

          args[1](...args2);
        });
    },
    emit: (...args) => {
      if (logCommonEvents || (args[0] !== 'UpdateMyself' && args[0] !== 'Pickup')) {
        log('socket.emit', !!clients.evolutionShard.socket, args);
      }

      if (args?.[1]?.method === 'load' && state === 'loading') return;

      if (args?.[1]?.method === 'load') {
        setState('loading');

        // if (socket) {
        //   socket.disconnect();
        //   socket = null;
        // }

        // socket = getSocket('https://' + realm2.endpoint);

        const OnLoaded = () => {
          // config.username = 'aaa';
          // config.address = '0xasdsada';
          // log('Loaded');
          // const network = 'bsc';
          // const pack =
          //   config.username + ':' + network + ':' + config.address + ':' + (config.isMobile ? 'mobile' : 'desktop');
          //  +
          // ':' +
          // sig2;
          // console.log(pack);
          // unityInstance.SendMessage('NetworkManager', 'emitSetInfo', pack);
          // unityInstance.SendMessage('NetworkManager', 'onReadyToJoinGame')
          // setLoaded(true);

          const network = 'bsc';

          // @ts-ignore
          window.socket.emit('trpc', {
            id: generateShortId(),
            method: 'login',
            type: 'mutate',
            params: {
              name: config.username || 'Testman',
              network: network,
              address: config.address,
              device: config.isMobile ? 'mobile' : 'desktop',
              version: '1.9.0',
              signature:
                sig2 ||
                '0x0eca1dd7511e0e74db9cf89899cf50f66768510a80195b8e338926fdd5f377b705eec7a311f5ac7b3adf6b8d21a3c3db6956476a103f63f671b877a81cfb193f1b',
            },
          });
        };

        clients.evolutionShard.socket.on('trpc', function (msg) {
          // @ts-ignore
          // let json = String.fromCharCode.apply(null, new Uint8Array(msg));
          try {
            // explicitly decode the String as UTF-8 for Unicode
            //   https://github.com/mathiasbynens/utf8.js
            // json = utf8.decode(json);
            console.log('onEvents msg', msg);
            const data = deserialize(msg);
            console.log('onEvents events', data.params);

            for (const event of data.params) {
              const eventName = event[0];

              if (
                logCommonEvents ||
                (eventName !== 'onUpdatePickup' && eventName !== 'onUpdateMyself' && eventName !== 'onUpdatePlayer')
              ) {
                log('Event', event);
              }

              if (eventName === 'onLoaded') {
                OnLoaded();
                continue;
              } else if (eventName === 'onLogin') {
                // @ts-ignore
                window.socket.emit('trpc', {
                  id: generateShortId(),
                  method: 'join',
                  type: 'mutate',
                });

                continue;
              } else if (eventName === 'onJoinGame') {
                currentPlayerId = event[1].split(':')[0];

                setState('joined');
              } else if (eventName === 'onSpawnPlayer') {
                userIdToName[event[1].split(':')[0]] = event[1].split(':')[1];
              } else if (eventName === 'onSetInfo') {
                userIdToName[event[1].split(':')[0]] = event[1].split(':')[1];
              } else if (eventName === 'onGameOver' || eventName === 'onUserDisconnected') {
                const playerId = event[1].split(':')[0];
                if (playerId === currentPlayerId) {
                  if (userIdToName[event[1].split(':')[1]]) {
                    // toastInfo('You were killed by ' + userIdToName[event[1].split(':')[1]]);
                  } else {
                    // toastInfo('You died');
                  }

                  // socket.disconnect();
                  // socket = null;
                  setState('joined');
                  // setUsers([]);
                }
              } else if (eventName === 'onSetRoundInfo') {
                // toastInfo('Game mode is now ' + event[1].split(':')[22])
              } else if (state !== 'loading' && eventName === 'onUpdatePlayer') {
                if (!assumedTimeDiff) {
                  assumedTimeDiffList.push(new Date().getTime() - parseInt(event[1].split(':')[8]));
                  if (assumedTimeDiffList.length >= 50) {
                    assumedTimeDiff = average(assumedTimeDiffList);
                  }
                }
              }
              console.log('ZZZZ', eventName, event[1]);
              unityInstance.SendMessage('NetworkManager', eventName, event[1] ? event[1] : '');
            }
          } catch (err) {
            // ...
            console.log(err);
          }
        });

        // unityInstance.SendMessage('NetworkManager', 'onWebInit', account2 + ':' + sig2);
      }

      if (args.length > 1 && typeof args[1] === 'string') {
        console.log(args[1]);
        // Step 1: Split the binary string into bytes
        const binaryArray = args[1].split(' ');

        // Step 2: Convert each byte to its ASCII character
        const jsonString = binaryArray
          .filter((item) => !!item)
          .map((byte) => String.fromCharCode(parseInt(byte, 2)))
          .join('');

        // Step 3: Parse the resulting string into JSON
        try {
          const jsonObject = JSON.parse(jsonString.trim());
          console.log(jsonObject);

          const encoder = new TextEncoder();

          clients.evolutionShard.socket.emit(
            'trpc',
            encoder.encode(
              JSON.stringify({
                id: generateShortId(),
                method: args[0],
                type: 'mutate',
                params: jsonObject,
              })
            )
          );
        } catch (error) {
          console.error('Invalid JSON format:', error);
        }
      }

      if (clients.evolutionShard.socket) clients.evolutionShard.socket.emit(args[0], ...args.slice(1));
    },
  };

  return cache.overview[account]?.isBanned && cache.overview[account]?.banExpireDate > now ? (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" p="20px">
      <Card4>
        You have been restricted from playing Arken games. Time remaining:{' '}
        {formatDistance(new Date(), new Date().setTime(cache.overview[account]?.banExpireDate * 1000), {
          addSuffix: true,
        })}
      </Card4>
    </Flex>
  ) : (
    <div
      css={css`
        &::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url(/images/evolution-bg.jpg);
          background-size: cover;
          background-repeat: repeat-y;
          opacity: 0.3;
          z-index: -1;
        }
      `}>
      <GlobalStyles />
      {!isGameStarted ? (
        <>
          <Page>
            <Card2 style={{ marginTop: 20 }}>
              <BoxHeading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
                {t('Play Now')}
              </BoxHeading>
              <hr />
              <CardBody>
                <Cards>
                  <div style={{ position: 'relative' }}></div>
                  <div style={{ position: 'relative', minHeight: 300 }}>
                    <Flex flexDirection="column" alignItems="center" justifyContent="start">
                      {realms ? (
                        <ControlContainer>
                          <ViewControls>
                            {realms.map((r) => {
                              return (
                                <ToggleWrapper key={r.key}>
                                  <Toggle
                                    checked={realm?.key === r.key}
                                    disabled={!isAdmin && r.status !== 'online'}
                                    onChange={() => updateRealm(r)}
                                    scale="sm"
                                  />
                                  <Text style={{ textAlign: 'left' }}>
                                    {' '}
                                    {t(r.name)} {r.regionCode}
                                    {(!realm || (realm.key === r.key && !isServerOffline) || realm.key !== r.key) &&
                                    r.status === 'online'
                                      ? ` (${r.clientCount} online)`
                                      : t(` (offline)`)}
                                  </Text>
                                </ToggleWrapper>
                              );
                            })}
                            <div style={{ width: '100%', height: '20px' }} onClick={addLocalRealm}></div>
                          </ViewControls>
                        </ControlContainer>
                      ) : null}
                      {!realms ? <p>Loading realms...</p> : null}
                      {realms?.length === 0 ? <p>No realms online</p> : null}
                    </Flex>
                    <div
                      css={css`
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        text-align: center;
                        width: 100%;
                        padding: 20px;
                      `}>
                      <HeadingFire fireStrength={1} color1="#fd3" color2="#ff3" color3="#f80" color4="#f20">
                        <SpecialButton title="ENTER WORLD" onClick={startOldGame} />
                      </HeadingFire>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9em' }}>
                      <Button scale="sm" variant="text" onClick={onPresentRulesModal}>
                        View Rules
                      </Button>
                    </p>
                    <p style={{ fontSize: '0.9em' }}>
                      <Button scale="sm" variant="text" onClick={onPresentWarningsModal}>
                        View Warnings
                      </Button>
                    </p>
                  </div>
                </Cards>
              </CardBody>
            </Card2>
            <br />

            <Card3>
              <CardBody>
                <br />
                <br />
                <Button as={RouterLink} to="/evolution/tutorial">
                  View Tutorial
                </Button>
                {/* <p>
                  {t(
                    `Arken is the next evolution of DeFi farming. Farming is when you use your tokens to earn bonus tokens by staking them. Every week a new token is created (called a rune). It's farmed until the max supply of 50,000. That rune can then be combined with other runes to create NFTs. Those NFTs can be used to improve your earnings.`,
                  )}
                </p> */}
              </CardBody>
            </Card3>
          </Page>
        </>
      ) : null}
      {isGameStarted ? (
        <Page style={{ padding: 0, maxWidth: 'none', lineHeight: 0, position: 'relative' }}>
          {loadingProgression !== 1 ? (
            <StyledNotFound>
              <Heading size="xxl">{(loadingProgression * 100).toFixed(0)}%</Heading>
            </StyledNotFound>
          ) : null}
          <div
            css={css`
              position: absolute;
              top: 0;
              left: 0;
              display: grid;
              place-items: center; /* Centers both vertically and horizontally */
              height: 100%;
              width: 100%;
            `}>
            <div
              css={css`
                .app__styled-card2 {
                  box-shadow: none !important;
                }
              `}>
              {state === 'disconnected' ? (
                <Card2>
                  <Card>
                    {/* <BoxHeading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
                    UI
                  </BoxHeading>
                  <hr /> */}
                    <CardBody>
                      <Button
                        onClick={() => {
                          // @ts-ignore
                          window.socket.emit('trpc', {
                            id: generateShortId(),
                            method: 'load',
                            type: 'mutate',
                            params: serialize([]),
                          });
                          // unityInstance.SendMessage(
                          //   'NetworkManager',
                          //   'onJoinGame',
                          //   'qUcc5CvuMEoJmoOiAAD6:Guest420:3:false:600:-12.6602:-10.33721'
                          // );
                          // unityInstance.SendMessage('NetworkManager', 'onJoinGame', 'VL570mqtH6h33SWWAAAc:Killer:3:6');
                        }}>
                        Enter World
                      </Button>
                    </CardBody>
                  </Card>
                </Card2>
              ) : null}
              {state === 'loading' ? (
                <Card2>
                  <Card style={{ textAlign: 'center' }}>
                    <BoxHeading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
                      Connecting
                    </BoxHeading>
                    <hr />
                    <CardBody>
                      <Button
                        onClick={() => {
                          setState('disconnected');
                        }}>
                        Cancel
                      </Button>
                    </CardBody>
                  </Card>
                </Card2>
              ) : null}
            </div>
          </div>
          <Unity
            ref={gameRef}
            unityProvider={unityProvider}
            // matchWebGLToCanvasSize={false}
            style={{
              width: loadingProgression === 1 ? '100%' : '0%',
              height: loadingProgression === 1 ? '100%' : '0%',
            }}
          />
        </Page>
      ) : null}
    </div>
  );
};

export default Isles;
