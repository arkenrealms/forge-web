import React, { useEffect, useRef, useState, useContext } from 'react';
import useSound from 'use-sound';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { Button, Flex, BaseLayout, Card, CardBody, Text, LinkExternal, AutoRenewIcon, Heading } from '~/ui';
import ItemInformation from '~/components/ItemInformation';
import { ItemsMainCategoriesType } from 'rune-backend-sdk/build/data/items.type';
import { useRunePrice } from '~/state/hooks';
import useRuneBalance from '~/hooks/useRuneBalance';
import { ItemCategoriesType, ItemDetails, ItemType } from 'rune-backend-sdk/build/data/items.type';
import Page from '~/components/layout/Page';
import history from '~/routerHistory';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import { getRuneAddress } from '~/utils/addressHelpers';
import PageWindow from '~/components/PageWindow';
import TotalValueLockedCard from '~/components/raid/TotalValueLockedCard';
import items from 'rune-backend-sdk/build/data/items';
import Inventory from '~/components/Inventory';
import { getBalanceNumber } from '~/utils/formatBalance';
import SimpleLineChart from '~/components/SimpleLineChart';
import useCache from '~/hooks/useCache';

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  grid-gap: 25px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 12;
    }
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

  & > div {
    grid-column: span 12;
    align-items: start;
    width: 100%;
  }
`;

const ChartWrapper = styled.div`
  // position: absolute;
  // bottom: 0px;
  // left: -20px;
  width: 100%;
  flex: 1;
  // background: radial-gradient(#1d8a99, teal);
  // padding: 1em;
  // width: 540px;
  height: 427px;
  // pointer-events: none;
  // z-index: 10;
  // opacity: 0.5;
`;

const InventoryWrapper = styled.div`
  position: relative;
  text-align: center;
`;

const ItemCard = styled(Card)`
  background: #000;
  background-image: none;
  padding: 10px;
  overflow: visible;

  & > div {
    position: relative;
    z-index: 2;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
  }
`;

const GameTitleMap = {
  1: 'Raid',
  2: 'Evolution',
  3: 'Infinite',
  4: 'Sanctuary',
};

const isLocal = process.env.REACT_APP_RUNE_ENV === 'local';

const Rune = ({ match }) => {
  const { t } = useTranslation();
  const { id }: { id: string } = match.params;
  const [symbol, setSymbol] = useState(id || 'el');
  const cache = useCache();
  const [historical, setHistorical] = useState({} as any);
  const balance = getBalanceNumber(useRuneBalance(symbol.toUpperCase()));
  const price = parseFloat(useRunePrice(symbol.toUpperCase()).toNumber().toLocaleString('en-US'));

  const item: any = items[ItemsMainCategoriesType.RUNES].find(
    (i) => i.name.toLowerCase().replace(' rune', '') === symbol
  );
  item.value = `${balance}`;
  console.log(7777, symbol, item);
  const tokenAddress = !item.isDisabled ? getRuneAddress(item.details.Symbol) : null;
  // ${(new Date(point[0])).getDate()}-${(new Date(point[0])).getMonth()}-${(new Date(point[0])).getFullYear()}

  useEffect(function () {
    if (!window) return;

    const coeff = 1000 * 60 * 5;
    const date = new Date(); //or use any other date
    const rand = new Date(Math.round(date.getTime() / coeff) * coeff).getTime();

    async function init() {
      const data = (await (
        await fetch((isLocal ? 'http://localhost:6001' : 'https://envoy.arken.gg') + '/historical.json?' + rand)
      ).json()) as any;

      setHistorical(data);
    }

    init();
  }, []);

  return (
    <>
      <Cards>
        <VerticalCards>
          <ItemCard>
            <InventoryWrapper>
              <Inventory
                columns={6}
                rows={19}
                showFull
                hideArrows
                noDisabled
                hideCategories
                defaultItemSelected={`inventory${parseInt(item.id) - 1}`}
                onItemSelected={(indexSelected) => {
                  const selectedItem = items[ItemsMainCategoriesType.RUNES].find(
                    (i) => i.id - 1 === parseInt(indexSelected.replace('inventory', ''))
                  );
                  // @ts-ignore
                  window.history.replaceState({}, 'Rune', `/runes/${selectedItem.details.Symbol.toLowerCase()}`);
                  // setTimeout(function() {
                  //   setSymbol(selectedItem.details.Symbol.toLowerCase())
                  // }, 1000)
                }}></Inventory>
            </InventoryWrapper>
          </ItemCard>
          <ItemCard>
            <Heading as="h2" size="lg" color="secondary" mb="24px">
              {t(`All Rune Prices`)}
            </Heading>
            <TotalValueLockedCard />
          </ItemCard>
        </VerticalCards>

        <VerticalCards>
          <ItemCard>
            <Heading as="h2" size="lg" color="secondary" mb="24px">
              {t(`${item.details.Symbol} Price History`)}
            </Heading>
            <ChartWrapper>
              {historical?.price?.[item.details.Symbol.toLowerCase()] && (
                <SimpleLineChart
                  data={historical?.price?.[item.details.Symbol.toLowerCase()].slice(1).map((point, i) => ({
                    name: ``,
                    AVG: point[1],
                  }))}
                />
              )}
              {/* {!historical?.price?.[item.details.Symbol.toLowerCase()] && <AutoRenewIcon spin />} */}
            </ChartWrapper>
            <br />
            {item.category === ItemCategoriesType.RUNE ? (
              <>
                {tokenAddress ? (
                  <div>
                    <Text mr="10px">{t('Contract: ')}</Text>
                    <LinkExternal href={`https://bscscan.com/address/${tokenAddress}`}>{tokenAddress}</LinkExternal>
                    <br />
                    <Text mr="10px">{t('Chart: ')}</Text>
                    <LinkExternal href={`https://dex.guru/token/${tokenAddress}-bsc`}>Dex.Guru</LinkExternal>
                  </div>
                ) : (
                  <Text mr="10px">{t('Not released yet.')}</Text>
                )}
              </>
            ) : null}
            <br />
            {item.details
              ? Object.keys(item.details).map((key) => (
                  <div key={key}>
                    <Text mr="10px" bold>
                      {t(key)}:
                    </Text>{' '}
                    <Text>{item.details[key]}</Text>
                    <br />
                  </div>
                ))
              : null}
            {item.branches
              ? Object.keys(item.branches).map((i) => (
                  <div key={i}>
                    <Text mr="10px" bold>
                      {GameTitleMap[i]} Utility:
                    </Text>{' '}
                    <Text>{item.branches[i].description || 'Not announced yet.'}</Text>
                    <br />
                  </div>
                ))
              : null}
          </ItemCard>
        </VerticalCards>
      </Cards>
    </>
  );
};

export default Rune;
