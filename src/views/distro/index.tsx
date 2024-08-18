import React, { useCallback, useEffect, useState, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Button, Heading, Toggle, Text, Flex, BaseLayout, Card } from '~/ui';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import { useToast } from '~/state/hooks';
import useWeb3 from '~/hooks/useWeb3';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import { ConnectNetwork } from '~/components/ConnectNetwork';
import Select, { OptionProps } from '~/components/Select/Select';
import { getUserAddressByUsername } from '~/state/profiles/getProfile';
import { Link as RouterLink, NavLink, useLocation, useNavigate } from 'react-router-dom';

const debug = process.env.NODE_ENV !== 'production';
const playerWhitelist = ['Botter'];

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`;

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

const AdminTools = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.7);
  padding: 20px;
  margin: 20px;
`;

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

let signature = null;

const Evolution: React.FC<any> = () => {
  const location = useLocation();
  const match = parseMatch(location);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { account, library } = useWeb3();
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
  const [reportUserText, setReportUserText] = useState('');
  const [banUserText, setBanUserText] = useState('');
  const [unbanUserText, setUnbanUserText] = useState('');
  const [addModText, setAddModText] = useState('');
  const [removeModText, setRemoveModText] = useState('');
  const [setConfigKeyText, setSetConfigKeyText] = useState('');
  const [setConfigValueText, setSetConfigValueText] = useState('');
  const [replayRoundId, setReplayRoundId] = useState('');
  const [roundGameMode, setRoundGameMode] = useState('Standard');
  const { toastError, toastSuccess } = useToast();

  const [messageText, setMessageText] = useState(
    'Cheating/exploiting will result in ban. Read the announcement: https://t.me/ArkenRealms/397'
  );
  const [isAdmin, setIsAdmin] = useState(
    window.location.hostname === 'dev.arken.gg' || playerWhitelist.includes(username)
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

  useEffect(
    function () {
      if (!window) return;

      async function init() {
        const coeff = 1000 * 60 * 2;
        const date = new Date(); //or use any other date
        const rand = new Date(Math.round(date.getTime() / coeff) * coeff).getTime();
        // const rand1 = Math.floor(Math.random() * Math.floor(999999))
        const response1 = await fetch(`https://envoy.arken.gg/evolution/servers.json?${rand}`);
        const servers = await response1.json();

        setRealms(servers);
        setRealm(servers[tab]);

        const list = [];

        for (const server of servers) {
          try {
            const response = await fetch('https://' + server.endpoint + `/info`);
            const responseData = await response.json();

            list.push({
              ...server,
              ...responseData,
            });
          } catch (e) {
            console.log('Server offline: ' + e);
          }
        }

        setServerInfoList(list);

        const players = {};
        const noticesList = [];

        for (const server of list) {
          if (!server.connectedPlayers) continue;
          for (const player of server.connectedPlayers) {
            if (!players[player]) players[player] = 0;

            players[player] += 1;

            if (players[player] > 1) {
              noticesList.push({
                key: 'multipleServers',
                text: `Player on multiple servers: ${player} (${players[player]})`,
              });
            }
          }
        }

        setNotices(noticesList);
      }

      init();

      const inter = setInterval(init, 1 * 60 * 1000);

      return () => {
        clearInterval(inter);
      };
    },
    [isAdmin, tab]
  );

  useEffect(
    function () {
      if (!realm) return;
      if (!account) return;
      if (!window) return;

      async function init() {
        try {
          const response = await fetch('https://' + realm.endpoint + `/info`);
          const responseData = await response.json();

          setRealmInfo(responseData);

          setUsers(responseData.connectedPlayers);

          setIsServerOffline(false);
        } catch (e) {
          setIsServerOffline(true);
        }
      }

      init();

      const inter = setInterval(init, 1 * 60 * 1000);

      return () => {
        clearInterval(inter);
      };
    },
    [account, realm]
  );

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

  const reportUser = async (user) => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, signature: signature.hash }),
    };

    const reportAddress = await getUserAddressByUsername(user);
    fetch('https://' + realm.endpoint + '/report/' + reportAddress, requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));

    toastSuccess('Called reportUser');
  };

  const banUser = async (user) => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, signature: signature.hash }),
    };

    const banAddress = await getUserAddressByUsername(user);
    fetch('https://' + realm.endpoint + '/ban/' + banAddress, requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));

    toastSuccess('Called banUser');
  };

  const unbanUser = async (user) => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, signature: signature.hash }),
    };

    const unbanAddress = await getUserAddressByUsername(user);
    fetch('https://' + realm.endpoint + '/unban/' + unbanAddress, requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  const messageUser = async (user, text) => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, message: text, signature: signature.hash }),
    };

    const messageAddress = await getUserAddressByUsername(user);
    fetch('https://' + realm.endpoint + '/message/' + messageAddress, requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  const makeBattleHarder = async () => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, signature: signature.hash }),
    };

    try {
      fetch('https://' + realm.endpoint + '/makeBattleHarder', requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));

      toastSuccess('Called makeBattleHarder');
    } catch (e) {
      toastError('Error');
    }
  };

  const makeBattleEasier = async () => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, signature: signature.hash }),
    };

    try {
      fetch('https://' + realm.endpoint + '/makeBattleEasier', requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));

      toastSuccess('Called makeBattleEasier');
    } catch (e) {
      toastError('Error');
    }
  };

  const resetBattleDifficulty = async () => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, signature: signature.hash }),
    };

    try {
      fetch('https://' + realm.endpoint + '/resetBattleDifficulty', requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));

      toastSuccess('Called resetBattleDifficulty');
    } catch (e) {
      toastError('Error');
    }
  };

  const enableGodParty = async () => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, signature: signature.hash }),
    };

    try {
      fetch('https://' + realm.endpoint + '/startGodParty', requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));

      toastSuccess('Called enableGodParty');
    } catch (e) {
      toastError('Error');
    }
  };

  const disableGodParty = async () => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, signature: signature.hash }),
    };

    try {
      fetch('https://' + realm.endpoint + '/stopGodParty', requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));

      toastSuccess('Called disableGodParty');
    } catch (e) {
      toastError('Error');
    }
  };

  const enableForcedLevel2 = async () => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, signature: signature.hash }),
    };

    try {
      fetch('https://' + realm.endpoint + '/enableForceLevel2', requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));

      toastSuccess('Called enableForcedLevel2');
    } catch (e) {
      toastError('Error');
    }
  };

  const disableForcedLevel2 = async () => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, signature: signature.hash }),
    };

    try {
      fetch('https://' + realm.endpoint + '/disableForceLevel2', requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));

      toastSuccess('Called disableForcedLevel2');
    } catch (e) {
      toastError('Error');
    }
  };

  const enableBattleRoyale = async () => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, signature: signature.hash }),
    };

    try {
      fetch('https://' + realm.endpoint + '/startBattleRoyale', requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));

      toastSuccess('Called enableBattleRoyale');
    } catch (e) {
      toastError('Error');
    }
  };

  const disableBattleRoyale = async () => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, signature: signature.hash }),
    };

    try {
      fetch('https://' + realm.endpoint + '/stopBattleRoyale', requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));

      toastSuccess('Called disableBattleRoyale');
    } catch (e) {
      toastError('Error');
    }
  };

  const addMod = async (user) => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, signature: signature.hash }),
    };

    try {
      const userAddress = await getUserAddressByUsername(user);
      fetch('https://' + realm.endpoint + '/addMod/' + userAddress, requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));

      toastSuccess('Called addMod');
    } catch (e) {
      toastError('Error');
    }
  };

  const removeMod = async (user) => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, signature: signature.hash }),
    };

    try {
      const userAddress = await getUserAddressByUsername(user);
      fetch('https://' + realm.endpoint + '/removeMod/' + userAddress, requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));

      toastSuccess('Called removeMod');
    } catch (e) {
      toastError('Error');
    }
  };

  const startRound = async (gameMode) => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, signature: signature.hash, gameMode }),
    };

    try {
      fetch('https://' + realm.endpoint + '/startRound', requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));

      toastSuccess('Called startRound');
    } catch (e) {
      toastError('Error');
    }
  };

  const pauseRound = async () => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, signature: signature.hash }),
    };

    try {
      fetch('https://' + realm.endpoint + '/pauseRound', requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));

      toastSuccess('Called pauseRound');
    } catch (e) {
      toastError('Error');
    }
  };

  const handleSetRoundGameMode = (option: OptionProps): void => {
    setRoundGameMode(option.value);
  };

  const setConfig = async (keyText, valueText) => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, signature: signature.hash }),
    };

    fetch('https://' + realm.endpoint + '/setConfig/' + keyText + '/' + valueText, requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  const enableMaintenance = async () => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, signature: signature.hash }),
    };

    fetch('https://' + realm.endpoint + '/maintenance', requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  const disableMaintenance = async () => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, signature: signature.hash }),
    };

    fetch('https://' + realm.endpoint + '/unmaintenance', requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  const broadcastMessage = async (text) => {
    if (!signature) signature = await getSignature(account);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: account, message: text, signature: signature.hash }),
    };

    fetch('https://' + realm.endpoint + '/broadcast', requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  const setGodmode = async (user) => {
    const data = {
      event: 'SetGodmode',
      value: user,
      signature: await getSignature(),
    };
  };

  const addLocalRealm = () => {
    setIsAdmin(true);
  };

  const updateRealm = (r) => {
    if (!r) return;
    setRealm(r);
    updateTab(realms.findIndex((t2) => t2.key === r.key));
  };

  return (
    <Container>
      <GlobalStyles />
      <ConnectNetwork />
      <Cards>
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
        </MainCard>

        <MainCard>
          {!realms ? <p>Loading realms...</p> : null}
          <br />
          <br />
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
          <Input
            type="text"
            placeholder="key"
            value={setConfigKeyText}
            onChange={(e) => setSetConfigKeyText(e.target.value)}
          />
          <br />
          <br />
          <Input
            type="text"
            placeholder="value"
            value={setConfigValueText}
            onChange={(e) => setSetConfigValueText(e.target.value)}
          />
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
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <Select
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
                  label: 'Perfection',
                  value: 'perfection',
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
                  label: 'Leadercap',
                  value: 'Leadercap',
                },
                {
                  label: 'Sticky Mode',
                  value: 'Sticky Mode',
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
          <Input type="text" value={banUserText} onChange={(e) => setBanUserText(e.target.value)} />
          <br />
          <br />
          <Button scale="sm" onClick={() => banUser(banUserText)}>
            Ban User
          </Button>
          <br />
          <br />
          <br />
          <br />
          <Input type="text" value={unbanUserText} onChange={(e) => setUnbanUserText(e.target.value)} />
          <br />
          <br />
          <Button scale="sm" onClick={() => unbanUser(unbanUserText)}>
            Unban User
          </Button>
          <br />
          <br />
          <br />
          <br />
          <Input type="text" value={addModText} onChange={(e) => setAddModText(e.target.value)} />
          <br />
          <br />
          <Button scale="sm" onClick={() => addMod(addModText)}>
            Add Mod
          </Button>
          <br />
          <br />
          <br />
          <br />
          <Input type="text" value={removeModText} onChange={(e) => setRemoveModText(e.target.value)} />
          <br />
          <br />
          <Button scale="sm" onClick={() => removeMod(removeModText)}>
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
        </MainCard>
      </Cards>
      <Cards>
        <MainCard>
          {serverInfoList.map((serverInfo) => {
            return (
              <ServerBox>
                <p>{serverInfo.key}</p>
                <br />
                <p>
                  <strong>Players:</strong> {serverInfo.playerTotal}
                </p>
                <br />
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
        </MainCard>

        <MainCard>
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            {users.map((user) => (
              <AdminUserRow key={user}>
                {user}{' '}
                <Button scale="sm" onClick={() => banUser(user)}>
                  Ban
                </Button>{' '}
                <Button scale="sm" onClick={() => setGodmode(user)}>
                  Godmode
                </Button>{' '}
                <Button scale="sm" onClick={() => messageUser(user, messageText)}>
                  Message
                </Button>
              </AdminUserRow>
            ))}
            <br />
            <p>Message Text:</p>
            <br />
            <Input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
          </Flex>
        </MainCard>
      </Cards>
    </Container>
  );
};

export default Evolution;

// {/* <p>Loading {progression * 100} percent...</p> */}
