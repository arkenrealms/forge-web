import React, { useEffect, useLayoutEffect, useRef, useState, useContext } from 'react';
import random from 'lodash/random';
import io from 'socket.io-client';
import useFetch from '~/hooks/useFetch';
import { useToast } from '~/state/hooks';
import md5 from 'js-md5';
import useInventory from '~/hooks/useInventory';
import useWeb3 from '~/hooks/useWeb3';
import shortId from 'shortid';
import PlayerAction from '~/components/PlayerAction';
import { log, logError } from '@arken/node/util';

const getSocket = (endpoint) => {
  console.log('Connecting to', endpoint);
  return io(endpoint, {
    transports: ['websocket'],
    upgrade: false,
    reconnection: false,
    reconnectionAttempts: 20,
    autoConnect: false,
    auth: (cb) => {
      cb({ token: window?.localStorage?.token });
    },
    // io.on("connection", (socket) => {
    //   console.log(socket.handshake.auth); // prints { token: "abcd" }
    // });
    // extraHeaders: {
    //   "my-custom-header": "1234"
    // }
  });
};

async function getSignedRequest(web3, library, address, data = null) {
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

const disconnectTime = 5 * 60 * 1000;
let connectionTimeout;
// console.log(9999, process.env, process.env.REACT_APP_GTAG)
const isLocalTest = process.env.REACT_APP_LOCAL_TEST === 'true';
const databaserEndpoint = isLocalTest ? 'localhost:8443' : 's1.envoy.arken.asi.sh:8443'; // 'localhost:8443' //

const url = `https://s1.envoy.arken.asi.sh/notices.json`;
let timeout;
let reloadTimeout;
let socket;

async function callLiveServer(name, data = undefined, signature = undefined) {
  try {
    console.log('Live Call', name, data);

    return new Promise((resolve, reject) => {
      const id = shortId();

      const requestTimeout = setTimeout(function () {
        console.log('Request timeout');

        resolve({ status: 0, message: 'Request timeout' });

        delete ioCallbacks[id];
      }, 60 * 1000);

      ioCallbacks[id] = { resolve, reject, timeout: requestTimeout };

      socket.emit(name, { id, data, signature });
    });
  } catch (e) {
    console.log(e);
  }
}

const ignoredUsers = ['QuizMaster', 'Botter', 'Sdadasd', 'Pandamonium'];

const defaultFilters = [
  'market-buy',
  'evolution',
  'evolution1',
  'evolution1-winner',
  'evolution1-killstreak',
  'evolution2',
  'infinite',
  'infinite1',
  'raid',
  'raid1',
  'raid1-equipped',
  'raid1-unequipped',
  'raid1-burn',
  'raid1-bonus',
  'raid1-hidden-pool',
  'raid1-fee',
  'raid2',
  'guardians',
  'guardians1',
  'sanctuary',
  'sanctuary1',
  'admin',
  'moderator-action',
  'character-create',
  'character-transfer',
  'achievement',
  'item-craft',
  'item-transfer',
  'item-transmute',
  'item-disenchant',
  'guild-join',
  'reward-claim',
  'market-list',
  'market-delist',
  'market-update',
  'player-active',
  'player-inactive',
];

const runeRoyalePlacementMap = {
  1: 10,
  2: 7,
  3: 5,
  4: 3,
  5: 1,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
  10: 0,
  11: 0,
  12: 0,
  13: 0,
  14: 0,
  15: 0,
  16: 0,
  17: 0,
  18: 0,
  19: 0,
  20: 0,
};

type ContextProps = {
  call: any;
  callUnsigned: any;
  socket: any;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
  playerActions: Array<any>;
  playerNotices: Array<any>;
  filters: Array<any>;
  toggleFilter: any;
  showSettings: boolean;
  isRuneRoyale: boolean;
  isRuneRoyalePaused: boolean;
  runeRoyaleStandings: Array<any>;
};

const LiveContext = React.createContext<ContextProps>({
  socket: undefined,
  call: (m: any, d?: any) => {},
  callUnsigned: (m: any, d?: any) => {},
  playerActions: [],
  playerNotices: [],
  filters: [],
  toggleFilter: (filterKey: any) => {},
  showSettings: false,
  setShowSettings: () => {},
  isRuneRoyale: false,
  isRuneRoyalePaused: false,
  runeRoyaleStandings: [],
});

const ioCallbacks = {};
let userAddress;
let init;

const LiveContextProvider = ({ children }) => {
  const { account: address, library } = useWeb3();
  const { addTokenId } = useInventory();
  const { web3 } = useWeb3();
  const { data, reload } = useFetch(url);
  const { toastError, toastSuccess, toastInfo } = useToast();
  const [notices, setNotices] = useState(data?.[url]);
  const [actions, setActions] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const actionsData = useRef([]);
  const [isRuneRoyale, setIsRuneRoyale] = useState(false);
  const isRuneRoyaleRef = useRef(false);
  const [isRuneRoyalePaused, setIsRuneRoyalePaused] = useState(false);
  const isRuneRoyalePausedRef = useRef(false);
  const [runeRoyaleData, setRuneRoyaleData] = useState({});
  const runeRoyaleDataRef = useRef(runeRoyaleData);
  const [runeRoyaleRealm, setRuneRoyaleRealm] = useState(null);
  const runeRoyaleRealmRef = useRef(runeRoyaleRealm);
  const filtersRef = useRef(defaultFilters);
  const [filters, setFilters] = useState(defaultFilters);

  const toggleFilter = function (filterKey) {
    let _filters;
    if (filters.includes(filterKey)) _filters = filters.filter((f) => f !== filterKey);
    else _filters = [...filters, filterKey];

    filtersRef.current = _filters;

    setFilters(_filters);
  };

  useEffect(
    function () {
      if (window) {
        // @ts-ignore
        window.runeAddress = address;
      }
    },
    [address]
  );

  useEffect(
    function () {
      if (init) return;

      init = true;

      async function connect() {
        if (!toastInfo) return;
        if (socket) return;

        socket = getSocket(isLocalTest ? 'http://' + databaserEndpoint : 'https://' + databaserEndpoint);

        // socket.auth.token = "efgh";
        // socket.disconnect().connect();

        const tryReconnect = () => {
          setTimeout(() => {
            socket.io.open((err) => {
              if (err) {
                tryReconnect();
              }
            });
          }, 2000);
        };

        const onAny = function (eventName, res) {
          if (ioCallbacks[res.id]) {
            log('Callback', eventName);
            ioCallbacks[res.id].resolve(res.data);

            delete ioCallbacks[res.id];
          }
        };

        for (const eventName of [
          'CS_ClaimSkinResponse',
          'CS_AttachSkinResponse',
          'CS_DetachSkinResponse',
          'CS_DistributeTokensResponse',
          'CS_SaveNoteResponse',
          'CS_CompareUsersResponse',
        ]) {
          socket.on(eventName, function (res) {
            onAny(eventName, res);
          });
        }

        socket.on('connect', async function () {
          console.log('Connected live');
          // toastInfo('Connected')
        });

        socket.on('disconnect', async function () {
          console.log('Disconnected live');
          // toastInfo('Disconnected')
        });

        socket.on('PlayerAction', async function (actionData) {
          console.log('Received player action', actionData);

          // if (ignoredUsers.includes(actionData.username)) return //  && window.location.hostname !== 'localhost'

          actionsData.current = [
            {
              id: shortId(),
              visible: true,
              data: actionData,
            },
            ...actionsData.current,
          ];

          if (!filtersRef.current.includes('evolution'))
            actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('evolution') === -1);

          if (!filtersRef.current.includes('evolution1'))
            actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('evolution1') === -1);

          if (!filtersRef.current.includes('evolution2'))
            actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('evolution2') === -1);

          if (!filtersRef.current.includes('raid'))
            actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('raid') === -1);

          if (!filtersRef.current.includes('raid2'))
            actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('raid2') === -1);

          if (!filtersRef.current.includes('raid1'))
            actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('raid1') === -1);

          if (!filtersRef.current.includes('infinite'))
            actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('infinite') === -1);

          if (!filtersRef.current.includes('infinite1'))
            actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('infinite1') === -1);

          if (!filtersRef.current.includes('admin'))
            actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('admin') === -1);

          if (!filtersRef.current.includes('guardians'))
            actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('guardians') === -1);

          if (!filtersRef.current.includes('guardians1'))
            actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('guardians1') === -1);

          if (!filtersRef.current.includes('sanctuary'))
            actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('sanctuary') === -1);

          if (!filtersRef.current.includes('sanctuary1'))
            actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('sanctuary1') === -1);

          actionsData.current = actionsData.current.filter((n) => filtersRef.current.includes(n.data.key));

          setActions(actionsData.current);

          if (actionData.key === 'moderator-action' && actionData.method === 'RS_StartRuneRoyaleRequest') {
            isRuneRoyaleRef.current = true;
            setIsRuneRoyale(isRuneRoyaleRef.current);

            // @ts-ignore
            runeRoyaleDataRef.current = {};
            setRuneRoyaleData(runeRoyaleDataRef.current);

            runeRoyaleRealmRef.current = actionData.realmKey;
            setRuneRoyaleRealm(runeRoyaleRealmRef.current);
          }

          if (actionData.key === 'moderator-action' && actionData.method === 'RS_PauseRuneRoyaleRequest') {
            isRuneRoyalePausedRef.current = true;
            setIsRuneRoyalePaused(isRuneRoyalePausedRef.current);
          }

          if (actionData.key === 'moderator-action' && actionData.method === 'RS_UnpauseRuneRoyaleRequest') {
            isRuneRoyalePausedRef.current = false;
            setIsRuneRoyalePaused(isRuneRoyalePausedRef.current);
          }

          if (actionData.key === 'moderator-action' && actionData.method === 'RS_StopRuneRoyaleRequest') {
            isRuneRoyaleRef.current = false;
            setIsRuneRoyale(isRuneRoyaleRef.current);

            // @ts-ignore
            runeRoyaleDataRef.current = {};
            setRuneRoyaleData(runeRoyaleDataRef.current);
          }

          if (
            isRuneRoyaleRef.current &&
            !isRuneRoyalePausedRef.current &&
            runeRoyaleRealmRef.current === actionData.realmKey &&
            actionData.key === 'evolution1-winner'
          ) {
            if (!runeRoyaleDataRef.current[actionData.username]) runeRoyaleDataRef.current[actionData.username] = 0;

            runeRoyaleDataRef.current[actionData.username] += runeRoyalePlacementMap[actionData.placement] || 0;

            setRuneRoyaleData({ ...runeRoyaleDataRef.current });
          }

          if (actionData.key === 'raid1-equipped') {
            // @ts-ignore
            if (actionData.address === window.runeAddress) {
              // actionData.tokenId
              // addTokenId(actionData.tokenId)
            }
          }
        });

        setTimeout(function () {
          socket.connect();
        }, 500);
        // socket.connect()
      }

      connect();
    },
    [toastInfo, addTokenId]
  );

  useEffect(
    function () {
      if (reloadTimeout) return;

      function reloadInterval() {
        reload(url);

        reloadTimeout = setTimeout(reloadInterval, 30 * 1000);
      }

      reloadTimeout = setTimeout(reloadInterval, 30 * 1000);

      return () => {
        clearTimeout(reloadTimeout);
        reloadTimeout = undefined;
      };
    },
    [reload]
  );

  useEffect(
    function () {
      if (!toastInfo) return;
      // if (notices) return
      if (!data?.[url]) return;
      if (!window?.navigator?.userAgent) return;
      if (window.navigator.userAgent === 'ReactSnap') return;

      const lastVisibleId = notices?.find((n) => (n.visible ? true : false))?.id || data[url][data[url].length - 1].id;
      const lastVisibleIndex = !data[url][data[url].length - 1].visible
        ? 0
        : data[url].indexOf(data[url].find((d) => d.id === lastVisibleId)); // if the last item isn't visible, then its first load, make all visible

      for (let i = lastVisibleIndex; i < data[url].length; i++) {
        data[url][i].visible = true;
      }

      let _notices = data[url].filter((n) => filtersRef.current.includes(n.data.key));

      if (!filtersRef.current.includes('evolution'))
        _notices = _notices.filter((n) => n.data.key.indexOf('evolution') === -1);

      if (!filtersRef.current.includes('evolution1'))
        _notices = _notices.filter((n) => n.data.key.indexOf('evolution1') === -1);

      if (!filtersRef.current.includes('evolution2'))
        _notices = _notices.filter((n) => n.data.key.indexOf('evolution2') === -1);

      if (!filtersRef.current.includes('raid')) _notices = _notices.filter((n) => n.data.key.indexOf('raid') === -1);

      if (!filtersRef.current.includes('raid1')) _notices = _notices.filter((n) => n.data.key.indexOf('raid1') === -1);

      if (!filtersRef.current.includes('raid2')) _notices = _notices.filter((n) => n.data.key.indexOf('raid2') === -1);

      if (!filtersRef.current.includes('infinite'))
        _notices = _notices.filter((n) => n.data.key.indexOf('infinite') === -1);

      if (!filtersRef.current.includes('infinite1'))
        _notices = _notices.filter((n) => n.data.key.indexOf('infinite1') === -1);

      if (!filtersRef.current.includes('guardians'))
        _notices = _notices.filter((n) => n.data.key.indexOf('guardians') === -1);

      if (!filtersRef.current.includes('guardians1'))
        _notices = _notices.filter((n) => n.data.key.indexOf('guardians1') === -1);

      if (!filtersRef.current.includes('sanctuary'))
        _notices = _notices.filter((n) => n.data.key.indexOf('sanctuary') === -1);

      if (!filtersRef.current.includes('sanctuary1'))
        _notices = _notices.filter((n) => n.data.key.indexOf('sanctuary1') === -1);

      if (window.location.hostname !== 'localhost')
        _notices = _notices.filter((n) => !ignoredUsers.includes(n.data.username));

      if (JSON.stringify(_notices) !== JSON.stringify(notices)) {
        console.log('Updating notices');
        setNotices(_notices);

        const notice = _notices[Math.floor(Math.random() * Math.floor(_notices.length - 1))];
        const cacheKey = `notice_${notice.id}`;
        if (!window.localStorage.getItem(cacheKey)) {
          // toastInfo('', <PlayerAction action={notice.data} createdAt={notice.createdAt} />)

          window.localStorage.setItem(cacheKey, 'true');
        }
      }
    },
    [data, notices, toastInfo]
  );

  useEffect(
    function () {
      if (!notices) return;
      if (timeout) return;

      function makeVisible() {
        const _notices = notices;
        for (let i = 0; i <= _notices.length - 1; i++) {
          const notice = _notices[i];

          if (!notice.visible) {
            notice.visible = true;
            setNotices([..._notices]);
            timeout = setTimeout(makeVisible, 3 * 1000);
            return;
          }
        }

        timeout = setTimeout(makeVisible, 3 * 1000);
      }

      timeout = setTimeout(makeVisible, 3 * 1000);

      return () => {
        clearTimeout(timeout);
        timeout = undefined;
      };
    },
    [notices, setNotices]
  );

  userAddress = address;

  useLayoutEffect(function () {
    const connectionLoop = function () {
      clearTimeout(connectionTimeout);

      connectionTimeout = setTimeout(function () {
        if (
          window.location.pathname === '/live' ||
          userAddress === '0xa987f487639920A3c2eFe58C8FBDedB96253ed9B' ||
          userAddress === '0x05B72dfE4aE390d179848b3aD45Ca51E38069468'
        ) {
          connectionLoop();
          return;
        }

        socket.disconnect();
      }, disconnectTime);
    };

    document.body.addEventListener(
      'click',
      function () {
        if (socket.connected) {
          connectionLoop();
        } else {
          clearTimeout(connectionTimeout);

          connectionTimeout = setTimeout(function () {
            socket.connect();
          }, 1 * 1000);
        }
      },
      true
    );

    return () => {
      clearTimeout(connectionTimeout);
    };
  }, []);

  const filteredNotices = notices
    ?.filter((n) => !!n.visible)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 200);

  const filteredActions = actions?.filter((n) => !!n.visible).slice(0, 200);

  let runeRoyaleStandings = [];

  for (const name of Object.keys(runeRoyaleData)) {
    runeRoyaleStandings.push({
      name,
      points: runeRoyaleData[name],
    });
  }

  runeRoyaleStandings = runeRoyaleStandings.sort((a, b) => b.points - a.points);

  const call = async function sendRealmSocketRequest(method, data2 = {}) {
    const signature = await getSignedRequest(web3, library, address, data2);

    try {
      const resData = (await callLiveServer(method, data2, signature)) as any;

      if (resData.status === 1) {
        // toastSuccess('Called ' + method)
      } else {
        toastError('Request failed ' + method + ': ' + (resData.message || 'No info'));
      }

      return resData;
    } catch (e) {
      toastError('Couldnt send request');
    }
  };

  const callUnsigned = async function sendRealmSocketRequest(method, data2 = {}) {
    try {
      const resData = (await callLiveServer(method, data2)) as any;

      if (resData.status === 1) {
        // toastSuccess('Called ' + method)
      } else {
        toastError('Request failed ' + method + ': ' + (resData.message || 'No info'));
      }

      return resData;
    } catch (e) {
      toastError('Couldnt send request');
    }
  };

  return (
    <LiveContext.Provider
      value={{
        call,
        callUnsigned,
        socket,
        filters,
        toggleFilter,
        showSettings,
        setShowSettings,
        playerActions: filteredActions,
        playerNotices: filteredNotices,
        isRuneRoyale,
        isRuneRoyalePaused,
        runeRoyaleStandings,
      }}>
      {children}
    </LiveContext.Provider>
  );
};

export { LiveContext, LiveContextProvider };
