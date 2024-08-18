import React, { useCallback, useEffect, useState, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Heading, Text, BaseLayout, Button, Card, Flex } from '~/ui';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import { BsArrowsFullscreen } from 'react-icons/bs';
import Unity, { UnityContext } from 'react-unity-webgl';
import useWeb3 from '~/hooks/useWeb3';
import queryString from 'query-string';
import { ConnectNetwork } from '~/components/ConnectNetwork';
import { Link as RouterLink, NavLink, useLocation, useNavigate } from 'react-router-dom';

const unityInstance = new UnityContext({
  loaderUrl: '/Build/RuneEvolution/RuneEvolution.loader.js',
  dataUrl: '/Build/RuneEvolution/RuneEvolution.data',
  frameworkUrl: '/Build/RuneEvolution/RuneEvolution.framework.js',
  codeUrl: '/Build/RuneEvolution/RuneEvolution.wasm',
});

// @ts-ignore
window.unityInstance = unityInstance;

// @ts-ignore
window.unityBridge = {
  name: 'Loading',
};

let socket;

const testMode = false;
const logCommonEvents = testMode;
let gameInitialized = false;
let currentPlayerId;
const debug = true; // process.env.NODE_ENV !== 'production'
let loadingGame = false;

const Cards = styled(BaseLayout)`
  align-items: flex-start;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;
const VerticalCards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  width: calc(100% - 40px);
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 20px;
    & > div {
      max-width: 500px;
      margin: 0 auto;
    }
  }

  & > div {
    grid-column: span 12;
    width: 100%;
    background-image: url(/images/background.jpeg);
    background-size: 400px;
  }
`;
const VerticalCards2 = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  width: calc(100% - 40px);
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 20px;
    & > div {
      max-width: 600px;
      margin: 0 auto;
    }
  }

  & > div {
    grid-column: span 12;
    width: 100%;
    background-image: url(/images/background.jpeg);
    background-size: 400px;
  }
`;

const AppToolbar = styled.div<{ showMenu: boolean }>`
  border-bottom: solid 2px rgba(133, 133, 133, 0.1);
  padding: 0px 5px 0px 20px;
  height: ${({ showMenu }) => (showMenu ? '90px' : '40px')};
  line-height: 40px;

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

const MainCard = styled(Card)`
  position: relative;
  font-weight: bold;
  border-width: 40px 40px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 140 repeat;
  background: none;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  text-align: center;
  background: #000;
  color: #bb955e;
  text-shadow: 1px 1px 1px black;
  font-weight: bold;
`;

const log = (...args) => {
  if (debug) console.log(...args);
};

const sendUserInfo = (username, address, isMobile) => {
  const network = 'bsc';
  const pack = username + ':' + network + ':' + address + ':' + (isMobile ? 'mobile' : 'desktop');
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

let gameCanvas;

const config = {
  username: 'Guest' + Math.floor(Math.random() * 999),
  address: '0xc84ce216fef4EC8957bD0Fb966Bb3c3E2c938082',
  isMobile: false,
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
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const userIdToName = {};

let replayData = null;

const Evolution: React.FC<any> = ({ match }) => {
  const location = useLocation();
  const { realmKey, roundId }: { realmKey: string; roundId: string } = match.params;
  // const match = parseMatch(location)
  const [progression, setProgression] = useState(0);
  const { account, library } = useWeb3();
  const { web3 } = useWeb3();
  const gameRef = useRef(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameHidden, setIsGameHidden] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [banned, setBanned] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;

  config.isMobile = isMobile;

  const startGame = useCallback(() => {
    document.body.classList.add(`override-bad-quality`);

    setIsGameStarted(true);

    gameInitialized = true;

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

          const OnLoad = async () => {
            const res2 = (await (
              await fetch(`https://${realmKey}.runeevolution.com/data/rounds/${roundId}.json`)
            ).json()) as any;

            replayData = res2;

            log('Replay loaded');

            // setStartReplay(true)
            const realCurrentPlayerId = 'qUcc5CvuMEoJmoOiAAD6';
            let timeout = 0;

            for (const eventData of replayData.events) {
              const event = [eventData.name, eventData.args.join(':')];
              const eventName = event[0];

              if (eventName === 'OnJoinGame') {
                if (!currentPlayerId) {
                  currentPlayerId = event[1].split(':')[0];

                  unityInstance.send('NetworkManager', 'onSetPositionMonitor', '40:60:60');
                  await sleep(1);
                  unityInstance.send(
                    'NetworkManager',
                    'OnJoinGame',
                    'qUcc5CvuMEoJmoOiAAD6:Guest420:0:false:600:-12.6602:-10.33721'
                  );
                  // unityInstance.send('NetworkManager', 'OnSetInfo', 'qUcc5CvuMEoJmoOiAAD6:Guest420:::')
                  await sleep(1);
                  unityInstance.send('NetworkManager', 'OnSpectate', 'qUcc5CvuMEoJmoOiAAD6:3:6');

                  // unityInstance.send('NetworkManager', 'onSetPositionMonitor', '40:60:60')
                  // sendUserInfo(config.username, config.address, config.isMobile)

                  loadingGame = false;
                }
              }

              if (eventData.type !== 'emitAll') {
                if (eventData.player === currentPlayerId) {
                  if (
                    eventName === 'OnSetRoundInfo' ||
                    eventName === 'OnOpenLevel2' ||
                    eventName === 'OnSpawnPlayer' ||
                    eventName === 'OnSpawnPowerUp'
                  ) {
                    // @ts-ignore
                    unityInstance.send('NetworkManager', ...event);
                  }
                }
                continue;
              }

              if (
                logCommonEvents ||
                (eventName !== 'OnUpdatePickup' && eventName !== 'OnUpdateMyself' && eventName !== 'OnUpdatePlayer')
              ) {
                log(`Event [${eventData.type}]`, event);
              }

              if (eventName === 'OnLoaded') {
                // OnLoaded()
                continue;
              } else if (eventName === 'onBroadcast') {
                console.log(event);
                continue;
              } else if (eventName === 'OnClaimStatus') {
                continue;
              } else if (eventName === 'onMaintenance') {
                continue;
              } else if (eventName === 'OnBanned') {
                continue;
              } else if (eventName === 'onSetPositionMonitor') {
                // unityInstance.send('NetworkManager', 'onSetPositionMonitor', '40:60:60')
                continue;
              } else if (eventName === 'OnSpawnPlayer') {
                // if (currentPlayerId === event[1].split(':')[0]) continue

                userIdToName[event[1].split(':')[0]] = event[1].split(':')[1];
              } else if (eventName === 'OnSetInfo') {
                userIdToName[event[1].split(':')[0]] = event[1].split(':')[1];
              } else if (eventName === 'OnGameOver' || eventName === 'OnUserDisconnected') {
                const playerId = event[1].split(':')[0];
                if (playerId === currentPlayerId) {
                  if (userIdToName[event[1].split(':')[1]]) {
                    //   toastInfo('You were killed by ' + userIdToName[event[1].split(':')[1]])
                  } else {
                    //   toastInfo('You died')
                  }

                  // currentPlayerId = null
                }
              } else if (eventName === 'OnSetRoundInfo') {
                // toastInfo('Game mode is now ' + event[1].split(':')[22])
              }

              setTimeout(() => {
                // @ts-ignore
                unityInstance.send('NetworkManager', ...event);
              }, (timeout += 5));

              // await sleep(0)
            }

            setLoaded(true);
          };

          OnLoad();
        }

        if (socket) socket.emit(...args);
      },
    };

    unityInstance.on('canvas', function (canvas) {
      if (canvas) {
        if (isMobile) {
          canvas.width = window.innerWidth;
        } else {
          canvas.width = window.innerWidth - 40;
        }

        canvas.height = window.innerHeight - 104;

        canvas.tabIndex = 1;
        canvas.setAttribute('id', 'unityCanvas');
        window.scrollTo(0, 0);

        gameCanvas = canvas;

        window.addEventListener(
          'resize',
          function () {
            if (isMobile) {
              gameCanvas.width = window.innerWidth;
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
      //   setDidError(true)
      //   setErrorMessage(message)
    });

    unityInstance.on('progress', function (p) {
      setProgression(p);
    });
  }, [isMobile, realmKey, roundId]);

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

  useEffect(() => {
    startGame();
  }, [startGame]);

  return (
    <div>
      <GlobalStyles />
      <ConnectNetwork />
      <AppToolbar showMenu={showMenu} className="app__toolbar">
        <Flex
          alignItems={['start', null, 'center']}
          justifyContent={['start', null, 'space-between']}
          flexDirection={['column', null, 'row']}>
          <Flex justifyContent="space-between" alignItems="center">
            <Button scale="sm" variant="text">
              Arken: Evolution Isles
            </Button>
            <span>&nbsp;</span>{' '}
          </Flex>
          {!isMobile || showMenu ? (
            <Flex justifyContent="space-between" alignItems="center">
              <span>&nbsp;</span>{' '}
              {isGameStarted && !isGameHidden ? (
                <Button scale="sm" variant="text" onClick={goFullscreen}>
                  <BsArrowsFullscreen />
                </Button>
              ) : null}
            </Flex>
          ) : null}
        </Flex>
      </AppToolbar>
      {!isGameStarted || isGameHidden ? (
        <>
          <Cards>
            <VerticalCards2>
              <MainCard>
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <Heading as="h2" size="xl" color="#fff" mb="24px">
                    Arken: Evolution Isles
                  </Heading>
                </Flex>
              </MainCard>
            </VerticalCards2>
            <VerticalCards>
              <MainCard>
                <Flex flexDirection="column" alignItems="center" justifyContent="center"></Flex>
              </MainCard>
            </VerticalCards>
          </Cards>
        </>
      ) : null}
      {isGameStarted && !maintenance && !banned ? (
        <>
          <Unity
            ref={gameRef}
            unityContext={unityInstance}
            // matchWebGLToCanvasSize={false}
            style={{ width: progression === 1 ? '100%' : '0%', height: progression === 1 ? '100%' : '0%' }}
          />
        </>
      ) : null}
    </div>
  );
};

export default Evolution;
