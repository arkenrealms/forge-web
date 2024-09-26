import React, { useCallback, useEffect, useRef, useState } from 'react';
import utf8 from 'utf8';

import { formatDistance } from 'date-fns';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import Unity, { UnityContext } from 'react-unity-webgl';
import { rewardTokenIdMap } from '@arken/node/data/items';
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
import useWeb3 from '~/hooks/useWeb3';
import { useProfile, useToast } from '~/state/hooks';
import { getUsername } from '~/state/profiles/getProfile';
import { BaseLayout, Button, Card, CardBody, Flex, Heading, Link, OpenNewIcon, Text, Toggle } from '~/ui';

import addresses from '@arken/node/contractInfo';

// var unityInstance = UnityLoader.instantiate("unityContainer", "Build/public.json", {onProgress: UnityProgress});
let unityInstance;

// @ts-ignore
window.unityBridge = {
  name: 'Loading',
};

let socket;
let focusInterval;
let originalAlert;

const testMode = false;
const logCommonEvents = testMode;
let gameInitialized = false;
// let accountInitialized = false
let currentPlayerId;
const debug = process.env.NODE_ENV !== 'production';
let loadingGame = false;
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

const MainCard = styled(Card)`
  position: relative;
  padding: 20px;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  text-align: center;
  color: #bb955e;
  text-shadow: 1px 1px 1px black;
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

const getSocket = (endpoint) => {
  console.log('Connecting to', endpoint);
  return io(endpoint, {
    transports: ['websocket'],
    upgrade: false,
    // extraHeaders: {
    //   "my-custom-header": "1234"
    // }
  });
};

const RewardCardItem = ({ reward }) => {
  reward.tokenId = rewardTokenIdMap[reward.name][reward.rarity];

  const item = decodeItem(reward.tokenId);
  return (
    <RewardCardContainer>
      <ItemInformation item={item} showActions={false} hideMetadata quantity={reward.quantity} showBranches={false} />
    </RewardCardContainer>
  );
};

const RewardCard = ({ reward }) => {
  return <RewardCardItem reward={reward} />;
};

const sendUserInfo = (username, address, isMobile, signature) => {
  const network = 'bsc';
  const pack = username + ':' + network + ':' + address + ':' + (isMobile ? 'mobile' : 'desktop') + ':' + signature;

  unityInstance.send('NetworkManager', 'EmitSetInfo', pack);
};

const goFullscreen = () => {
  if (!gameCanvas) return;
  // const ActivateFullscreen = function()
  // {
  if (gameCanvas.requestFullscreen) {
    /* API spec */
    gameCanvas.requestFullscreen();
  }
  // @ts-ignore
  else if (gameCanvas.mozRequestFullScreen) {
    /* Firefox */
    // @ts-ignore
    gameCanvas.mozRequestFullScreen();
  }
  // @ts-ignore
  else if (gameCanvas.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    // @ts-ignore
    gameCanvas.webkitRequestFullscreen();
  }
  // @ts-ignore
  else if (gameCanvas.msRequestFullscreen) {
    /* IE/Edge */
    // @ts-ignore
    gameCanvas.msRequestFullscreen();
  }

  //     gameCanvas.removeEventListener('touchend', ActivateFullscreen);
  // }

  // gameCanvas.addEventListener('touchend', ActivateFullscreen, false);
};

const breakCountdownAmount = 60 * 60;
let breakCountdown = breakCountdownAmount;
let breakCountdownTime = Math.round(Date.now() / 1000);

// setInterval(() => {
//   breakCountdown = breakCountdownAmount - (Math.round(Date.now() / 1000) - breakCountdownTime)

//   if (breakCountdown < 0) {
//     breakCountdown = 0
//   }

//   if (document.getElementById('breakCountdown')) {
//     document.getElementById('breakCountdown').innerHTML = `Break ${formatCountdown(breakCountdown)}`
//   }
// }, 1 * 1000)

let gameCanvas;

const config = {
  username: 'Guest' + Math.floor(Math.random() * 999),
  address: '0xc84ce216fef4EC8957bD0Fb966Bb3c3E2c938082',
  isMobile: false,
};

const formatCountdown = (secs) => {
  function pad(n) {
    return n < 10 ? '0' + n : n;
  }

  const h = Math.floor(secs / 3600);
  const m = Math.floor(secs / 60) - h * 60;
  const s = Math.floor(secs - h * 3600 - m * 60);

  return pad(m) + ':' + pad(s); // pad(h) +":"+
};

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

// if (window.location.hostname === 'localhost') {
//   const lagger = () => {
//     let something = true
//     const started = Date.now()
//     while (something) {
//       if (Date.now() > started + 2000) {
//         something = false
//       }
//     }

//     setTimeout(lagger, 5000)
//   }
//   setTimeout(lagger, 3000)
// }

const BoxHeading = styled(Heading)`
  margin-bottom: 16px;
`;

const LogoImg = styled.img``;
const BigCard = styled.div<{ align?: string }>`
  color: ${({ theme }) => theme.colors.text};
  position: relative;

  border-width: 10px 10px;
  border-style: solid;
  border-color: transparent;

  border-image-width: 80px;
  background-color: rgba(0, 0, 0, 0.4);

  background-size: 400px;
  // background-color: rgba(0,0,0,0.4);
  line-height: 1.6rem;
  font-size: 1rem;
  text-shadow: 1px 1px 1px #000;
  p,
  a,
  span {
    font-family: 'Alegreya Sans', sans-serif, monospace !important;
    text-transform: none;
    color: #ddd;
  }
  & > div > p {
    line-height: 1.7rem;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    border-width: 40px 40px;
  }

  ${({ align }) =>
    align === 'right'
      ? `
    text-align: right;
  `
      : ''}
`;
const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

const userIdToName = {};
let assumedTimeDiff = 0;
const assumedTimeDiffList = [];

const claimRewardMessages = {
  requesting: 'Requesting Payout',
  processed: 'Payout Received',
};

const endpoints = {
  cache: 'https://s1.envoy.arken.asi.sh',
  coordinator: 'https://s1.relay.arken.asi.sh',
  // cache: 'http://localhost:6001', // 'https://s1.envoy.arken.asi.sh'
  // coordinator: 'http://localhost:5001' // 'https://s1.relay.arken.asi.sh'
};

// let isServersInit = false

const Evolution: any = ({ open }) => {
  const location = useLocation();
  const history = useNavigate();
  const brand = useBrand();
  const settings = useSettings();
  const cache = useCache();
  const match = parseMatch(location);
  const { t } = useTranslation();
  const [didError, setDidError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [progression, setProgression] = useState(0);
  const { account, library } = useWeb3();
  const { web3 } = useWeb3();
  const gameRef = useRef(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameHidden, setIsGameHidden] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [_realm, setRealm] = useState(null);
  const [username, setUsername] = useState(config.username);
  const [address, setAddress] = useState(config.address);
  const [banUsername, setBanUsername] = useState('');
  const [broadcast, setBroadcast] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [rewards, setRewards] = useState({});
  const [maintenance, setMaintenance] = useState(false);
  const [showOldRewards, setShowOldRewards] = useState(true);
  const [tab, setTab] = useState(match?.params?.realm ? parseInt(match?.params?.realm + '') : 0);
  const [banned, setBanned] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isServerOffline, setIsServerOffline] = useState(false);
  const [users, setUsers] = useState([]);
  const [playerRewards, setPlayerRewards] = useState({});
  // const [realms, setRealms] = useState([])
  const [payoutInfo, setPayoutInfo] = useState(null);
  const [payoutHistory, setPayoutHistory] = useState(null);
  // const { profile } = useProfile();
  const runeSender = useRuneSender();
  const [isAdmin, setIsAdmin] = useState(
    window.location.hostname === 'dev.arken.gg' || playerWhitelist.includes(username)
  );
  const pauseGame = () => {
    if (isGameStarted && !isGamePaused) {
      // var binaryString = ToBinary(ConvertToByteArray(data.ToString(), Encoding.ASCII));

      // @ts-ignore
      // window.socket.emit('Spectate')

      setIsGamePaused(true);
    }
  };

  const resumeGame = () => {
    if (isGameStarted && isGamePaused) {
      loadingGame = false;

      // @ts-ignore
      window.socket.emit('Load');

      setIsGamePaused(false);
    }
  };

  const { toastError, toastSuccess, toastInfo } = useToast();
  const [tutorialTabIndex, setTutorialTabIndex] = useState(0);
  const [onPresentBreakModal] = useModal(<BreakModal onResume={resumeGame} onDismiss={() => {}} />);
  const [onPresentRulesModal] = useModal(<RulesModal onResume={() => {}} onDismiss={() => {}} />);
  const [onPresentWarningsModal] = useModal(<WarningsModal onResume={() => {}} onDismiss={() => {}} />);
  const [claimRewardStatus, setClaimRewardStatus] = useState('');

  const updateHistory = useCallback(
    (key, val) => {
      setTimeout(() => {
        try {
          history({
            pathname: '/evolution',
            search:
              '?' +
              new URLSearchParams({
                realm: tab.toString(),
                [key]: val,
              }).toString(),
            // state: { detail: 'some_value' }
          });
        } catch (e) {
          console.log(e);
        }
      }, 500);
    },
    [history, tab]
  );

  useEffect(
    function () {
      if (!account) return;

      // accountInitialized = true

      async function init() {
        try {
          const res = await getUsername(account);
          // @ts-ignore
          if (res) {
            setUsername(res);
            setAddress(account);
            config.username = res;
            config.address = account;

            if (playerWhitelist.includes(res)) {
              setIsAdmin(true);
            }
          } else {
            // setUsername(account.slice(0, 5))
          }
        } catch (e) {
          // @ts-ignore
          // setUsername(account.slice(0, 5))
        }
      }

      const inter = setInterval(init, 1 * 60 * 1000);
      init();

      return () => {
        clearInterval(inter);
      };
    },
    [account, setUsername, setAddress]
  );

  const url = `https://s1.envoy.arken.asi.sh/evolution/servers.json`;
  let servers = useFetch(url).data[url] || [];

  if (brand.host === 'evo2.io') {
    servers = servers.filter((s) => s.name === 'North America');
  }

  servers = servers.filter((s) => s.status === 'online' || s.status === 'offline');

  const realms = servers;
  const realm = _realm || servers[tab];

  // useEffect(
  //   function () {
  //     // if (!account) return
  //     if (!open) return
  //     if (isServersInit) return
  //     if (!window) return

  //     isServersInit = true
  //     alert('testt')
  //     async function init() {
  //       const coeff = 1000 * 60 * 2
  //       const date = new Date() //or use any other date
  //       const rand = new Date(Math.round(date.getTime() / coeff) * coeff).getTime()
  //       // const rand1 = Math.floor(Math.random() * Math.floor(999999))
  //       const response1 = await fetch(`${endpoints.cache}/evolution/servers.json`) // ?${rand}
  //       let servers = await response1.json()

  //       // servers = [
  //       //   {
  //       //     "key": "europe1",
  //       //     "name": "Europe",
  //       //     "regionId": 1,
  //       //     "endpoint": "europe1.runeevolution.com:8443",
  //       //     "status": "online",
  //       //     "version": "1.6.3",
  //       //     "rewardItemAmount": 0,
  //       //     "rewardWinnerAmount": 0.006,
  //       //     "playerCount": 1,
  //       //     "gameMode": "Bird Eye",
  //       //     "roundStartedAt": 1644825756,
  //       //     "roundStartedDate": "Mon Aug 30 2021 20:19:08 GMT+0000 (Coordinated Universal Time)",
  //       //     "timeLeft": 177,
  //       //     "timeLeftFancy": "2:49",
  //       //     "timeLeftText": "2:57"
  //       //   },
  //       //   {
  //       //     "key": "na1",
  //       //     "name": "North America",
  //       //     "regionId": 1,
  //       //     "endpoint": "na1.runeevolution.com:8443",
  //       //     "status": "online",
  //       //     "playerCount": 0,
  //       //     "rewardItemAmount": 0,
  //       //     "rewardWinnerAmount": 0.003,
  //       //     "version": "1.6.3",
  //       //     "gameMode": "Reverse Evolve",
  //       //     "roundStartedAt": 1644825734,
  //       //     "roundStartedDate": "Mon Aug 30 2021 20:20:06 GMT+0000 (Coordinated Universal Time)",
  //       //     "timeLeft": 151,
  //       //     "timeLeftFancy": "3:47",
  //       //     "timeLeftText": "2:31"
  //       //   },
  //       //   {
  //       //     "key": "sa1",
  //       //     "name": "South America",
  //       //     "regionId": 1,
  //       //     "endpoint": "sa1.runeevolution.com:8443",
  //       //     "status": "online",
  //       //     "playerCount": 0,
  //       //     "rewardItemAmount": 0.001,
  //       //     "rewardWinnerAmount": 0.003,
  //       //     "version": "1.6.3",
  //       //     "gameMode": "Friendly Reverse",
  //       //     "roundStartedAt": 1644825582,
  //       //     "roundStartedDate": "Mon Aug 30 2021 20:17:58 GMT+0000 (Coordinated Universal Time)",
  //       //     "timeLeft": 0,
  //       //     "timeLeftFancy": "1:39",
  //       //     "timeLeftText": "0:00"
  //       //   },
  //       //   {
  //       //     "key": "asia1",
  //       //     "name": "Asia",
  //       //     "regionId": 1,
  //       //     "endpoint": "asia1.runeevolution.com:8443",
  //       //     "status": "online",
  //       //     "playerCount": 0,
  //       //     "rewardItemAmount": 0,
  //       //     "rewardWinnerAmount": 0.003,
  //       //     "version": "1.6.3",
  //       //     "gameMode": "Orb Master",
  //       //     "roundStartedAt": 1644825810,
  //       //     "roundStartedDate": "Mon Aug 30 2021 20:19:55 GMT+0000 (Coordinated Universal Time)",
  //       //     "timeLeft": 226,
  //       //     "timeLeftFancy": "3:35",
  //       //     "timeLeftText": "3:46"
  //       //   },
  //       //   {
  //       //     "key": "oceanic1",
  //       //     "name": "Oceanic",
  //       //     "regionId": 1,
  //       //     "endpoint": "oceanic1.runeevolution.com:8443",
  //       //     "status": "online",
  //       //     "playerCount": 0,
  //       //     "rewardItemAmount": 0,
  //       //     "rewardWinnerAmount": 0.003,
  //       //     "version": "1.6.3",
  //       //     "gameMode": "Bird Eye",
  //       //     "roundStartedAt": 1644825709,
  //       //     "roundStartedDate": "Mon Aug 30 2021 20:18:35 GMT+0000 (Coordinated Universal Time)",
  //       //     "timeLeft": 198,
  //       //     "timeLeftFancy": "2:13",
  //       //     "timeLeftText": "3:18"
  //       //   },
  //       //   {
  //       //     "key": "ptr1",
  //       //     "name": "Test Realm",
  //       //     "regionId": 1,
  //       //     "endpoint": "ptr1.runeevolution.com",
  //       //     "status": "offline",
  //       //     "playerCount": 0,
  //       //     "rewardItemAmount": 0.002,
  //       //     "rewardWinnerAmount": 0.005,
  //       //     "version": "1.6.3",
  //       //     "gameMode": "Leadercap",
  //       //     "roundId": 37416,
  //       //     "roundStartedAt": 1644300099,
  //       //     "roundStartedDate": "Mon Aug 30 2021 20:16:46 GMT+0000 (Coordinated Universal Time)",
  //       //     "timeLeft": 240,
  //       //     "timeLeftFancy": "0:23",
  //       //     "timeLeftText": "4:00"
  //       //   },
  //       //   {
  //       //     "key": "tournament1",
  //       //     "name": "North America",
  //       //     "regionId": 2,
  //       //     "endpoint": "tournament1.runeevolution.com",
  //       //     "status": "online",
  //       //     "playerCount": 0,
  //       //     "rewardItemAmount": 0,
  //       //     "rewardWinnerAmount": 0,
  //       //     "version": "1.6.3",
  //       //     "gameMode": "Bird Eye",
  //       //     "roundId": 29720,
  //       //     "roundStartedAt": 1644299904,
  //       //     "roundStartedDate": "Mon Aug 30 2021 20:16:46 GMT+0000 (Coordinated Universal Time)",
  //       //     "timeLeft": 45,
  //       //     "timeLeftFancy": "0:23",
  //       //     "timeLeftText": "0:45"
  //       //   }
  //       // ]

  //       // if (isAdmin) {
  //       //   servers.push({
  //       //     key: 'local1',
  //       //     name: 'Local Server',
  //       //     regionId: 1,
  //       //     endpoint: 'localhost:3001', //'sa1.runeevolution.com', // '35.198.19.244:3389', //  'sa1.runeevolution.com', //
  //       //     status: 'online',
  //       //     version: '0.14.0',
  //       //     rewardItemAmount: 0,
  //       //     rewardWinnerAmount: 0,
  //       //     playerCount: 0,
  //       //   })
  //       // }

  //       // servers = servers.filter((s) => s.status === 'online')

  //       // if (
  //       //   window.location.hostname !== 'arken.gg' &&
  //       //   window.location.hostname !== 'beta.arken.gg' &&
  //       //   window.location.hostname !== 'localhost'
  //       // ) {
  //       //   servers = servers.filter((s) => s.name === 'Test Realm')
  //       // }
  //       if (brand.host === 'evo2.io') {
  //         servers = servers.filter((s) => s.name === 'North America')
  //       }

  //       servers = servers.filter((s) => s.status === 'online' || s.status === 'offline')

  //       setRealms(servers)
  //       setRealm(servers[tab])

  //       // const rand = Math.floor(Math.random() * Math.floor(999999))
  //       // const response = await fetch(`https://s1.envoy.arken.asi.sh/evolution/rewardHistory.json?${rand}`)
  //       // const responseData = await response.json()

  //       // const rewardsData = responseData.filter((r) => r.winner.address === account)

  //       // setRewards(rewardsData)
  //     }

  //     init()

  //     // const inter = setInterval(init, 1 * 60 * 1000)

  //     // return () => {
  //     //   clearInterval(inter)
  //     // }
  //   },
  //   [isAdmin, open, tab, brand, setRealms, setRealm],
  // )

  useEffect(
    function () {
      if (!account) return;
      if (!window) return;

      async function init() {
        try {
          // const account2 = '0x0d835cEa2c866B2be91E82e0b5FBfE6f64eD14cd' // pet account on asia1
          // const account2 = '0xa6d1e757cE8de4341371a8e225f0bBB417D47E31' // rune account on asia1
          const response = await fetch(`${endpoints.cache}/users/${account}/overview.json`);
          const responseData = await response.json();

          if (responseData) {
            setPlayerRewards(responseData.rewards?.runes || {});
            setRewards(responseData.rewards?.items || {});
          }
        } catch (e) {
          console.log(e);
          setPlayerRewards({});
          setRewards({});
        }
      }

      init();

      const inter = setInterval(init, 1 * 60 * 1000);

      return () => {
        clearInterval(inter);
      };
    },
    [account]
  );

  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;

  config.isMobile = isMobile;

  const startOldGame = async () => {
    unityInstance = new UnityContext({
      loaderUrl: '/Build/RuneEvolutionAlpha/RuneEvolution.loader.js',
      dataUrl: '/Build/RuneEvolutionAlpha/RuneEvolution.data',
      frameworkUrl: '/Build/RuneEvolutionAlpha/RuneEvolution.framework.js',
      codeUrl: '/Build/RuneEvolutionAlpha/RuneEvolution.wasm',
      webglContextAttributes: {
        alpha: false,
        depth: false,
        stencil: false, // also interesting to test 'false'
        antialias: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
        desynchronized: false,
      },
    });

    // @ts-ignore
    window.unityInstance = unityInstance;

    startGame();
  };

  const startNewGame = async () => {
    unityInstance = new UnityContext({
      loaderUrl: '/Build/RuneEvolution/RuneEvolution.loader.js',
      dataUrl: '/Build/RuneEvolution/RuneEvolution.data',
      frameworkUrl: '/Build/RuneEvolution/RuneEvolution.framework.js',
      codeUrl: '/Build/RuneEvolution/RuneEvolution.wasm',
      webglContextAttributes: {
        alpha: false,
        depth: false,
        stencil: false, // also interesting to test 'false'
        antialias: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
        desynchronized: false,
      },
    });

    // @ts-ignore
    window.unityInstance = unityInstance;

    startGame();
  };

  const startGame = async () => {
    let sig = signature;
    if (!sig) {
      sig = (await getSignature('evolution')).hash;
      setSignature(sig);
    }

    // window.mixpanel && window.mixpanel.track("Evolution: Start Game")

    document.body.classList.add(`override-bad-quality`);

    setIsGameStarted(true);

    gameInitialized = true;

    clearInterval(focusInterval);
    focusInterval = setInterval(() => {
      if (!document.hasFocus() && !isAdmin) {
        // if (socket) {
        //   socket.disconnect()
        //   socket = null
        //   window.location.reload()
        // }
        // loadingGame = false
      }
    }, 1 * 1000);

    document.addEventListener('keyup', (event) => {
      if (event.code === 'Space') {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
      }
    });

    // @ts-ignore
    window.socket = {
      on: (...args) => {
        log('socket.on', !!socket, args);

        if (socket)
          socket.on(args[0], function (...args2) {
            if (
              logCommonEvents ||
              (args[0] !== 'OnUpdatePickup' && args[0] !== 'OnUpdateMyself' && args[0] !== 'OnUpdatePlayer')
            ) {
              log('socket.on called', !!socket, args[0], args2);
            }

            args[1](...args2);
          });
      },
      emit: (...args) => {
        if (logCommonEvents || (args[0] !== 'UpdateMyself' && args[0] !== 'Pickup')) {
          log('socket.emit', !!socket, args);
        }

        if (args[0] === 'Load' && loadingGame) return;

        if (args[0] === 'Load') {
          loadingGame = true;

          if (socket) {
            socket.disconnect();
            socket = null;
          }

          socket = getSocket('https://' + realm.endpoint);

          const OnLoaded = () => {
            log('Loaded');
            sendUserInfo(config.username, config.address, config.isMobile, sig);
            // unityInstance.send('NetworkManager', 'OnReadyToJoinGame')
            setLoaded(true);
          };

          const onBroadcast = (msg) => {
            setBroadcast(msg);
          };

          const onMaintenance = (msg) => {
            if (isAdmin) return;
            setMaintenance(msg);
          };

          const OnBanned = (msg) => {
            setBanned(msg);
          };

          socket.on('Events', function (msg) {
            // const bufView = new Uint8Array(msg);
            // console.log(msg, bufView)

            // @ts-ignore
            let json = String.fromCharCode.apply(null, new Uint8Array(msg));
            try {
              // explicitly decode the String as UTF-8 for Unicode
              //   https://github.com/mathiasbynens/utf8.js
              json = utf8.decode(json);
              const events = JSON.parse(json);

              for (const event of events) {
                const eventName = event[0];

                if (
                  logCommonEvents ||
                  (eventName !== 'OnUpdatePickup' && eventName !== 'OnUpdateMyself' && eventName !== 'OnUpdatePlayer')
                ) {
                  log('Event', event);
                }

                if (eventName === 'OnLoaded') {
                  OnLoaded();
                  continue;
                } else if (eventName === 'onMaintenance') {
                  onMaintenance(event.slice(1));
                  continue;
                } else if (eventName === 'OnBanned') {
                  OnBanned(event.slice(1));
                  continue;
                } else if (eventName === 'OnClearLeaderboard') {
                  // const playerId = event[1].split(':')[0]
                  // setUsers((u) => {
                  //   if (!u.includes(playerId)) return [...u, playerId]
                  //   return u
                  // })
                  // @ts-ignore
                  // setTimeout(() => unityInstance.send('OnClearLeaderboard', ...event), 10*1000)
                  // continue
                } else if (eventName === 'onUpdateBestPlayer') {
                  // const playerId = event[1].split(':')[0]
                  // setUsers((u) => {
                  //   if (!u.includes(playerId)) return [...u, playerId]
                  //   return u
                  // })
                  // @ts-ignore
                  // setTimeout(() => unityInstance.send('NetworkManager', ...event))
                  // continue
                } else if (eventName === 'OnJoinGame') {
                  currentPlayerId = event[1].split(':')[0];

                  // sendUserInfo(config.username, config.address, config.isMobile, signature)

                  loadingGame = false;
                } else if (eventName === 'OnSpawnPlayer') {
                  userIdToName[event[1].split(':')[0]] = event[1].split(':')[1];
                } else if (eventName === 'OnSetInfo') {
                  userIdToName[event[1].split(':')[0]] = event[1].split(':')[1];
                } else if (eventName === 'OnGameOver' || eventName === 'OnUserDisconnected') {
                  const playerId = event[1].split(':')[0];
                  if (playerId === currentPlayerId) {
                    if (userIdToName[event[1].split(':')[1]]) {
                      toastInfo('You were killed by ' + userIdToName[event[1].split(':')[1]]);
                    } else {
                      toastInfo('You died');
                    }

                    socket.disconnect();
                    socket = null;
                    loadingGame = false;
                    setUsers([]);

                    if (breakCountdown <= 0) {
                      onPresentBreakModal();
                      breakCountdown = breakCountdownAmount;
                      breakCountdownTime = Math.round(Date.now() / 1000);
                    }
                  }
                } else if (eventName === 'OnSetRoundInfo') {
                  // toastInfo('Game mode is now ' + event[1].split(':')[22])
                } else if (!loadingGame && eventName === 'OnUpdatePlayer') {
                  if (!assumedTimeDiff) {
                    assumedTimeDiffList.push(new Date().getTime() - parseInt(event[1].split(':')[8]));
                    if (assumedTimeDiffList.length >= 50) {
                      assumedTimeDiff = average(assumedTimeDiffList);
                    }
                    // console.log('assumed', assumedTimeDiff, assumedTimeDiffList)
                    // Ignore 500ms old messages
                    // @ts-ignore
                  }
                  // console.log(new Date().getTime(), parseInt(event[1].split(':')[8]) - assumedTimeDiff, new Date().getTime() - parseInt(event[1].split(':')[8]) - assumedTimeDiff, new Date().getTime() - parseInt(event[1].split(':')[8]) - assumedTimeDiff > 0, new Date().getTime() - parseInt(event[1].split(':')[8]) - assumedTimeDiff > 1000)
                  // if (
                  //   assumedTimeDiff !== 0 &&
                  //   new Date().getTime() - parseInt(event[1].split(':')[8]) - assumedTimeDiff > 500
                  // ) {
                  //   continue
                  // }
                }

                // @ts-ignore
                unityInstance.send('NetworkManager', ...event);
              }
            } catch (err) {
              // ...
              console.log(err);
              console.log(json);
            }
          });

          unityInstance.send('NetworkManager', 'OnWebInit', account + ':' + sig);
        }

        if (socket) socket.emit(...args);
      },
    };

    unityInstance.on('canvas', function (canvas) {
      if (canvas) {
        if (isMobile) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        } else {
          canvas.width = window.innerWidth - 40;
        }

        canvas.height = window.innerHeight - 104;

        canvas.tabIndex = 1;
        canvas.setAttribute('id', 'unityCanvas');
        window.scrollTo(0, 0);

        gameCanvas = canvas;

        // if (isMobile) {
        document.body.appendChild(canvas);
        document.getElementById('root').style.display = 'none';
        // }

        window.addEventListener(
          'resize',
          function () {
            if (isMobile) {
              gameCanvas.width = window.innerWidth;
              gameCanvas.height = window.innerHeight;
            } else {
              gameCanvas.width = window.innerWidth - 40;
            }
            gameCanvas.height = window.innerHeight - 104;
            window.scrollTo(0, 0);
          },
          true
        );
      }
    });

    unityInstance.on('error', function (message) {
      setDidError(true);
      setErrorMessage(message);
    });

    unityInstance.on('progress', function (p) {
      setProgression(p);

      if (p === 1) {
        unityInstance.send('NetworkManager', 'Connect');
      }
    });
  };

  originalAlert = window.alert;

  // window.alert = function () {
  //   console.log('Trying again')
  //   // unityInstance = new UnityContext({
  //   //   loaderUrl: 'Build/RuneEvolution/RuneEvolution.loader.js',
  //   //   dataUrl: 'Build/RuneEvolution/RuneEvolution.data',
  //   //   frameworkUrl: 'Build/RuneEvolution/RuneEvolution.framework.js',
  //   //   codeUrl: 'Build/RuneEvolution/RuneEvolution.wasm',
  //   // })
  //   window.location.reload()
  // }

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

  const updateTab = (val) => {
    updateHistory('realm', val);
    setTab(val);
  };

  const addLocalRealm = () => {
    setIsAdmin(true);
  };

  const updateRealm = (r) => {
    if (!r) return;
    setRealm(r);
    updateTab(realms.findIndex((t3) => t3.key === r.key));
  };

  const hideGame = () => {
    if (isGameStarted && !isGameHidden) {
      // var binaryString = ToBinary(ConvertToByteArray(data.ToString(), Encoding.ASCII));

      if (!isGamePaused) {
        // @ts-ignore
        // window.socket.emit('Spectate')
      }

      gameRef.current.htmlCanvasElementReference.style.display = 'none';

      setIsGameHidden(true);
    }
  };

  const showGame = () => {
    if (!isGamePaused) {
      loadingGame = false;

      // @ts-ignore
      // window.socket.emit('Load')
    }

    gameRef.current.htmlCanvasElementReference.style.display = 'block';

    setIsGameHidden(false);
  };

  let totalRewardValue = 0;

  Object.keys(playerRewards).forEach((id) => {
    if (id === 'usd') totalRewardValue += playerRewards[id] ? playerRewards[id] : 0;
    else totalRewardValue += playerRewards[id] ? playerRewards[id] : 0;
  });

  // if (didError === true) return <div>Oops, that's an error {errorMessage}</div>

  const now = new Date().getTime() / 1000;
  // if (cache.overview[account]) {
  //   cache.overview[account].isBanned  = true
  // cache.overview[account].banExpireDate = 1630783494
  // }
  return cache.overview[account]?.isBanned && cache.overview[account]?.banExpireDate > now ? (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" p="20px">
      <MainCard>
        You have been restricted from playing Arken games. Time remaining:{' '}
        {formatDistance(new Date(), new Date().setTime(cache.overview[account]?.banExpireDate * 1000), {
          addSuffix: true,
        })}
      </MainCard>
    </Flex>
  ) : (
    <div>
      <GlobalStyles />
      {!isGameStarted || isGameHidden ? (
        <>
          {isMobile ? (
            <Flex flexDirection="column" alignItems="center" justifyContent="center" style={{ margin: '0 auto' }}>
              <LogoImg
                src="/images/rune-500x500.png"
                css={css`
                  max-width: 200px;
                  margin-top: 30px;
                `}
              />
              <Heading
                as="h1"
                size="xxl"
                mt="20px"
                mb="20px"
                style={{
                  textAlign: 'center',
                  filter: 'drop-shadow(2px 4px 6px black)',
                  display: 'flex',
                  textShadow: '0px 0px 1px #000',
                  color: '#c8c7cd',
                }}>
                {t('Rune')}
              </Heading>
              <br />
              <br />
              {settings.isCrypto ? (
                <>
                  <Button
                    as={RouterLink}
                    to="/account"
                    style={{ zoom: 1.5, padding: '6px 20px', textAlign: 'center' }}
                    onClick={() => {
                      window.scrollTo(0, 0);
                    }}>
                    {t('Digital Purchase')}
                  </Button>
                  <br />
                  <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                    <Button
                      as={RouterLink}
                      to="/cube"
                      style={{ zoom: 1, padding: '6px 20px', textAlign: 'center', background: '#222' }}
                      onClick={() => {
                        window.scrollTo(0, 0);
                      }}>
                      {t("Founder's Edition")}
                    </Button>
                  </Flex>
                </>
              ) : null}
            </Flex>
          ) : (
            <div
              css={css`
                border-width: 8px;
                border-style: solid;
                border-color: transparent;
                border-image: url(/images/frame.png) 80 / 80px / 0 repeat;
                border-radius: 0px;
                background: #000;
              `}>
              <div
                css={css`
                  position: relative;
                  height: calc(100vh - 118px);
                  width: 100%;
                  overflow: hidden;
                `}>
                <div
                  css={css`
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    opacity: 0.9;
                  `}>
                  <video
                    src="https://storage.googleapis.com/runepublic/Videos/Rune%20Evolution%20-%20Trailer%20-%2016-9_3.mp4"
                    autoPlay
                    loop
                    muted
                    css={css`
                      position: absolute;
                      top: 0;
                      bottom: 0;
                      right: 0;
                      left: 0;
                      margin: auto;
                      min-height: 50%;
                      min-width: 50%;
                    `}></video>
                </div>

                <div
                  css={css`
                    position: absolute;
                    bottom: 60px;
                    left: 0;
                    text-align: center;
                    width: 100%;
                  `}>
                  <Flex flexDirection="column" alignItems="center" justifyContent="center" style={{ margin: '0 auto' }}>
                    {/* <Heading
                      as="h1"
                      size="xxl"
                      mt="20px"
                      mb="20px"
                      style={{
                        textAlign: 'center',
                        filter: 'drop-shadow(2px 4px 6px black)',
                        display: 'flex',
                        textShadow: '0px 0px 6px #000',
                        color: '#c8c7cd',
                      }}
                    >
                      <LogoImg src="/images/rune-500x500.png" style={{ width: 65, height: 65, marginRight: '15px' }} />{' '}
                      {t('Arken: Evolution Isles')}
                    </Heading> */}
                    <br />
                    <br />
                    {settings.isCrypto ? (
                      <>
                        <Button
                          as={RouterLink}
                          to="/account"
                          style={{ zoom: 1.5, padding: '6px 20px', textAlign: 'center' }}
                          onClick={() => {
                            window.scrollTo(0, 0);
                          }}>
                          {t('Digital Purchase')}
                        </Button>
                        <br />
                        <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                          <Button
                            as={RouterLink}
                            to="/cube"
                            style={{ zoom: 1, padding: '6px 20px', textAlign: 'center', background: '#222' }}
                            onClick={() => {
                              window.scrollTo(0, 0);
                            }}>
                            {t("Founder's Edition")}
                          </Button>
                        </Flex>
                      </>
                    ) : null}
                  </Flex>
                </div>
              </div>
            </div>
          )}
          <Page>
            {/* <Flex
              flexDirection="column"
              alignItems="center"
              mb="8px"
              justifyContent="start"
              style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}
            >
              <BoxHeading as="h2" size="xl">
                {t('Launch Trailer')}
              </BoxHeading>
              <br />
              <iframe
                src="https://www.youtube.com/embed/2l4BXB827D0"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', height: '100%', top: 0, left: 0, position: 'absolute' }}
              ></iframe>
            </Flex>
            <br />
            <br /> */}
            <Card>
              <BoxHeading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
                {t('Download Now')}
              </BoxHeading>
              <hr />
              <CardBody>
                <Flex flexDirection={isMobile ? 'column' : 'row'} alignItems="center" justifyContent="space-between">
                  <Button as={RouterLink} scale="md" to="/download/evolution" style={{ zoom: 1.2, marginBottom: 10 }}>
                    {t('Mac')}
                  </Button>
                  <Button as={RouterLink} scale="md" to="/download/evolution" style={{ zoom: 1.2, marginBottom: 10 }}>
                    {t('Windows')}
                  </Button>
                  <Button as={RouterLink} scale="md" to="/download/evolution" style={{ zoom: 1.2, marginBottom: 10 }}>
                    {t('Android')}
                  </Button>
                </Flex>
              </CardBody>
            </Card>
            <br />
            <Cards>
              <MainCard>
                <Heading color="contrast" size="lg" style={{ textAlign: 'center', marginTop: 20 }}>
                  Quick Links
                  {/* <br />
                        <span style={{ fontSize: '0.9rem', opacity: '0.8' }}>(Optional)</span> */}
                </Heading>
                <br />
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <Flex flexDirection="column" alignItems="center" justifyContent="center">
                    <Button
                      variant="text"
                      as={Link}
                      href="https://arken.gg/evolution/tutorial"
                      target="_blank"
                      style={{ color: '#bb955e', padding: '6px 20px', textAlign: 'center' }}>
                      {t('Tutorial')}
                      <OpenNewIcon ml="4px" />
                    </Button>
                  </Flex>
                  <Flex flexDirection="column" alignItems="center" justifyContent="center">
                    <Button
                      variant="text"
                      as={Link}
                      href="https://youtu.be/cejd-7BDVYg"
                      target="_blank"
                      style={{ color: '#bb955e', padding: '6px 20px', textAlign: 'center' }}>
                      {t('Video Guide')}
                      <OpenNewIcon ml="4px" />
                    </Button>
                  </Flex>
                  <Flex flexDirection="column" alignItems="center" justifyContent="center">
                    <Button
                      variant="text"
                      as={Link}
                      href="https://t.me/ArkenRealms"
                      target="_blank"
                      style={{ color: '#bb955e', padding: '6px 20px', textAlign: 'center' }}>
                      {t('Announcements')}
                      <OpenNewIcon ml="4px" />
                    </Button>
                  </Flex>
                  <Flex flexDirection="column" alignItems="center" justifyContent="center">
                    <Button
                      variant="text"
                      as={Link}
                      href="https://t.me/runereports"
                      target="_blank"
                      style={{ color: '#bb955e', padding: '6px 20px', textAlign: 'center' }}>
                      {t('Report Bugs')}
                      <OpenNewIcon ml="4px" />
                    </Button>
                  </Flex>
                  <Flex flexDirection="column" alignItems="center" justifyContent="center">
                    <Button
                      variant="text"
                      as={Link}
                      href="https://arken.gg/sign?message=evolution"
                      target="_blank"
                      style={{ color: '#bb955e', padding: '6px 20px', textAlign: 'center' }}>
                      {t('Mobile Login')}
                      <OpenNewIcon ml="4px" />
                    </Button>
                  </Flex>
                </Flex>
              </MainCard>
              <MainCard style={{ position: 'relative' }}>
                <Flex flexDirection="column" alignItems="center" justifyContent="start" style={{ minHeight: 400 }}>
                  <Heading color="contrast" size="lg" style={{ textAlign: 'center', marginTop: 20 }}>
                    Play Web
                    {/* <br />
                        <span style={{ fontSize: '0.9rem', opacity: '0.8' }}>(Optional)</span> */}
                  </Heading>
                  <br />
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
                                {t(r.name)} {r.regionId}
                                {(!realm || (realm.key === r.key && !isServerOffline) || realm.key !== r.key) &&
                                r.status === 'online'
                                  ? ` (${r.playerCount} online)`
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
                </Flex>
                <div
                  css={css`
                    position: absolute;
                    bottom: 20px;
                    left: 0;
                    text-align: center;
                    width: 100%;
                  `}>
                  {/* {!account || !profile?.nft ? (
                    <>
                      <p>
                        You aren't on BSC network and don't have an account yet.
                      </p>
                      <br />
                      <Button
                        scale="sm"
                        as={RouterLink}
                        to="/account"
                        onClick={() => {
                          window.scrollTo(0, 0);
                        }}>
                        Create Account
                      </Button>
                    </>
                  ) : null} */}
                  <HeadingFire fireStrength={1} color1="#fd3" color2="#ff3" color3="#f80" color4="#f20">
                    <SpecialButton title="TEST GAME" onClick={startOldGame} />
                  </HeadingFire>
                  {/* {account && realm && profile?.nft ? (
                    <Flex flexDirection="column" alignItems="center" justifyContent="center">
                      <HeadingFire fireStrength={1} color1="#fd3" color2="#ff3" color3="#f80" color4="#f20">
                        <SpecialButton title="Start Game" onClick={startOldGame} />
                      </HeadingFire>
                      {account && realm ? (
                        <p style={{ fontSize: '0.9em' }}>
                          <Button
                            scale="sm"
                            variant="text"
                            onClick={startNewGame}
                            css={css`
                              color: #fff;
                              padding: 5px;
                              margin-top: 10px;
                              font-weight: normal;
                              border-radius: 5px;
                              border: 1px solid #fff;
                              opacity: 0.5;
                              &:hover {
                                opacity: 1;
                              }
                            `}>
                            {t('Use High Quality')}
                          </Button>
                        </p>
                      ) : null}
                    </Flex>
                  ) : null} */}
                </div>
              </MainCard>
              <MainCard>
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <Heading color="contrast" size="lg" style={{ textAlign: 'center', marginTop: 20 }}>
                    Round Rewards
                  </Heading>
                  <br />
                  {cache.evolution?.config ? (
                    <div style={{ textAlign: 'left' }}>
                      <strong>Now:</strong> {cache.evolution?.config.rewardWinnerAmountPerLegitPlayer} ZOD per player (
                      {cache.evolution?.config.rewardWinnerAmountMax} ZOD max)
                      <br />
                      <strong>Next Week:</strong>{' '}
                      {cache.evolution?.config.rewardWinnerAmountPerLegitPlayerQueued ||
                        cache.evolution?.config.rewardWinnerAmountPerLegitPlayer}{' '}
                      ZOD per player
                    </div>
                  ) : null}
                  <br />
                  Rewards increase with more players, so tell your friends!
                  <br />
                  <br />
                  <Heading color="contrast" size="md" style={{ textAlign: 'center', marginTop: 20 }}>
                    Your Rewards
                  </Heading>
                  <br />
                  {/* {!profile?.nft ? (
                    <>
                      <br />
                      <br />
                      <p
                        style={{
                          textAlign: 'left',
                          fontWeight: 'normal',
                          fontFamily: 'Cambria, Verdana, Arial, Helvetica, sans-serif',
                          textTransform: 'none',
                          fontSize: '0.9rem',
                        }}>
                        You cannot claim rewards until you have created a Rune account.
                      </p>
                      <br />
                      <br />
                      <Button
                        scale="sm"
                        as={RouterLink}
                        to="/account"
                        onClick={() => {
                          window.scrollTo(0, 0);
                        }}>
                        Create Account
                      </Button>
                    </>
                  ) : (
                    <>
                      {Object.keys(playerRewards).filter((id) => playerRewards[id] > 0).length ? (
                        Object.keys(playerRewards).map((id) => {
                          if (!playerRewards[id]) return null;

                          return (
                            <div key={id}>
                              {(playerRewards[id] > 0 ? playerRewards[id] : 0).toFixed(3)} {id} <br />
                            </div>
                          );
                        })
                      ) : (
                        <>None yet, get out there!</>
                      )}
                      <br />
                      <br />
                      <Button as={RouterLink} to="/account/rewards">
                        Reward Centre
                      </Button>
                    </>
                  )} */}
                </Flex>
              </MainCard>
            </Cards>
            <Card style={{ overflow: 'visible' }}>
              <CardBody>
                <SeasonRankings />
                <br />
                <br />
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <Button
                    as={RouterLink}
                    variant="text"
                    to="/leaderboard"
                    style={{ border: '2px solid #bb955e', color: '#bb955e' }}>
                    View Full Leaderboard
                  </Button>
                </Flex>
              </CardBody>
            </Card>
            <br />
            <Card>
              <CardBody>
                {!isMobile ? (
                  <img
                    src="/images/dragons.png"
                    alt="Evolve Your Dragon"
                    css={css`
                      float: right;
                      width: 280px;
                      margin-top: -20px;
                    `}></img>
                ) : null}
                <BoxHeading as="h2" size="xl">
                  {t('Evolve Your Dragon')}
                </BoxHeading>
                <hr />
                <br />
                <p>
                  Battle for victory of the skies in a 5 minute round. You must track down and eat as many sprites as
                  you can to evolve your dragon and defeat other dragons. Watch out though, each game mode provides a
                  different challenge.
                </p>
                <br />
                {settings.isCrypto ? (
                  <Paragraph>
                    Using your hero's magical abilities, you can buff your dragon while you play Arken: Evolution Isles.
                    Equip NFTs to see the effects in-game. Currently supported item mechanics:
                    <br />
                    <ul>
                      <li>
                        <Linker id="evolution-1" defaultItemBranch="2">
                          Win Reward Bonus Titan Hellfire Beacon Elder Pledge
                        </Linker>
                      </li>
                      <li>
                        <Linker id="evolution-2" defaultItemBranch="2">
                          Movement Burst On Kill (5 seconds) Steel Eternity Fury Flash Glory Grace Instinct
                        </Linker>
                      </li>
                      <li>
                        <Linker id="evolution-3" defaultItemBranch="2">
                          Movement Burst On Evolve (1 second) Flash
                        </Linker>
                      </li>
                      <li>
                        <Linker id="evolution-4" defaultItemBranch="2">
                          Movement Burst Strength Guiding Light Wrath Fortress Flow Flash
                        </Linker>
                      </li>
                      <li>
                        <Linker id="evolution-5" defaultItemBranch="2">
                          Avoid Death Penalty (point loss / orb) Flow Luminous Flywings Lorekeeper Smoke Beacon
                        </Linker>
                      </li>
                      <li>
                        <Linker id="evolution-6" defaultItemBranch="2">
                          Double Pickup Chance Beacon
                        </Linker>
                      </li>
                      <li>
                        <Linker id="evolution-7" defaultItemBranch="2">
                          Increase Health On Kill Titan Lionheart Hellfire
                        </Linker>
                      </li>
                      <li>More coming soon!</li>
                    </ul>
                  </Paragraph>
                ) : null}
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
              <br />
              <br />
              <br />
              <br />
              {settings.isCrypto ? (
                <CardBody>
                  {!isMobile ? (
                    <img
                      src="/images/cube-preview.png"
                      alt="Win Tokens & NFTs"
                      css={css`
                        float: left;
                        width: 280px;
                        margin-top: -20px;
                      `}></img>
                  ) : null}
                  <BoxHeading as="h2" size="xl">
                    {t('Win Tokens & NFTs')}
                  </BoxHeading>
                  <hr />
                  <br />
                  <Paragraph>
                    Battling angels and demons requires a hero.{' '}
                    <Linker id="evolution-classes">
                      Choose a hero from one of seven classes: Assassin, Warrior, Druid, Necromancer, Ranger, Mage, or
                      Paladin
                    </Linker>
                  </Paragraph>
                  <br />
                  <p>
                    We have incorporated blockchain gaming so your hero is a unique NFT, and you control their destiny.
                    Take your hero into different games, join a guild with friends, and choose a gaming strategy that is
                    unique to you and your hero.
                  </p>
                  <br />
                  <br />
                  {/* <p>
                    {t(
                      `You can start building your character right away. Choose from 1 of 7 classes, join a guild, and raid farms to start earning runes instantly.`,
                    )}
                  </p> */}
                  {isMobile ? (
                    <img
                      src="/images/cube-preview.png"
                      alt="Win Tokens & NFTs"
                      css={css`
                        width: 240px;
                      `}></img>
                  ) : null}
                  {!isMobile ? (
                    <>
                      <br />
                      <br />
                    </>
                  ) : null}
                </CardBody>
              ) : null}
            </Card>
            <br />
            <br />
            <br />
          </Page>
        </>
      ) : null}
      {maintenance ? (
        <StyledNotFound>
          <Heading size="xxl">Offline. Under Maintenance.</Heading>
        </StyledNotFound>
      ) : null}
      {/* {banned ? (
        <StyledNotFound>
          <Heading size="lg" style={{ textAlign: 'center' }}>
            You've been banned. Do not play any servers.
            <br />
            <br />
            Contact @RuneReports in Telegram if you feel it's unwarranted.
          </Heading>
        </StyledNotFound>
      ) : null} */}
      {isGameStarted && !maintenance && !banned ? (
        <Page style={{ padding: 0, maxWidth: 'none' }}>
          {progression !== 1 ? (
            <StyledNotFound>
              <Heading size="xxl">{(progression * 100).toFixed(0)}%</Heading>
            </StyledNotFound>
          ) : null}
          {/* @ts-ignore */}
          <Unity
            ref={gameRef}
            unityContext={unityInstance}
            // matchWebGLToCanvasSize={false}
            style={{ width: progression === 1 ? '100%' : '0%', height: progression === 1 ? '100%' : '0%' }}
          />
        </Page>
      ) : null}
    </div>
  );
};

export default Evolution;
