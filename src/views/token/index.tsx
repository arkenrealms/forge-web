import React, { useEffect, useRef, useState, useContext } from 'react';
import { decodeItem } from '@arken/node/util/decoder';
import styled from 'styled-components';
import { Button, Flex, Card, Heading, OpenNewIcon, Link } from '~/ui';
import Page from '~/components/layout/Page';
import PageWindow from '~/components/PageWindow';
import ItemInformation from '~/components/ItemInformation';

import { ItemInfo } from '~/components/ItemInfo';

const Container = styled.div``;

const ItemCard = styled(Card)`
  position: relative;
  font-weight: bold;

  // border-width: 18px 6px;
  // border-style: solid;
  // border-color: transparent;
  // border-image-source: url(/images/puzzle_bars.png);
  // border-image-slice: 25% fill;
  // border-image-width: 100px 100px;
  border: none;
  background: none;
  overflow: visible;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  filter: contrast(1.08);

  & > div {
    position: relative;
    z-index: 2;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    max-width: 470px;
  }
`;
const ItemCard2 = styled.div`
  position: relative;
  font-weight: bold;
  border-width: 15px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 80 repeat;
  border-image-width: 80px;
  background-color: rgba(0, 0, 0, 0.4);
  background-image: url(/images/background.jpeg);
  background-size: 400px;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  filter: contrast(1.08);
  text-align: center;
  color: #bb955e;
  text-shadow: 1px 1px 1px black;
  font-weight: bold;
  width: calc(100% - 0px);

  & > div {
    position: relative;
    z-index: 2;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
  }
`;

const AddressLink = styled(Link)`
  display: inline-block;
  font-weight: 400;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 80px;
  white-space: nowrap;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
    width: auto;
  }
`;

const Token = ({ match }) => {
  const { id: tokenId }: { id: string } = match.params;
  const item = decodeItem(tokenId);
  console.log(JSON.stringify(item, null, 2));
  return (
    <Page>
      <Container>
        <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <ItemCard padding="30px">
            {/* <ItemInformation item={item} showActions={false} /> */}
            <ItemInformation
              item={item}
              showActions={false}
              // hideMetadata
              // hideRoll
              // showBranches={false}
              // showPerfection={false}
            />
            <br />
            <br />
            <Flex alignItems="center">
              <AddressLink
                href={`https://bscscan.com/token/0xe97a1b9f5d4b849f0d78f58adb7dd91e90e0fb40?a=${tokenId}`}
                color="text"
                external>
                BSC Scan
              </AddressLink>
              <OpenNewIcon ml="4px" />
            </Flex>
          </ItemCard>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          {/* <ItemCard2>
            <ItemInformation item={item} showActions={false} hideMetadata price={0} />
          </ItemCard2> */}
        </Flex>
      </Container>
    </Page>
  );
};

export default Token;
