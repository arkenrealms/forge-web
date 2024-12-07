import React, { useCallback, useEffect, useState } from 'react';
import shortId from 'shortid';
import useLive from '~/hooks/useLive';
import useWeb3 from '~/hooks/useWeb3';
import initialData from './cacheData.json';

initialData.runes.rune.price = 0;

const CacheContext = React.createContext({});

const initialized = {};

const isLocal = process.env.REACT_APP_RUNE_ENV === 'local';

const CacheContextProvider = ({ children }) => {
  const { socket: liveSocket } = useLive();
  const { address: account } = useWeb3();
  const [app, setApp] = useState(initialData.app as any);
  const [stats, setStats] = useState(initialData.stats as any);
  const [runes, setRunes] = useState(initialData.runes as any);
  const [evolution, setEvolution] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [historical, setHistorical] = useState(initialData.historical as any);
  const [achievements, setAchievements] = useState({ [account]: initialData.achievements as any });
  const [overview, setOverview] = useState({ [account]: initialData.overview as any });
  const [userAddress, setUserAddress] = useState(null);
  const [tokenSkins, setTokenSkins] = useState({});
  const [userSkins, setUserSkins] = useState({});
  const [userNotes, setUserNotes] = useState({});

  const fetchUserData = useCallback(
    function (address) {
      if (!address || !liveSocket) return;

      console.log('Fetching skins');

      liveSocket.emit('CS_GetTokenSkinsRequest', { id: shortId() });
      liveSocket.emit('CS_GetUserSkinsRequest', { id: shortId(), data: { address } });
      liveSocket.emit('CS_GetUserNotesRequest', { id: shortId(), data: { address } });
    },
    [liveSocket]
  );

  useEffect(() => {
    if (account && liveSocket && !initialized['liveSocket']) {
      initialized['liveSocket'] = true;

      liveSocket.emit('CS_ConnectRequest', { id: shortId(), data: { address: account } });

      liveSocket.on('CS_GetTokenSkinsResponse', async function ({ id, data }) {
        console.log('Setting token skins', data.data);
        setTokenSkins(data.data);
      });

      liveSocket.on('CS_GetUserSkinsResponse', async function ({ id, data }) {
        console.log('Setting user skins', data.data);
        setUserSkins(data.data);
      });

      liveSocket.on('CS_GetUserNotesResponse', async function ({ id, data }) {
        console.log('Setting user notes', data.data);
        setUserNotes(data.data);
      });

      fetchUserData(account);
    }

    const action = async () => {
      console.log('Fetching cache');

      // const rand = Math.floor(Math.random() * Math.floor(999999))
      const coeff = 1000 * 60 * 5;
      const date = new Date(); //or use any other date
      const rand = new Date(Math.round(date.getTime() / coeff) * coeff).getTime();

      try {
        {
          const data = (await (
            await fetch((isLocal ? 'http://localhost:6001' : 'https://s1.envoy.arken.asi.sh') + '/app.json?' + rand)
          ).json()) as any;

          setApp(data);
        }

        // {
        //   const data = (await (
        //     await fetch((isLocal ? 'http://localhost:6001' : 'https://s1.envoy.arken.asi.sh') + '/stats.json?' + rand)
        //   ).json()) as any;

        //   setStats(data);
        // }

        // {
        //   const data = (await (
        //     await fetch((isLocal ? 'http://localhost:6001' : 'https://s1.envoy.arken.asi.sh') + '/runes.json?' + rand)
        //   ).json()) as any;

        //   setRunes(data);
        // }

        // {
        //   const data = (await (
        //     await fetch((isLocal ? 'http://localhost:6001' : 'https://s1.envoy.arken.asi.sh') + '/historical.json?' + rand)
        //   ).json()) as any

        //   setHistorical(data)
        // }

        {
          const data = (await (
            await fetch(
              (isLocal ? 'http://localhost:6001' : 'https://s1.envoy.arken.asi.sh') + '/activeUsers.json?' + rand
            )
          ).json()) as any;

          const now = new Date().getTime() / 1000;
          setActiveUsers(data.filter((u) => u.updated > now - 5 * 60));
        }

        {
          const data = (await (
            await fetch(
              (isLocal ? 'http://localhost:6001' : 'https://s1.envoy.arken.asi.sh') + '/evolution/config.json?' + rand
            )
          ).json()) as any;

          setEvolution({
            config: data,
          });
        }
      } catch (e) {
        console.log('Fetching JSON issue');
      }
    };

    action();

    const interval = setInterval(action, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [
    account,
    liveSocket,
    fetchUserData,
    setStats,
    setRunes,
    setHistorical,
    setEvolution,
    setApp,
    setActiveUsers,
    setTokenSkins,
    setUserSkins,
    setUserNotes,
  ]);

  useEffect(() => {
    const accountAddress = userAddress ? userAddress : account;
    if (!accountAddress) return;
    if (initialized[accountAddress]) return;

    console.log('Fetching profile data ', accountAddress);

    initialized[accountAddress] = true;

    const action = async () => {
      const rand = Math.floor(Math.random() * Math.floor(999999));

      try {
        {
          const data = (await (
            await fetch(
              (isLocal ? 'http://localhost:6001' : 'https://s1.envoy.arken.asi.sh') +
                '/users/' +
                accountAddress +
                '/overview.json?' +
                rand
            )
          ).json()) as any;

          if (data) {
            setOverview({
              ...overview,
              [accountAddress]: data,
            });
          }
        }

        {
          const data = (await (
            await fetch(
              (isLocal ? 'http://localhost:6001' : 'https://s1.envoy.arken.asi.sh') +
                '/users/' +
                accountAddress +
                '/achievements.json?' +
                rand
            )
          ).json()) as any;

          if (data) {
            setAchievements({
              ...achievements,
              [accountAddress]: data,
            });
          }
        }
      } catch (e) {
        console.log('Fetching JSON issue');
      }
    };

    action();

    const interval = setInterval(action, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [account, userAddress, setAchievements, achievements, overview]);
  // console.log(JSON.stringify({ app, stats, runes, historical, "overview": {}, "achievements": [] }))
  return (
    <CacheContext.Provider
      value={{
        app,
        stats,
        runes,
        activeUsers,
        historical,
        achievements,
        overview,
        evolution,
        tokenSkins,
        userSkins,
        userNotes,
        fetchUserData,
        fetchAddress: setUserAddress,
      }}>
      {children}
    </CacheContext.Provider>
  );
};

export { CacheContext, CacheContextProvider };
