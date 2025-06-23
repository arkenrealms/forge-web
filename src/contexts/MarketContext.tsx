import React, { useLayoutEffect, useMemo, useRef, useState, useContext, useCallback } from 'react';
import _ from 'lodash';
import useWeb3 from '~/hooks/useWeb3';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import history from '~/routerHistory';
import { trpc, trpcClient } from '~/utils/trpc';
import type * as Arken from '@arken/node/types';

export const ItemType = {
  Skins: 0,
  Pets: 1,
  NFTs: 2,
  Land: 3,
  NPCs: 4,
  DLCs: 5,
};

const defaultFilters = {
  page: 1,
  count: 2500,
  sort: 'updated',
  status: 'available',
  rarity: '',
  query: [],
  buyer: '',
  seller: '',
  advanced: true,
  myListingsOnly: false,
  meOnly: false,
  perfectOnly: false,
  tab: 2,
  branch: '1',
} as any;

const MarketContext = React.createContext({
  ...defaultFilters,
  tradesByToken: {},
  trades: {
    [ItemType.Skins]: undefined,
    [ItemType.Pets]: undefined,
    [ItemType.NFTs]: undefined,
    [ItemType.Land]: undefined,
    [ItemType.NPCs]: undefined,
    [ItemType.DLCs]: undefined,
  },
});

let fetchTimeout;

const MarketContextProvider = ({ children }) => {
  const { address: account } = useWeb3();
  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;
  const [tab, _setTab] = useState(2);
  const [perfectOnly, setPerfectOnly] = useState(false);
  const [meOnly, setMeOnly] = useState(false);
  const [myListingsOnly, setMyListingsOnly] = useState(false);
  const [advanced, setAdvanced] = useState(isMobile ? false : true);
  // @ts-ignore
  const [query, setQuery] = useState([]);
  const [seller, setSeller] = useState('');
  const [buyer, setBuyer] = useState('');
  const [rarity, setRarity] = useState('');
  const [status, setStatus] = useState('available');
  const [sort, setSort] = useState('updated');
  const [count, setCount] = useState(isMobile ? 1000 : 2500);
  const [page, setPage] = useState(1);
  const [branch, setBranch] = useState('1');

  const setTab = (tabIndex) => {
    setPerfectOnly(false);
    setMeOnly(false);
    setMyListingsOnly(false);
    // setAdvanced(isMobile ? false : true)
    setQuery([]);
    setSeller('');
    setBuyer('');
    setRarity('');
    setStatus('available');
    setPage(1);
    setBranch('1');
    _setTab(tabIndex);
  };

  const [trades, setTrades] = useState({
    [ItemType.Skins]: [],
    [ItemType.Pets]: [],
    [ItemType.NFTs]: [],
    [ItemType.Land]: [],
    [ItemType.NPCs]: [],
    [ItemType.DLCs]: [],
  });

  const [tradesByToken, setTradesByToken] = useState({});

  useLayoutEffect(() => {
    const action = async () => {
      // setTrades(undefined)

      try {
        const coeff = 1000 * 60 * 5;
        const date = new Date(); //or use any other date
        const rand = new Date(Math.round(date.getTime() / coeff) * coeff).getTime();
        // const rand = Math.floor(Math.random() * Math.floor(999999))
        const searchParams = new URLSearchParams({
          account: account || '',
          seller,
          buyer,
          sort,
          status,
          rarity,
          perfectOnly: perfectOnly ? 'true' : '',
          meOnly: meOnly ? 'true' : '',
          myListingsOnly: myListingsOnly ? 'true' : '',
          advanced: advanced ? 'true' : '',
          tab: tab.toString(),
          count: count.toString(),
          page: '1', //page.toString(),
          branch,
          rand: rand.toString(),
        });

        for (const q of query) {
          if (!q) continue;
          searchParams.append('query', q);
        }

        // const data = (await (
        //   await fetch('https://s1.envoy.arken.asi.sh/trades?' + searchParams.toString())
        // ).json()) as any;
        // @ts-ignore
        const res: Arken.Core.Types.Trade[] = [];
        // await trpcClient.query('seer.core.getTrades', {
        //   account: account || '',
        //   seller,
        //   buyer,
        //   sort,
        //   status,
        //   rarity,
        //   perfectOnly: perfectOnly ? 'true' : '',
        //   meOnly: meOnly ? 'true' : '',
        //   myListingsOnly: myListingsOnly ? 'true' : '',
        //   advanced: advanced ? 'true' : '',
        //   tab: tab.toString(),
        //   count: count.toString(),
        //   page: '1', //page.toString(),
        //   branch,
        //   rand: rand.toString(),
        // });

        // console.log('vnvnvnv', res);

        const newTrades = {
          ...trades,
          [tab]: res,
        };

        // if (_.isEqual(trades, newTrades)) return;

        setTrades(newTrades);

        const _tradesByToken = {};

        for (const trade of res) {
          _tradesByToken[trade.meta.tokenId] = trade;
        }

        setTradesByToken(_tradesByToken);
      } catch (e) {
        console.log('Fetching trades failed');
        setTrades(undefined);
      }
    };
    const interval = setInterval(action, 60 * 1000);

    clearTimeout(fetchTimeout);
    fetchTimeout = setTimeout(action, 1 * 1000);

    return () => clearInterval(interval);
  }, [
    setTrades,
    advanced,
    meOnly,
    myListingsOnly,
    perfectOnly,
    query,
    seller,
    buyer,
    rarity,
    sort,
    status,
    tab,
    branch,
    count,
    page,
    account,
  ]);

  const clearFilters = () => {
    // setTab(defaultFilters.tab)
    // setPerfectOnly(defaultFilters.perfectOnly)
    // setMeOnly(defaultFilters.meOnly)
    // setMyListingsOnly(defaultFilters.myListingsOnly)
    // setAdvanced(defaultFilters.advanced)
    // // @ts-ignore
    // setQuery(defaultFilters.query)
    // setSeller(defaultFilters.seller)
    // setBuyer(defaultFilters.buyer)
    // setRarity(defaultFilters.rarity)
    // setStatus(defaultFilters.status)
    // setSort(defaultFilters.sort)
    // setCount(defaultFilters.count)
    // setPage(defaultFilters.page)
  };

  const isFiltered =
    JSON.stringify({
      branch,
      page,
      count,
      sort,
      status,
      rarity,
      query,
      buyer,
      seller,
      advanced,
      myListingsOnly,
      meOnly,
      perfectOnly,
      tab,
    }) !==
    JSON.stringify({
      branch: defaultFilters.branch,
      page: defaultFilters.page,
      count: defaultFilters.count,
      sort: defaultFilters.sort,
      status: defaultFilters.status,
      rarity: defaultFilters.rarity,
      query: defaultFilters.query,
      buyer: defaultFilters.buyer,
      seller: defaultFilters.seller,
      advanced: defaultFilters.advanced,
      myListingsOnly: defaultFilters.myListingsOnly,
      meOnly: defaultFilters.meOnly,
      perfectOnly: defaultFilters.perfectOnly,
      defaultBranch: defaultFilters.defaultBranch,
      tab: defaultFilters.tab,
    });

  // console.log('qqq3', JSON.stringify({
  //   page,
  //   count,
  //   sort,
  //   status,
  //   rarity,
  //   query,
  //   buyer,
  //   seller,
  //   advanced,
  //   myListingsOnly,
  //   meOnly,
  //   perfectOnly,
  //   tab,
  // }), JSON.stringify({
  //   page: defaultFilters.page,
  //   count: defaultFilters.count,
  //   sort: defaultFilters.sort,
  //   status: defaultFilters.status,
  //   rarity: defaultFilters.rarity,
  //   query: defaultFilters.query,
  //   buyer: defaultFilters.buyer,
  //   seller: defaultFilters.seller,
  //   advanced: defaultFilters.advanced,
  //   myListingsOnly: defaultFilters.myListingsOnly,
  //   meOnly: defaultFilters.meOnly,
  //   perfectOnly: defaultFilters.perfectOnly,
  //   tab: defaultFilters.tab,
  // }))

  return (
    <MarketContext.Provider
      value={{
        defaultFilters,
        tradesByToken,
        trades,
        branch,
        setBranch,
        page,
        setPage,
        seller,
        setSeller,
        buyer,
        setBuyer,
        query,
        setQuery,
        sort,
        setSort,
        rarity,
        setRarity,
        status,
        setStatus,
        myListingsOnly,
        setMyListingsOnly,
        meOnly,
        setMeOnly,
        perfectOnly,
        setPerfectOnly,
        advanced,
        setAdvanced,
        tab,
        setTab,
        count,
        setCount,
        clearFilters,
        isFiltered,
      }}>
      {children}
    </MarketContext.Provider>
  );
};

export { MarketContext, MarketContextProvider };
