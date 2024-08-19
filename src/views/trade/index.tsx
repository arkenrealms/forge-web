import React, { useEffect, useState } from 'react';
import { decodeItem } from '@arken/node/util/decoder';
import Page from '~/components/layout/Page';
import MarketTrade from '~/components/MarketTrade';
import { ItemType } from '~/contexts/MarketContext';
import useMarket from '~/hooks/useMarket';
import { Skeleton } from '~/ui';

let init = false;

const MarketTradeView = ({ match }) => {
  const { id }: { id: string } = match.params;
  const [trade, setTrade] = useState(null);
  const { trades, setQuery, setStatus } = useMarket();
  // console.log(4444, id)
  useEffect(() => {
    if (!trades || !trades[ItemType.NFTs] || trades[ItemType.NFTs].length === 0) return;
    const tradeData = trades[ItemType.NFTs].find((t) => t.id === parseInt(id));

    if (tradeData) {
      setTrade({
        ...tradeData,
        item: decodeItem(tradeData.tokenId),
      });
    }
  }, [id, trades]);

  useEffect(() => {
    if (init) return;
    if (!id) return;

    init = true;

    setStatus('');
    setQuery([id]);
  }, [id, trades, setQuery, setStatus]);

  return (
    <Page>
      {trade ? (
        <MarketTrade trade={trade} />
      ) : (
        <div style={{ padding: 10 }}>
          <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
        </div>
      )}
    </Page>
  );
};

export default MarketTradeView;
