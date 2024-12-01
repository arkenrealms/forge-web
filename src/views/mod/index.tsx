import React, { useCallback, useEffect, useState, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Button, Heading, Toggle, Text, Flex, BaseLayout, Card } from '~/ui';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import { useToast } from '~/state/hooks';
import md5 from 'js-md5';
import useLive from '~/hooks/useLive';
import shortId from 'shortid';
import useWeb3 from '~/hooks/useWeb3';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import io from 'socket.io-client';
import Page from '~/components/layout/Page';
import { ConnectNetwork } from '~/components/ConnectNetwork';
import Select, { OptionProps } from '~/components/Select/Select';
import { getUserAddressByUsername, getUsername } from '~/state/profiles/getProfile';
import { Link as RouterLink, NavLink, useLocation, useNavigate } from 'react-router-dom';

const debug = process.env.NODE_ENV !== 'production';

// const Actions = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   grid-gap: 8px;
// `

const Container = styled.div`
  width: 100%;
`;

const Cards = styled(BaseLayout)`
  align-items: flex-start;
  justify-content: stretch;
  margin-bottom: 0px;

  & > div {
    grid-column: span 12;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;
// const VerticalCards = styled(BaseLayout)`
//   align-items: stretch;
//   justify-content: stretch;
//   margin-bottom: 32px;
//   width: calc(100% - 40px);
//   ${({ theme }) => theme.mediaQueries.lg} {
//     margin: 20px;
//     & > div {
//       max-width: 500px;
//       margin: 0 auto;
//     }
//   }

//   & > div {
//     grid-column: span 12;
//     width: 100%;
//     background-image: url(/images/background.jpeg);
//     background-size: 400px;
//   }
// `
const MainCard = styled(Card)`
  position: relative;
  font-weight: bold;
  border-width: 15px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 80 repeat;
  border-image-width: 80px;
  padding: 20px;
  padding-bottom: 40px;
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

// const VerticalCards2 = styled(BaseLayout)`
//   align-items: stretch;
//   justify-content: stretch;
//   margin-bottom: 32px;
//   width: calc(100% - 40px);
//   ${({ theme }) => theme.mediaQueries.lg} {
//     margin: 20px;
//     & > div {
//       max-width: 600px;
//       margin: 0 auto;
//     }
//   }

//   & > div {
//     grid-column: span 12;
//     width: 100%;
//     background-image: url(/images/background.jpeg);
//     background-size: 400px;
//   }
// `

// const AdminTools = styled.div`
//   border: 1px solid rgba(0, 0, 0, 0.7);
//   padding: 20px;
//   margin: 20px;
// `

const AdminUserRow = styled.div`
  color: #fff;
  width: 100%;
  margin-bottom: 5px;
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

const log = (...args) => {
  if (debug) console.log(...args);
};

const isLocal = process.env.REACT_APP_RUNE_ENV === 'local';
const endpoints = {
  // cache: 'https://s1.envoy.arken.asi.sh',
  // coordinator: 'https://s1.relay.arken.asi.sh',
  databaser: isLocal ? 'http://localhost:6001' : 'https://s1.envoy.arken.asi.sh',
  cache: isLocal ? 'http://localhost:6001' : 'https://s1.envoy.arken.asi.sh',
  coordinator: isLocal ? 'http://localhost:5001' : 'https://s1.relay.arken.asi.sh',
};

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

const Input = styled.input`
  text-transform: none;
  background: #000;
  border: 2px dashed #666;
  padding: 5px;
  border-radius: 4px;
  color: #fff;
  font-family: 'Alegreya Sans', Cambria, Verdana, Arial, Helvetica, sans-serif;
  position: relative !important;
  bottom: auto !important;
`;

const ServerBox = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 5px;
`;

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

const sockets = {};
const ioCallbacks = {};

function logError(...err) {
  console.log(...err);
}

async function callRealmServer(realm, name, data = undefined) {
  try {
    log('RS Call', name, data);

    return new Promise((resolve, reject) => {
      const id = shortId();

      const timeout = setTimeout(function () {
        log('Request timeout');

        resolve({ status: 0, message: 'Request timeout' });

        delete ioCallbacks[id];
      }, 60 * 1000);

      ioCallbacks[id] = { resolve, reject, timeout };

      sockets[realm.key].emit(name, { id, data });
    });
  } catch (e) {
    logError(e);
  }
}

let signature;

const initialized = {};

const Evolution: React.FC<any> = () => {
  const location = useLocation();
  const match = parseMatch(location);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { socket: liveSocket, call: callLiveServer } = useLive();
  const { account: address, library } = useWeb3();
  const { web3 } = useWeb3();
  const [realm, setRealm] = useState(null);
  const [username, setUsername] = useState(config.username);
  const [tab, setTab] = useState(match?.params?.realm ? parseInt(match?.params?.realm + '') : 0);
  const [users, setUsers] = useState([]);
  const [realmInfo, setRealmInfo] = useState(null);
  const [realms, setRealms] = useState([]);
  const [serverInfoList, setServerInfoList] = useState([]);
  const [notices, setNotices] = useState([]);
  const [isServerOffline, setIsServerOffline] = useState(false);
  const [distributeTokensAmounts, setDistributeTokensAmounts] = useState('');
  const [distributeTokensReason, setDistributeTokensReason] = useState('');
  const [distributeTokensUsernames, setDistributeTokensUsernames] = useState('');
  const [compareUser1, setCompareUser1] = useState('');
  const [compareUser2, setCompareUser2] = useState('');
  const [sameUserMessage, setSameUserMessage] = useState('');
  const [distributeAchievementsAmounts, setDistributeAchievementsAmounts] = useState('');
  const [distributeAchievementsReason, setDistributeAchievementsReason] = useState('');
  const [distributeAchievementsUsernames, setDistributeAchievementsUsernames] = useState('');
  const [reportUserText, setReportUserText] = useState('');
  const [banUserText, setBanUserText] = useState('');
  const [banReasonText, setBanReasonText] = useState('');
  const [banUntil, setBanUntil] = useState('');
  const [banList, setBanList] = useState([]);
  const [unbanUserText, setUnbanUserText] = useState('');
  const [addModText, setAddModText] = useState('');
  const [removeModText, setRemoveModText] = useState('');
  const [setConfigKeyText, setSetConfigKeyText] = useState('damagePerTouch');
  const [setConfigValueText, setSetConfigValueText] = useState('');
  const [setUserConfigKeyText, setSetUserConfigKeyText] = useState('xp');
  const [setUserConfigValueText, setSetUserConfigValueText] = useState('');
  const [replayRoundId, setReplayRoundId] = useState('');
  // const [serverInfo, setServerInfo] = useState([])
  const [roundGameMode, setRoundGameMode] = useState('Standard');
  const { toastError, toastSuccess } = useToast();

  const [messageText, setMessageText] = useState(
    'Cheating/exploiting will result in ban. Read the announcement: https://t.me/Arken_Realms/397'
  );

  const updateHistory = useCallback(
    (key, val) => {
      setTimeout(() => {
        try {
          navigate({
            pathname: '/mod',
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
    [navigate, tab]
  );

  const updateTab = (val) => {
    updateHistory('realm', val);
    setTab(val);
  };

  const [claimRewardStatus, setClaimRewardStatus] = useState('');
  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;

  async function sendRealmWebRequest(r, method, data = {}) {
    signature = await getSignedRequest(data);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signature, data }),
    };
    try {
      const res = await fetch('https://' + r.endpoint + '/call/' + method, requestOptions);
      const resData = await res.json();
      console.log(resData);
      if (resData.status === 1) {
        toastSuccess('Called ' + method);
      } else {
        toastError('Request failed ' + method + ': ' + (resData.message || 'No info'));
      }
    } catch (e) {
      toastError('Couldnt send request');
    }
  }

  async function sendRealmSocketRequest(r, method, data = {}) {
    signature = await getSignedRequest(data);

    try {
      const resData = (await callRealmServer(r, 'CallRequest', { method, signature, data })) as any;
      console.log(resData);
      if (resData.status === 1) {
        toastSuccess('Called ' + method);
      } else {
        toastError('Request failed ' + method + ': ' + (resData.message || 'No info'));
      }
    } catch (e) {
      toastError('Couldnt send request');
    }
  }

  async function sendLiveSocketRequest(method, data = {}) {
    try {
      const resData = (await callLiveServer(method, data)) as any;
      console.log(resData);
      if (resData.status === 1) {
        toastSuccess('Called ' + method);
      } else {
        toastError('Request failed ' + method + ': ' + (resData.message || 'No info'));
      }

      return resData;
    } catch (e) {
      toastError('Couldnt send request');
    }
  }

  useEffect(
    function () {
      if (address && liveSocket && !initialized['liveSocket']) {
        initialized['liveSocket'] = true;
      }
    },
    [address, liveSocket]
  );

  useEffect(
    function () {
      if (!window) return;

      async function init() {
        const coeff = 1000 * 60 * 2;
        const date = new Date(); //or use any other date
        const rand = new Date(Math.round(date.getTime() / coeff) * coeff).getTime();
        // const rand1 = Math.floor(Math.random() * Math.floor(999999))
        const response1 = await fetch(`https://s1.envoy.arken.asi.sh/evolution/realms.json?${rand}`);
        const servers = await response1.json();

        const filteredServers = servers.filter((s) => s.status === 'online');
        setRealms(filteredServers);
        setRealm(filteredServers[tab]);

        // const list = []

        // for (const server of servers) {
        //   try {
        //     const response = await fetch('https://' + server.endpoint + `/info`)
        //     const responseData = await response.json()

        //     list.push({
        //       ...server,
        //       ...responseData,
        //     })
        //   } catch (e) {
        //     console.log('Server offline: ' + e)
        //   }
        // }

        // setServerInfoList(list)

        // const players = {}
        // const noticesList = []

        // for (const server of list) {
        //   if (!server.connectedPlayers) continue
        //   for (const player of server.connectedPlayers) {
        //     if (!players[player]) players[player] = 0

        //     players[player] += 1

        //     if (players[player] > 1) {
        //       noticesList.push({
        //         key: 'multipleServers',
        //         text: `Player on multiple servers: ${player} (${players[player]})`,
        //       })
        //     }
        //   }
        // }

        // setNotices(noticesList)
      }

      init();

      const inter = setInterval(init, 1 * 60 * 1000);

      return () => {
        clearInterval(inter);
      };
    },
    [tab]
  );

  useEffect(function () {
    if (!window) return;

    async function init() {
      const coeff = 1000 * 60 * 2;
      const date = new Date(); //or use any other date
      const rand = new Date(Math.round(date.getTime() / coeff) * coeff).getTime();
      // const rand1 = Math.floor(Math.random() * Math.floor(999999))
      const response1 = await fetch(`https://s1.envoy.arken.asi.sh/evolution/banList.json?${rand}`);
      const response2 = await response1.json();

      setBanList(response2);
    }

    init();

    const inter = setInterval(init, 5 * 60 * 1000);

    return () => {
      clearInterval(inter);
    };
  }, []);

  useEffect(
    function () {
      if (!realm) return;
      if (!address) return;
      if (!window) return;

      async function init() {
        try {
          // const response = await fetch('https://' + realm.endpoint + `/info`)
          // const responseData = await response.json()
          // setRealmInfo(responseData)
          // setUsers(responseData.connectedPlayers)
          // setIsServerOffline(false)
        } catch (e) {
          // setIsServerOffline(true)
        }
      }

      init();

      const inter = setInterval(init, 1 * 60 * 1000);

      return () => {
        clearInterval(inter);
      };
    },
    [address, realm]
  );

  async function getSignedRequest(data = null) {
    log('Signing', data);
    try {
      const hashedData = md5(JSON.stringify(data));
      const hash = library?.bnbSign
        ? (await library.bnbSign(address, hashedData))?.signature
        : await web3.eth.personal.sign(hashedData, address, null);

      return {
        address,
        hash,
        data: hashedData,
      };
    } catch (e) {
      logError(e);
      return null;
    }
  }

  const fetchState = async (_realm) => {
    if (!sockets[_realm.key].connected) return;

    const res2 = (await callRealmServer(_realm, 'BridgeStateRequest')) as any;
    console.log('bridgestate', res2);

    if (res2.status === 1) {
      for (const server of res2.state.servers) {
        for (let i = 0; i < server.info.connectedPlayers.length; i++) {
          server.info.connectedPlayers[i] = {
            username: await getUsername(server.info.connectedPlayers[i]),
            address: server.info.connectedPlayers[i],
          };
        }
      }
      setServerInfoList(res2.state.servers);
    }
  };

  const connectRealm = async (_realm) => {
    const data = address;
    signature = await getSignedRequest(data);

    sockets[_realm.key] = getSocket('https://' + _realm.endpoint);

    sockets[_realm.key].on('connect', async function () {
      sockets[_realm.key].emit('AuthRequest', { signature, data });

      toastSuccess('Connected to realm: ' + _realm.endpoint);

      setRealm({ ..._realm, isConnected: true });

      await fetchState(_realm);
    });

    const onAny = function (eventName, res) {
      if (ioCallbacks[res.id]) {
        log('Callback', eventName);
        ioCallbacks[res.id].resolve(res.data);

        delete ioCallbacks[res.id];
      }
    };

    for (const eventName of [
      'AddModResponse',
      'BanListResponse',
      'BanPlayerResponse',
      'RemoveModResponse',
      'AuthResponse',
      'BridgeStateResponse',
      'RS_MessageUserResponse',
      'RS_ChangeUserResponse',
      'RS_ChangeUserResponse',
      'RS_MakeBattleHarderResponse',
      'RS_MakeBattleEasierResponse',
      'RS_ResetBattleDifficultyResponse',
      'RS_StartGodPartyResponse',
      'RS_StopGodPartyResponse',
      'RS_EnableForceLevel2Response',
      'RS_DisableForceLevel2Response',
      'startBattleRoyaleResponse',
      'stopBattleRoyaleResponse',
      'startRoundResponse',
      'pauseRoundResponse',
      'setConfigResponse',
      'maintenanceResponse',
      'unmaintenanceResponse',
      'broadcastResponse',
    ]) {
      sockets[_realm.key].on(eventName, function (res) {
        onAny(eventName, res);
      });
    }
  };

  const addMod = async (_realm, user) => {
    const target = user.startsWith('0x') ? user : await getUserAddressByUsername(user);
    callRealmServer(_realm, 'AddModRequest', { address: target });

    toastSuccess('Called AddModRequest');
  };

  const removeMod = async (_realm, user) => {
    const target = user.startsWith('0x') ? user : await getUserAddressByUsername(user);
    callRealmServer(_realm, 'RemoveModRequest', { address: target });

    toastSuccess('Called RemoveModRequest');
  };

  const reportUser = async (user) => {
    const target = user.startsWith('0x') ? user : await getUserAddressByUsername(user);
    await sendRealmWebRequest(realm, 'RS_ReportUserRequest', { address: target });
  };

  const banUser = async (_realm, user, reason, until) => {
    const target = user.startsWith('0x') ? user : await getUserAddressByUsername(user);
    callRealmServer(_realm, 'banClient', { target, reason, until });

    toastSuccess('Called banClient');

    setTimeout(async function () {
      const res = (await callRealmServer(_realm, 'BanListRequest', { target })) as any;

      setBanList(res.list);
    }, 3 * 1000);
  };

  const unbanUser = async (_realm, user) => {
    const target = user.startsWith('0x') ? user : await getUserAddressByUsername(user);
    callRealmServer(_realm, 'unbanClient', { target });

    toastSuccess('Called unbanClient');
  };

  const messageUser = async (_realm, user, message) => {
    const target = user.startsWith('0x') ? user : await getUserAddressByUsername(user);
    await sendRealmSocketRequest(_realm, 'RS_MessageUserRequest', { target, message });
  };

  const setGodMode = async (_realm, user) => {
    const target = user.startsWith('0x') ? user : await getUserAddressByUsername(user);
    await sendRealmSocketRequest(_realm, 'RS_ChangeUserRequest', { target, config: { isGod: true } });
  };

  const setUserConfig = async (_realm, user, key, value) => {
    const target = user.startsWith('0x') ? user : await getUserAddressByUsername(user);
    await sendRealmSocketRequest(_realm, 'RS_ChangeUserRequest', { target, config: { [key]: value } });
  };

  const makeBattleHarder = async () => {
    await sendRealmWebRequest(realm, 'RS_MakeBattleHarderRequest');
  };

  const makeBattleEasier = async () => {
    await sendRealmWebRequest(realm, 'RS_MakeBattleEasierRequest');
  };

  const resetBattleDifficulty = async () => {
    await sendRealmWebRequest(realm, 'RS_ResetBattleDifficultyRequest');
  };

  const enableGodParty = async () => {
    await sendRealmWebRequest(realm, 'RS_StartGodPartyRequest');
  };

  const disableGodParty = async () => {
    await sendRealmWebRequest(realm, 'RS_StopGodPartyRequest');
  };

  const startRuneRoyale = async () => {
    await sendRealmWebRequest(realm, 'RS_StartRuneRoyaleRequest');
  };

  const pauseRuneRoyale = async () => {
    await sendRealmWebRequest(realm, 'RS_PauseRuneRoyaleRequest');
  };

  const unpauseRuneRoyale = async () => {
    await sendRealmWebRequest(realm, 'RS_UnpauseRuneRoyaleRequest');
  };

  const stopRuneRoyale = async () => {
    await sendRealmWebRequest(realm, 'RS_StopRuneRoyaleRequest');
  };

  const enableForcedLevel2 = async () => {
    await sendRealmWebRequest(realm, 'RS_EnableForceLevel2Request');
  };

  const disableForcedLevel2 = async () => {
    await sendRealmWebRequest(realm, 'RS_DisableForceLevel2Request');
  };

  const enableBattleRoyale = async () => {
    await sendRealmWebRequest(realm, 'RS_StartBattleRoyaleRequest');
  };

  const disableBattleRoyale = async () => {
    await sendRealmWebRequest(realm, 'RS_StopBattleRoyaleRequest');
  };

  const startRound = async (gameMode) => {
    await sendRealmWebRequest(realm, 'RS_StartRoundRequest', { gameMode });
  };

  const pauseRound = async () => {
    await sendRealmWebRequest(realm, 'RS_PauseRoundRequest');
  };

  const setConfig = async (keyText, valueText) => {
    await sendRealmWebRequest(realm, 'setConfigRequest', { config: { [keyText]: valueText } });
  };

  const enableMaintenance = async () => {
    await sendRealmWebRequest(realm, 'RS_MaintenanceRequest');
  };

  const restartServer = async () => {
    await sendRealmWebRequest(realm, 'RS_RestartRequest');
  };

  const disableMaintenance = async () => {
    await sendRealmWebRequest(realm, 'RS_UnmaintenanceRequest');
  };

  const broadcastMessage = async (message) => {
    await sendRealmWebRequest(realm, 'RS_BroadcastRequest', { message });
  };

  const updateRealm = (r) => {
    if (!r) return;
    setRealm(r);
    updateTab(realms.findIndex((t2) => t2.key === r.key));
  };

  const handleSetRoundGameMode = (option: OptionProps): void => {
    setRoundGameMode(option.value);
  };

  const distributeTokens = async (amounts, reason, usernames) => {
    await sendLiveSocketRequest('CS_DistributeTokensRequest', {
      usernames,
      amounts,
      reason,
    });
  };

  const distributeAchievements = async (amounts, reason, usernames) => {
    await sendLiveSocketRequest('CS_DistributeAchievementsRequest', {
      usernames,
      amounts,
      reason,
    });
  };

  const compareUsers = async (address1, address2) => {
    const res = await sendLiveSocketRequest('CS_CompareUsersRequest', {
      address1,
      address2,
    });
    if (res?.networkMatchCount > 0) {
      setSameUserMessage(`Users have played on ${res.networkMatchCount} networks together`);
    } else {
      setSameUserMessage('No issues detected');
    }
  };

  return (
    <Page>
      <GlobalStyles />
      <ConnectNetwork />
      <Cards>
        <div>
          <MainCard>
            <Heading color="contrast" size="lg" style={{ textAlign: 'center', marginTop: 20 }}>
              Choose Realm
            </Heading>
            <br />
            <br />
            {realms ? (
              <ControlContainer>
                <ViewControls>
                  {realms.map((r) => {
                    return (
                      <ToggleWrapper key={r.key}>
                        <Toggle checked={realm?.key === r.key} onChange={() => updateRealm(r)} scale="sm" />
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
                </ViewControls>
              </ControlContainer>
            ) : null}
            <br />
            <br />
            <p>Replay Round ID:</p>
            <br />
            <Input type="text" value={replayRoundId} onChange={(e) => setReplayRoundId(e.target.value)} />
            <br />
            <br />
            <Button onClick={() => window.open('/evolution/replay/' + realm.key + '/' + replayRoundId)}>
              View Replay
            </Button>
            <br />
            <br />
            <h2>Ban List</h2>
            <ul>
              {banList.map((item) => (
                <li>
                  {item.address} for {item.reason} until {item.until}
                </li>
              ))}
            </ul>
          </MainCard>
          <br />
          <MainCard style={{ overflow: 'visible' }}>
            <p>Config:</p>
            <br />
            <Flex flexDirection="row" alignItems="center" justifyContent="center" style={{ zoom: 0.7 }}>
              <Select
                value={setUserConfigKeyText}
                options={[
                  {
                    label: 'xp',
                    value: 'xp',
                  },
                  {
                    label: 'kills',
                    value: 'kills',
                  },
                  {
                    label: 'deaths',
                    value: 'deaths',
                  },
                  {
                    label: 'points',
                    value: 'points',
                  },
                  {
                    label: 'evolves',
                    value: 'evolves',
                  },
                  {
                    label: 'powerups',
                    value: 'powerups',
                  },
                  {
                    label: 'rewards',
                    value: 'rewards',
                  },
                  {
                    label: 'orbs',
                    value: 'orbs',
                  },
                  {
                    label: 'isGod',
                    value: 'isGod',
                  },
                  {
                    label: 'isInvincible',
                    value: 'isInvincible',
                  },
                  {
                    label: 'isPhased',
                    value: 'isPhased',
                  },
                  {
                    label: 'overrideSpeed',
                    value: 'overrideSpeed',
                  },
                  {
                    label: 'overrideCameraSize',
                    value: 'overrideCameraSize',
                  },
                  {
                    label: 'invincibleUntil',
                    value: 'invincibleUntil',
                  },
                  {
                    label: 'decayPower',
                    value: 'decayPower',
                  },
                  {
                    label: 'phasedUntil',
                    value: 'phasedUntil',
                  },
                  {
                    label: 'baseSpeed',
                    value: 'baseSpeed',
                  },
                ]}
                onChange={(e) => setSetUserConfigKeyText(e.value)}
              />
              <Input
                type="text"
                placeholder="value"
                value={setUserConfigValueText}
                onChange={(e) => setSetUserConfigValueText(e.target.value)}
                style={{ marginLeft: 10 }}
              />
            </Flex>
            <br />
            <br />
            <br />
            <p>Message Text:</p>
            <br />
            <Input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
            <br />
            <br />
            <p>Ban Reason:</p>
            <br />
            <Input
              type="text"
              value={banReasonText}
              onChange={(e) => setBanReasonText(e.target.value)}
              placeholder="Reason"
            />
            <br />
            <br />
            <p>Ban Until:</p>
            <br />
            <Input
              type="text"
              value={banUntil}
              onChange={(e) => setBanUntil(e.target.value)}
              placeholder="Until timestamp"
            />
            <br />
            <br />
            {serverInfoList.map((serverInfo) => {
              return (
                <ServerBox>
                  <p>{serverInfo.info.key}</p>
                  <br />
                  <p>
                    <strong>Players:</strong> {serverInfo.info.playerCount}
                  </p>
                  <br />
                  {serverInfo.info.connectedPlayers.map((player) => (
                    <AdminUserRow key={player.address} style={{ zoom: 0.7 }}>
                      {player.username}{' '}
                      <Button scale="sm" onClick={() => banUser(realm, player.address, banReasonText, banUntil)}>
                        Ban
                      </Button>{' '}
                      <Button scale="sm" onClick={() => setGodMode(realm, player.address)}>
                        Godmode
                      </Button>{' '}
                      <Button scale="sm" onClick={() => messageUser(realm, player.address, messageText)}>
                        Message
                      </Button>{' '}
                      <Button
                        scale="sm"
                        onClick={() =>
                          setUserConfig(realm, player.address, setUserConfigKeyText, setUserConfigValueText)
                        }>
                        Config
                      </Button>
                    </AdminUserRow>
                  ))}
                </ServerBox>
              );
            })}
            <br />
            <br />
            {notices.map((n) => {
              return (
                <>
                  <p>
                    <strong>{n.key}:</strong> {n.text}
                  </p>
                  <br />
                </>
              );
            })}
            <br />
            <br />
            <Button onClick={() => fetchState(realm)}>Fetch Server State</Button>
          </MainCard>
        </div>

        <MainCard style={{ overflow: 'visible' }}>
          <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
            Server Panel
          </Heading>
          <hr />
          {!realms ? <p>Loading realms...</p> : null}
          <br />
          <br />
          {!sockets[realm?.key]?.connected ? <Button onClick={() => connectRealm(realm)}>Connect</Button> : null}
          {sockets[realm?.key]?.connected && !serverInfoList.length ? <p>Not authorized</p> : null}
          {sockets[realm?.key]?.connected && serverInfoList.length ? (
            <>
              {realmInfo ? (
                <>
                  <p>
                    <strong>Version:</strong> {realmInfo.version}
                  </p>
                  <br />
                  <p>
                    <strong>Round:</strong> {realmInfo.round.id}
                  </p>
                  <br />
                  <p>
                    <strong>Clients:</strong> {realmInfo.clientTotal}
                  </p>
                  <br />
                  <p>
                    <strong>Players:</strong> {realmInfo.playerTotal}
                  </p>
                  <br />
                  <p>
                    <strong>Spectators:</strong> {realmInfo.spectatorTotal}
                  </p>
                  <br />
                  <p>
                    <strong>Recent Players:</strong> {realmInfo.recentPlayersTotal}
                  </p>
                  <br />
                  <p>
                    <strong>Legit Players:</strong> {realmInfo.totalLegitPlayers}
                  </p>
                  <br />
                  <p>
                    <strong>Sprites:</strong> {realmInfo.spritesTotal}
                  </p>
                  <br />
                  <p>
                    <strong>Reward Item Amount:</strong> {realmInfo.rewardItemAmount}
                  </p>
                  <br />
                  <p>
                    <strong>Reward Round Amount:</strong> {realmInfo.rewardWinnerAmount}
                  </p>
                  <br />
                  <p>
                    <strong>Game Mode:</strong> {realmInfo.gameMode}
                  </p>
                  <br />
                  <p>
                    <strong>Orbs:</strong> {realmInfo.orbs.length}
                  </p>
                  <br />
                  <p>
                    <strong>Current Reward:</strong> {realmInfo.currentReward ? realmInfo.currentReward.type : 'none'}
                  </p>
                  <br />
                </>
              ) : null}
              <br />
              <br />
              <Flex flexDirection="row" alignItems="center" justifyContent="center" style={{ zoom: 0.7 }}>
                <Select
                  value={setConfigKeyText}
                  options={[
                    'id',
                    'roundId',
                    'damagePerTouch',
                    'periodicReboots',
                    'startAvatar',
                    'spriteXpMultiplier',
                    'forcedLatency',
                    'isRoundPaused',
                    'level2forced',
                    'level2allowed',
                    'level2open',
                    'level3open',
                    'hideMap',
                    'dynamicDecayPower',
                    'decayPowerPerMaxEvolvedPlayers',
                    'pickupCheckPositionDistance',
                    'playersRequiredForLevel2',
                    'preventBadKills',
                    'colliderBuffer',
                    'stickyIslands',
                    'antifeed2',
                    'antifeed3',
                    'antifeed4',
                    'isBattleRoyale',
                    'isGodParty',
                    'avatarDirection',
                    'calcRoundRewards',
                    'flushEventQueueSeconds',
                    'antifeed1',
                    'avatarDecayPower0',
                    'avatarDecayPower1',
                    'avatarDecayPower2',
                    'avatarTouchDistance0',
                    'avatarTouchDistance1',
                    'avatarTouchDistance2',
                    'avatarSpeedMultiplier0',
                    'avatarSpeedMultiplier1',
                    'avatarSpeedMultiplier2',
                    'baseSpeed',
                    'cameraSize',
                    'checkConnectionLoopSeconds',
                    'checkInterval',
                    'checkPositionDistance',
                    'claimingRewards',
                    'decayPower',
                    'disconnectPlayerSeconds',
                    'disconnectPositionJumps',
                    'fastestLoopSeconds',
                    'fastLoopSeconds',
                    'gameMode',
                    'immunitySeconds',
                    'isMaintenance',
                    'leadercap',
                    'maxEvolves',
                    'noBoot',
                    'noDecay',
                    'orbCutoffSeconds',
                    'orbOnDeathPercent',
                    'orbTimeoutSeconds',
                    'pickupDistance',
                    'pointsPerEvolve',
                    'pointsPerKill',
                    'pointsPerOrb',
                    'pointsPerPowerup',
                    'pointsPerReward',
                    'powerupXp0',
                    'powerupXp1',
                    'powerupXp2',
                    'powerupXp3',
                    'resetInterval',
                    'rewardItemAmount',
                    'rewardItemName',
                    'rewardItemType',
                    'rewardSpawnLoopSeconds',
                    'rewardWinnerAmount',
                    'rewardWinnerName',
                    'roundLoopSeconds',
                    'sendUpdateLoopSeconds',
                    'slowLoopSeconds',
                    'spritesPerPlayerCount',
                    'spritesStartCount',
                    'spritesTotal',
                  ].map((v) => ({ label: v, value: v }))}
                  onChange={(e) => setSetConfigKeyText(e.value)}
                />
                <Input
                  type="text"
                  placeholder="value"
                  value={setConfigValueText}
                  onChange={(e) => setSetConfigValueText(e.target.value)}
                  style={{ marginLeft: 10 }}
                />
              </Flex>
              <br />
              <br />
              <Button scale="sm" onClick={() => setConfig(setConfigKeyText, setConfigValueText)}>
                Set Config
              </Button>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <Flex flexDirection="row" alignItems="center" justifyContent="center">
                <Select
                  value={roundGameMode}
                  options={[
                    {
                      label: 'Standard',
                      value: 'Standard',
                    },
                    {
                      label: 'Lets Be Friends',
                      value: 'Lets Be Friends',
                    },
                    {
                      label: 'Deathmatch',
                      value: 'Deathmatch',
                    },
                    {
                      label: 'Evolution',
                      value: 'Evolution',
                    },
                    {
                      label: 'Orb Master',
                      value: 'Orb Master',
                    },
                    {
                      label: 'Sprite Leader',
                      value: 'Sprite Leader',
                    },
                    {
                      label: 'Fast Drake',
                      value: 'Fast Drake',
                    },
                    {
                      label: 'Bird Eye',
                      value: 'Bird Eye',
                    },
                    {
                      label: 'Friendly Reverse',
                      value: 'Friendly Reverse',
                    },
                    {
                      label: 'Reverse Evolve',
                      value: 'Reverse Evolve',
                    },
                    {
                      label: 'Marco Polo',
                      value: 'Marco Polo',
                    },
                    {
                      label: 'Classic Marco Polo',
                      value: 'Classic Marco Polo',
                    },
                    {
                      label: 'Leadercap',
                      value: 'Leadercap',
                    },
                    {
                      label: 'Sticky Mode',
                      value: 'Sticky Mode',
                    },
                    {
                      label: 'Sprite Juice',
                      value: 'Sprite Juice',
                    },
                    {
                      label: 'Pandamonium',
                      value: 'Pandamonium',
                    },
                    {
                      label: 'Indiana Jones',
                      value: 'Indiana Jones',
                    },
                  ]}
                  onChange={handleSetRoundGameMode}
                />
              </Flex>
              <br />
              <Button scale="sm" onClick={() => startRound(roundGameMode)}>
                Start Round
              </Button>
              <br />
              <br />
              <br />
              <br />
              <Button scale="sm" onClick={startRuneRoyale}>
                Start Rune Royale
              </Button>
              <br />
              <br />
              <Button scale="sm" onClick={pauseRuneRoyale}>
                Pause Rune Royale
              </Button>
              <br />
              <br />
              <Button scale="sm" onClick={unpauseRuneRoyale}>
                Unpause Rune Royale
              </Button>
              <br />
              <br />
              <Button scale="sm" onClick={stopRuneRoyale}>
                Stop Rune Royale
              </Button>
              <br />
              <br />
              <br />
              <br />
              <Button scale="sm" onClick={enableGodParty}>
                Enable God Party
              </Button>
              <br />
              <br />
              <Button scale="sm" onClick={disableGodParty}>
                Disable God Party
              </Button>
              <br />
              <br />
              <br />
              <br />
              <Button scale="sm" onClick={enableBattleRoyale}>
                Enable Battle Royale
              </Button>
              <br />
              <br />
              <Button scale="sm" onClick={disableBattleRoyale}>
                Disable Battle Royale
              </Button>
              <br />
              <br />
              <br />
              <br />
              <Button scale="sm" onClick={makeBattleHarder}>
                Harder
              </Button>
              <br />
              <br />
              <Button scale="sm" onClick={makeBattleEasier}>
                Easier
              </Button>
              <br />
              <br />
              <Button scale="sm" onClick={resetBattleDifficulty}>
                Reset Difficulty
              </Button>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <Button scale="sm" onClick={pauseRound}>
                Pause Round
              </Button>
              <br />
              <br />
              <Button scale="sm" onClick={enableForcedLevel2}>
                Enabled Forced Level 2
              </Button>
              <br />
              <br />
              <Button scale="sm" onClick={disableForcedLevel2}>
                Disable Forced Level 2
              </Button>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <Button scale="sm" onClick={restartServer}>
                Restart Server
              </Button>
              <br />
              <br />
              <Button scale="sm" onClick={enableMaintenance}>
                Enable Maintenance
              </Button>
              <br />
              <br />
              <Button scale="sm" onClick={disableMaintenance}>
                Disable Maintenance
              </Button>
              <br />
              <br />
              <Button scale="sm" onClick={() => broadcastMessage('Restarting server at end of this round.')}>
                Announce Maintenance
              </Button>
              {/* <Button onClick={updateConfig}>Tweak Decay</Button>
                        <Button onClick={updateConfig2}>Tweak Spawns</Button>
                        <Button onClick={updateConfig3}>Tweak 3</Button> */}
              <br />
              <br />
              <br />
              <br />
              <Input type="text" value={reportUserText} onChange={(e) => setReportUserText(e.target.value)} />
              <br />
              <br />
              <Button scale="sm" onClick={() => reportUser(reportUserText)}>
                Report User
              </Button>
              <br />
              <br />
              <br />
              <br />
              <Input
                type="text"
                value={banUserText}
                onChange={(e) => setBanUserText(e.target.value)}
                placeholder="Address"
              />
              <br />
              <br />
              <Input
                type="text"
                value={banReasonText}
                onChange={(e) => setBanReasonText(e.target.value)}
                placeholder="Reason"
              />
              <br />
              <br />
              <p>Ban Until:</p>
              <br />
              <Input
                type="text"
                value={banUntil}
                onChange={(e) => setBanUntil(e.target.value)}
                placeholder="Until timestamp"
              />
              <br />
              <br />
              <Button scale="sm" onClick={() => banUser(realm, banUserText, banReasonText, banUntil)}>
                Ban User
              </Button>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <Input type="text" value={unbanUserText} onChange={(e) => setUnbanUserText(e.target.value)} />
              <br />
              <br />
              <Button scale="sm" onClick={() => unbanUser(realm, unbanUserText)}>
                Unban User
              </Button>
              <br />
              <br />
              <br />
              <br />
              <Input type="text" value={addModText} onChange={(e) => setAddModText(e.target.value)} />
              <br />
              <br />
              <Button scale="sm" onClick={() => addMod(realm, addModText)}>
                Add Mod
              </Button>
              <br />
              <br />
              <br />
              <br />
              <Input type="text" value={removeModText} onChange={(e) => setRemoveModText(e.target.value)} />
              <br />
              <br />
              <Button scale="sm" onClick={() => removeMod(realm, removeModText)}>
                Remove Mod
              </Button>
              <br />
              <br />
              <br />
              <br />
              <Input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
              <br />
              <br />
              <Button scale="sm" onClick={() => broadcastMessage(messageText)}>
                Broadcast Message
              </Button>
            </>
          ) : null}
        </MainCard>
      </Cards>
      <Cards>
        <MainCard style={{ overflow: 'visible' }}>
          <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
            Admin Panel
          </Heading>
          <hr />
          <p>Distribute Items/Tokens</p>
          <br />
          <Input
            type="text"
            value={distributeTokensUsernames}
            onChange={(e) => setDistributeTokensUsernames(e.target.value)}
            placeholder="username1,username2"
          />
          <br />
          <br />
          <Input
            type="text"
            value={distributeTokensAmounts}
            onChange={(e) => setDistributeTokensAmounts(e.target.value)}
            placeholder="zod=1,el=2,zavox=1"
          />
          <br />
          <br />
          <Input
            type="text"
            value={distributeTokensReason}
            onChange={(e) => setDistributeTokensReason(e.target.value)}
            placeholder="Reason"
          />
          <br />
          <br />
          <Button
            scale="sm"
            onClick={() =>
              distributeTokens(distributeTokensAmounts, distributeTokensReason, distributeTokensUsernames)
            }>
            Distribute
          </Button>
          <br />
          <hr />
          <br />
          <p>Distribute Achievements</p>
          <br />
          <Input
            type="text"
            value={distributeAchievementsUsernames}
            onChange={(e) => setDistributeAchievementsUsernames(e.target.value)}
            placeholder="username1,username2"
          />
          <br />
          <br />
          <Input
            type="text"
            value={distributeAchievementsAmounts}
            onChange={(e) => setDistributeAchievementsAmounts(e.target.value)}
            placeholder="CRAFT_1=1,JOINED_SANCTUARY=1"
          />
          <br />
          <br />
          <Input
            type="text"
            value={distributeAchievementsReason}
            onChange={(e) => setDistributeAchievementsReason(e.target.value)}
            placeholder="Reason"
          />
          <br />
          <br />
          <Button
            scale="sm"
            onClick={() =>
              distributeAchievements(
                distributeAchievementsAmounts,
                distributeAchievementsReason,
                distributeAchievementsUsernames
              )
            }>
            Distribute
          </Button>
          <br />
          <br />
          <p>Compare Users</p>
          <Input
            type="text"
            value={compareUser1}
            onChange={(e) => setCompareUser1(e.target.value)}
            placeholder="User 1"
          />
          <br />
          <br />
          <Input
            type="text"
            value={compareUser2}
            onChange={(e) => setCompareUser2(e.target.value)}
            placeholder="User 2"
          />
          <br />
          <br />
          <Button scale="sm" onClick={() => compareUsers(compareUser1, compareUser2)}>
            Compare
          </Button>
          <br />
          <br />
          <p>Result: {sameUserMessage ? sameUserMessage : 'Pending'}</p>
        </MainCard>
      </Cards>
    </Page>
  );
};

export default Evolution;

// {/* <p>Loading {progression * 100} percent...</p> */}
