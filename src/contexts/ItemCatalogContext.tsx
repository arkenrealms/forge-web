import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getWeb3NoAccount } from '~/utils/web3';
import BigNumber from 'bignumber.js';
import { decodeItem } from '@arken/node/util/decoder';
import { getArcaneItemContract } from '~/utils/contractHelpers';
import { makeBatchRequest } from '~/utils/web3';
import useInterval from '~/hooks/useInterval';
import { useBarracks, useMasterchef } from '~/hooks/useContract';
import useWeb3 from '~/hooks/useWeb3';

const arcaneItemsContract = getArcaneItemContract();

export type NftMap = {
  [key: number]: {
    tokenUri: string;
    tokenIds: number[];
  };
};

const ItemCatalogContext = React.createContext({
  nfts: {},
  refresh: () => {},
  fetchItem: (itemId) => {},
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const ItemCatalogContextProvider = ({ children }) => {
  const [nfts, setNfts] = useState({});
  const [lastUpdatedTime, setLastUpdatedTime] = useState(new Date().getTime() + 10 * 1000);

  const fetchItem = async (itemId) => {
    console.log('Fetching items for', itemId);

    try {
      nfts[itemId] = (await (await fetch(`https://s1.envoy.arken.asi.sh/items/${itemId}/tokens.json`)).json()) as any;

      setNfts(nfts);
    } catch (e) {
      console.warn(e);
      //dispatch({ type: 'reset', state })
    }
  };

  const refresh = () => {
    console.log('Refreshing item catalog');

    // console.log('eeeee')
    console.log(lastUpdatedTime, new Date().getTime());
    if (lastUpdatedTime >= new Date().getTime()) {
      setTimeout(refresh, 5 * 1000);
      return;
    }
    // const diff = new Date().getTime() - lastUpdatedTime
    // console.log('vvvv', new Date().getTime() , lastUpdatedTime, account ,userAddress, diff)

    // setUserAddress(account)

    console.log('Updating last update  time to: ' + new Date().getTime() + 10 * 1000);

    setLastUpdatedTime(new Date().getTime() + 10 * 1000);

    // setLastUpdatedTime(0)
  }; //dispatch({ type: 'refresh', state, timestamp: Date.now() })

  // useInterval(() => {
  //   if (lastUpdatedTime <= new Date().getTime()) {
  //     setLastUpdatedTime(0)
  //   }
  // }, 15 * 1000)

  return (
    <ItemCatalogContext.Provider
      value={{
        nfts,
        refresh,
        fetchItem,
      }}>
      {children}
    </ItemCatalogContext.Provider>
  );
};

export { ItemCatalogContext, ItemCatalogContextProvider };
