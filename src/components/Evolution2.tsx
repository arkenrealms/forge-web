import React, { useCallback, useEffect, useRef, useState } from 'react';
import utf8 from 'utf8';

import { formatDistance } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import Unity, { UnityContext } from 'react-unity-webgl';
import io from 'socket.io-client';
import styled, { createGlobalStyle, css } from 'styled-components';
import Page from '~/components/layout/Page';
import useCache from '~/hooks/useCache';
import useWeb3 from '~/hooks/useWeb3';
import { Button, Card, CardBody, Flex, Heading } from '~/ui';

import addresses from '@arken/node/contractInfo';

let unityInstance;

// @ts-ignore
window.unityBridge = {
  name: 'Loading',
};

let socket;
const testMode = false;
const logCommonEvents = testMode;
let currentPlayerId;
const debug = process.env.NODE_ENV !== 'production';
let loadingGame = false;

const contractAddressToKey = {};

for (const contractKey of Object.keys(addresses)) {
  contractAddressToKey[addresses[contractKey][56]] = contractKey;
}

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
  text-align: center;
  padding: 50px;
`;

const log = (...args) => {
  if (debug) console.log(...args);
};
const getSocket = (endpoint) => {
  console.log('Connecting to', endpoint);
  return io(endpoint, {
    transports: ['websocket'],
    upgrade: false,
  });
};

const sendUserInfo = (username, address, isMobile, signature) => {
  const network = 'bsc';
  const pack = username + ':' + network + ':' + address + ':' + (isMobile ? 'mobile' : 'desktop') + ':' + signature;

  unityInstance.send('NetworkManager', 'EmitSetInfo', pack);
};

let signature;

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const accounts = {
  '0x02B446Fca8253D49EA97D1d8796a7ab399F38B1A':
    '0xb79253f8ed3cf18cb70107bc08701c0ae983533c16a810a2275a58a2a8093eb2406a70997ae1749a315740460e8d20064adab7783d4a2bbaceae796e2e1ecf351b',
  '0xb525E769eCA33130924daA25f8381A7F43dbee1b':
    '0xf9c5b0234840172963432670552a9247a93927a1cf66f583babf01e509b6fba419f0bcfa2369a7a0844dc0c2382353fb88d51194f3751e1fc5f824161f6d1fa11c',
  '0x6d612dFCD1A5ac6ec17a760226e48DF1992534d8':
    '0x05b48ec3b5c89a722760225052b5641986c4ae6ec1eca42e15f9f518611a3f980ca9f106e48f0e4c8a8cfe73730d4c7ea9b04b76ca797751f279674d78685dbe1c',
  '0x9A6Ab9e3aC6e7A5210843382bDDBF72FEf69d11a':
    '0x930eacd2d98de60be2f584b812deb5e8b1617940b356814801c8567d3cc07adb43cc95b06449cd543df59dc807721fa83968eaa7617f29970f8264cbc91268f71c',
  '0x8f8122a554648C7De7cf9704c6b038798044abA2':
    '0x3d0fabbe22a39c7f6eb91c22386938711627c451494a2b125176f99f5a23d37034543aa6bc175213732059562563cf2f149ca99795e95deb6e5a0b24e57c9ced1b',
  '0x3f0cbc20A713a7560C4110469C72d89D01b18060':
    '0x66ed9a7237c5a0b7623ae34119797e58b8aa9997a7662c793af07c2218781a1e12889e8baf174f9f68a43f9170ee47f20482abf44283766af1c3c26397fd26cf1c',
  '0xBfB41313b81c9e2b139eE711e7A20FE594096C6F':
    '0x0f461fdf19c897266f3a5224196e13ca09f5a8d21683ec469e829da4b7703580272b6219acab5e6205ab59daa728d481015db4560c9cfba91b14c9324ac7dee41b',
  '0xB3876066958bA3324654556F5e49608493c17F88':
    '0x8e4cd9ebef595cee8f81007c90dfe51ce40ac2038305803da2cfaee62bb4dc3d4414a01b4856af10fae9e1e09326ac82e63c2d10f61516f021a24b1eb91e9c3c1b',
  '0x25f47710B2163BFA85cDbcd87E602D3701C4E0dB':
    '0xc6f148d4d7a8b6da04ff75ec28f9d3beb9a50f9fdd55724d674cdc554cc715c04a279812a4447a792a0a9934a436c88aa152e152d8d18bb78d5c8d58140884401b',
  '0xA2CF0c98e6fb69c701113eBe3436cbb8b0371111':
    '0x134c89311ea12284b95556682aba5d389a82b5879795d36b4b399afa1f1fa8e1313a44c282cf929f0a48ace43447f29ece9b7f6749e9ad3c8e7f1b3c0914c0131b',
  '0x3445eCdc6BBf2eE2de5202FaB801f9Ffc91CdAbE':
    '0x150822b1ef52b429760b25d2fe5ad88f7486b645f21de79442f26138eee6e164429f6c245dc9608bff80e52b12158a64050fedc5dabbbefcb4a8cf7d6321c8301c',
  '0xA4Cb507EA92d826bc0fFA5E044c6640e238B7E11':
    '0xf853b41f6011ed78c271f65b1cbc8016b41c3b10ed69654abb55d7f9ef2691023359238a7b563e7c7abc625f8b809d1b5ae54e86091a93084e68a5112b7ff4c31b',
  '0x6FE3bEA237c7A81927Ca144Ef09f1396F27e868b':
    '0x01da2478f0a89546a3cb4a187f71288e96561be396c0ee32f1a09812e273a3833393ef26620eb522ab3dce75680965e855b276adb9486ef2e5539dc73b57e2d41c',
  '0x3a0691e9ceEfD64955922cBd3D548787E3d21BEE':
    '0x771b2111e563f70931c208a927c4a9a04b53445426effecfa66cdf265b43e3b721a20587871f1e1ff9c39c1b4e7100ed57145d5d88328ce36056424d5e8dbf861c',
  '0x4c02C44c0826f68553C6b880fD7028eF9662CDf7':
    '0x37e8d422ac96ade7b8ec5f6a0e512b026cfad660db0d45b60a9d70557b4804085f90a728827098bd16dc29bc4c5861f8fd40ef998990f4b43637de8779a98b931c',
  '0x7C251FE94961D5563370733E654895459D3E46Df':
    '0x51c69772d4f80db6f2de29f629e0ecfccbceee5478064abdab34276846a681807bf06743f98518b072e8701a46eedfd0c81a72599a58e00fb182da5943e8b9bc1c',
  '0x48520b359f6F241cEB15F4293f59c5E3eeA570D1':
    '0xd56ab502f71282d7dd2dfc6050a0465d84848dc41a087912d8d72c0a19215cb13ab5d1879e7291447fe3120d12f4b21a779d7ad733a0d53425035e3434f89ddf1c',
  '0x4A905C5935BBfA64E4f9B5d85897b29108C2616b':
    '0x6bc9917b69556bbd04f6d946c696cabc8cc8a93f7810475f8703af29a5fbe0e0350ad62989e2b17491cd6bee1b1d74cf70fdd3718b6a0ba4aa753df1d945fcf71b',
  '0xbbbe933943aa44e5ee3Bc074Ed52608e7EbDbBeA':
    '0x5c631b5e3bd4ce2a363711d8fa306032d0bd1b0567cf3cb1eb2af7d244ecc43a0df80e7d50cd3a3d818c093286793c055ee30064c1efd5e599a87e72b34dce4f1b',
  '0x82C75996645FebED39fc7B4Da2957341a2737bED':
    '0x4d43f0423f29bbf6aea3f1612c3b7ffead19237a407e23b2bc7c841302ea9a3d7ffdf3317a9afc2113ae98edc0f5d04731f17dc972f67635e0d0849b417686581b',
  '0xF2b307eDcB9D89A9d6D9085538eAfD081183F362':
    '0x2748e79563251770e9771dc3ed633b88146a81a517e1e2e09ff92b155a7e3bf9198725a5649996140dfb8124393a0ef0715a979091e0e0b45168cd149cae9c321c',
  '0x0e180A254dD2f74C3cD6607293ebDF697122c734':
    '0x2341d62862ed7634dee9b0155de531740203c662335fed57f3a0694d9b9196a052281356e505c87096f13adca01422c4e7c61595d0fa5d0431e043c44f6750e51b',
  '0x2AeC7DE82FE402B870773811aB1aA622a84e6a39':
    '0xfc641893ee1de6f42b534a850c5fd95ecbf3c0492d9bd9da4af47390632962211bbb850a8b7cf07e3734ba068d58e3abbaadb5197bec36b67bedc2b63caffa451b',
  '0x4911cc1641a37F61c1162F5Af733f0f9042940Ab':
    '0x3df3989570864b3a3978e484e5a287a434e1b3b9318df0c832f00afac254730e3b9fd59774b9530cbbde7b239407b7d7ada6c38cf4cb69637734f066472bfc361b',
  '0x716705a752Cbb4126Be5025f8cc33854F5c1925C':
    '0x918c22fdd25eb55e17fddb0fefd6c885690f68f616bc77241c4cf9b54e1212fe3bc97551ba96235d39e7f14610ecc427d9afe88b4b7bc6c55d89b2163a10e4ee1b',
  '0xC7DbD3533afC058311A60768AE32B556925416C7':
    '0x29f0a1b28fa53953c7008d0704de4477b5817471c44641a8c0c7880958a7c18a5b104ab2449e46b873dbd65995d283719e0d4459500e886dc397f72196438b501b',
  '0x97A527105406104CC8C217023e4299bE29A4Edf2':
    '0xcc2649dacdeda24377e2df31920da8bae1a8b7ad32d0e5fae6fe3c4ed2966d6000ec05682c1fff5d2a5130203f0bd5b62dfea8624ac9d86e28355c199bd884261b',
  '0x4f315E4143d3fFA47Fb2B3a2B496bC200cF4DC94':
    '0x772389eb0c0eb4b8803f386b0d4aeace9db9b159efd05dee8314c82a599c20b72c8eb6e1cffc7fae7e26700fb808c9ff8a040888d3e5f06dd44d8488041c66b51b',
  '0xb7D053407250Fc7e3e4934CF076bE48D9848CB4B':
    '0x7529547d524fd5b2dd3753be99d5fddcc22457e04219b398465af70dbd493c4664d799db694ef05e0352e60071cf429dfd3fec740bedede2e651b0047306acb51c',
  '0x8d7Ab6a259e2E081320f64C2Ebfb1F1F9aA63597':
    '0xcdeee040606f1d8c6af64ae242bd3a63ec9548fee6d603da38ed5ed68e9ab7567d3f906a6833887c687b3697e97d80530b092810b23a6e6d9a76f63254577f3b1b',
  '0x20256727b9C9Fad76655b7583BaFf38B836ACb6A':
    '0x57edc2cb0b656c349bad5185df3c6640657086f6352490e2c6407cab75fac6085d09246367ca90db34bc4dec9f54afe6a71d989a74e4158bab4f76022b0b0b9f1c',
  '0x51033bf5a5be7499a7D1d849058a01109C199ab0':
    '0x299a60c5d335fff99fe8b28854d402b4fa744c0787cf3e381b535ee3d6041bfc3e524051c2108ce3c572a8112421a1f1893f2cedf3b4e0333c6986fa3f2220021b',
};

const accountAddress = Object.keys(accounts)[random(0, Object.keys(accounts).length)];

const config = {
  username: 'Guest' + Math.floor(Math.random() * 999),
  address: accountAddress,
  signature: accounts[accountAddress],
  isMobile: true,
};

const GlobalStyles = createGlobalStyle`
#server-menu > div {
  display: block;
}
`;

const startOldGame = async (account, setProgression) => {
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
  // unityInstance = new UnityContext({
  //   loaderUrl: '/Build/RuneEvolutionAlpha/RuneEvolution.loader.js',
  //   dataUrl: '/Build/RuneEvolutionAlpha/RuneEvolution.data',
  //   frameworkUrl: '/Build/RuneEvolutionAlpha/RuneEvolution.framework.js',
  //   codeUrl: '/Build/RuneEvolutionAlpha/RuneEvolution.wasm',
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
  // })

  // @ts-ignore
  window.unityInstance = unityInstance;

  startGame(account, setProgression);
};

const startGame = async (account, setProgression) => {
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

        socket = getSocket('https://gs1.evolution.arken.asi.sh');

        const OnLoaded = () => {
          log('Loaded');
          sendUserInfo(config.username, config.address, config.isMobile, config.signature);
          // unityInstance.send('NetworkManager', 'OnReadyToJoinGame')
        };

        socket.on('Events', function (msg) {
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
              } else if (eventName === 'OnJoinGame') {
                currentPlayerId = event[1].split(':')[0];

                // sendUserInfo(config.username, config.address, config.isMobile, signature)

                loadingGame = false;
              } else if (eventName === 'OnGameOver' || eventName === 'OnUserDisconnected') {
                const playerId = event[1].split(':')[0];
                if (playerId === currentPlayerId) {
                  socket.disconnect();
                  socket = null;
                  loadingGame = false;
                }
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

        unityInstance.send('NetworkManager', 'OnWebInit', account + ':' + signature);
      }

      if (socket) socket.emit(...args);
    },
  };

  unityInstance.on('canvas', function (canvas) {
    if (canvas) {
      canvas.width = window.innerWidth - 40;

      canvas.height = window.innerHeight - 104;

      canvas.tabIndex = 1;
      canvas.setAttribute('id', 'unityCanvas');
      window.scrollTo(0, 0);

      document.body.appendChild(canvas);
      document.getElementById('root').style.display = 'none';

      window.addEventListener(
        'resize',
        function () {
          canvas.width = window.innerWidth - 40;
          canvas.height = window.innerHeight - 104;
          window.scrollTo(0, 0);
        },
        true
      );
    }
  });

  unityInstance.on('error', function (message) {
    // setDidError(true)
    // setErrorMessage(message)
  });

  unityInstance.on('progress', function (p) {
    setProgression(p);

    if (p === 1) {
      unityInstance.send('NetworkManager', 'Connect');
    }
  });
};

const Evolution: any = ({ open }) => {
  const cache = useCache();
  const [progression, setProgression] = useState(0);
  const { account, library } = useWeb3();
  const { web3 } = useWeb3();
  const gameRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const getSignature = useCallback(
    async function (text = null) {
      if (!library || !account) return;
      const value = text || Math.floor(Math.random() * 999) + '';
      const hash = library?.bnbSign
        ? (await library.bnbSign(account, value))?.signature
        : await web3.eth.personal.sign(value, account, null);

      return {
        value,
        hash,
      };
    },
    [library, account, web3.eth.personal]
  );

  useEffect(() => {
    async function init() {
      if (account && !signature) {
        config.address = account;
        config.signature = (await getSignature('evolution'))?.hash;
      }

      startOldGame(config.address, setProgression);
      setTimeout(() => {
        setIsInitialized(true);
      });
    }

    init();
  }, [account, getSignature, setIsInitialized, setProgression]);

  const now = new Date().getTime() / 1000;

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
    <div
      css={css`
        min-height: 300px;
        max-width: 1400px;
        margin: 0 auto 100px auto;
        padding: 50px;
      `}>
      <GlobalStyles />
      <Page style={{ padding: 0, maxWidth: 'none' }}>
        <>
          <Card
            css={css`
              padding: 0;
              border-width: 8px;
              border-style: solid;
              border-color: transparent;
              border-image: url(/images/frame.png) 80 / 80px / 0 repeat;
              border-radius: 0px;
              background: #000;
              margin-bottom: 30px;
              line-height: 0;
            `}>
            {progression !== 1 ? (
              <StyledNotFound>
                <Heading size="xxl">{(progression * 100).toFixed(0)}%</Heading>
              </StyledNotFound>
            ) : null}
            {isInitialized ? (
              /* @ts-ignore */
              <Unity
                ref={gameRef}
                unityContext={unityInstance}
                style={{ width: progression === 1 ? '100%' : '0%', height: progression === 1 ? '100%' : '0%' }}
              />
            ) : null}
          </Card>
          <Card>
            <CardBody>
              <Flex flexDirection={'row'} alignItems="center" justifyContent="space-around">
                <div
                  css={css`
                    text-align: center;
                  `}>
                  <a
                    href="https://arken.gg/evolution"
                    target="_blank"
                    rel="noreferrer"
                    css={css`
                      font-family: 'webfontexl', sans-serif !important;
                      text-transform: uppercase;
                    `}>
                    HOME
                  </a>
                </div>
                <div
                  css={css`
                    text-align: center;
                  `}>
                  <a
                    href="https://arken.gg/account"
                    target="_blank"
                    rel="noreferrer"
                    css={css`
                      font-family: 'webfontexl', sans-serif !important;
                      text-transform: uppercase;
                    `}>
                    CREATE ACCOUNT
                  </a>
                </div>
                <div
                  css={css`
                    text-align: center;
                  `}>
                  <a
                    href="https://telegram.arken.gg"
                    target="_blank"
                    rel="noreferrer"
                    css={css`
                      font-family: 'webfontexl', sans-serif !important;
                      text-transform: uppercase;
                    `}>
                    CHAT
                  </a>
                </div>
                <div
                  css={css`
                    text-align: center;
                  `}>
                  <a
                    href="https://arken.gg/evolution/tutorial"
                    target="_blank"
                    rel="noreferrer"
                    css={css`
                      font-family: 'webfontexl', sans-serif !important;
                      text-transform: uppercase;
                    `}>
                    HELP
                  </a>
                </div>
                <div
                  css={css`
                    text-align: center;
                  `}>
                  <h3>Download</h3>
                  <Button
                    as={RouterLink}
                    scale="sm"
                    to="/download/evolution"
                    style={{ marginBottom: 10, marginLeft: 10 }}>
                    Mac
                  </Button>
                  <Button
                    as={RouterLink}
                    scale="sm"
                    to="/download/evolution"
                    style={{ marginBottom: 10, marginLeft: 10 }}>
                    Windows
                  </Button>
                  <Button
                    as={RouterLink}
                    scale="sm"
                    to="/download/evolution"
                    style={{ marginBottom: 10, marginLeft: 10 }}>
                    Android
                  </Button>
                </div>
              </Flex>
            </CardBody>
          </Card>
        </>
      </Page>
    </div>
  );
};

export default Evolution;
