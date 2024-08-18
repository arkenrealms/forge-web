import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import useWeb3 from '~/hooks/useWeb3';
import { useNative, useRxs, useArcaneTrader } from '~/hooks/useContract';
import { CheckmarkCircleIcon, ErrorIcon, Flex, LinkExternal, Text, Button, Card, CardBody, Heading } from '~/ui';

const Container = styled.div``;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default () => {
  const { address: account } = useWeb3();
  const traderContract = useArcaneTrader();

  const delistOldMarketTrades = async () => {
    const endpoint = 'https://envoy.arken.gg';
    const response = await fetch(endpoint + `/trades-v1.json`);
    const trades = await response.json();

    const myTrades = trades.filter((trade) => trade.status === 'available' && trade.seller === account);

    if (!myTrades.length) {
      alert('No trades found');
      return;
    }

    alert(`${myTrades.length} trades found`);

    for (const trade of myTrades) {
      try {
        await traderContract.methods
          .delist(trade.tokenId)
          .send({ from: account })
          .reject(() => {});
      } catch (e) {
        console.log('Didnt work');
      }

      // await sleep(2 * 1000)
    }
  };

  return (
    <>
      <Card style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          Special
        </Heading>
        <hr />
        <CardBody>
          <Flex justifyContent="center" flexDirection="column" alignItems="center">
            <Button onClick={delistOldMarketTrades}>Delist Old Market Items</Button>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};
