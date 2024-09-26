import React, { useState, useCallback, useEffect } from 'react';
import { Heading, Card, CardBody, Text, Link, Flex, BaseLayout } from '~/ui';
import Page from '~/components/layout/Page';
import PageWindow from '~/components/PageWindow';
import styled from 'styled-components';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import CardValue from '~/components/raid/CardValue';
import useCache from '~/hooks/useCache';
import SimpleLineChart from '~/components/SimpleLineChart';
import { safeRuneList } from '~/config';

const StyledRuneStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  overflow: visible;
`;

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 1;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 6;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 1;
    }
  }
`;

const ChartWrapper = styled.div`
  position: relative;
  // bottom: 0px;
  // left: -20px;
  width: 100%;
  flex: 1;
  // background: radial-gradient(#1d8a99, teal);
  // padding: 1em;
  // width: 540px;
  height: 300px;
  // pointer-events: none;
  z-index: 10;
  // opacity: 0.5;
`;

const CardBody2 = styled(CardBody)`
  overflow: visible;
`;

const isLocal = process.env.REACT_APP_RUNE_ENV === 'local';

const Stats = () => {
  const { t } = useTranslation();
  const cache = useCache();
  const [historical, setHistorical] = useState(null);

  useEffect(function () {
    if (!window) return;

    const coeff = 1000 * 60 * 5;
    const date = new Date(); //or use any other date
    const rand = new Date(Math.round(date.getTime() / coeff) * coeff).getTime();

    async function init() {
      const data = (await (
        await fetch((isLocal ? 'http://localhost:6001' : 'https://s1.envoy.arken.asi.sh') + '/historical.json?' + rand)
      ).json()) as any;

      setHistorical(data);
    }

    init();
  }, []);

  if (!historical) return <></>;

  return (
    <Page style={{ maxWidth: '100%' }}>
      <Heading size="xl" mb="24px">
        {t(`Price`)}
      </Heading>
      {historical?.stats?.tvl ? (
        <StyledRuneStats>
          <CardBody>
            <Heading size="xl" mb="24px">
              {t('TVL')}
            </Heading>
            <ChartWrapper>
              <SimpleLineChart
                yLabel="Total"
                xLabel="Days"
                data={historical?.stats?.tvl?.map((point, i) => ({
                  name: `${i + 1}`,
                  AVG: point[1],
                }))}
              />
            </ChartWrapper>
          </CardBody>
        </StyledRuneStats>
      ) : null}
      <br />

      {historical?.liquidity?.total ? (
        <StyledRuneStats>
          <CardBody>
            <Heading size="xl" mb="24px">
              {t('Total Liquidity')}
            </Heading>
            <ChartWrapper>
              <SimpleLineChart
                yLabel="Total"
                xLabel="Days"
                data={historical?.liquidity?.total?.map((point, i) => ({
                  name: `${i + 1}`,
                  AVG: point[1],
                }))}
              />
            </ChartWrapper>
          </CardBody>
        </StyledRuneStats>
      ) : null}
      <br />

      {historical?.stats?.totalCharacters ? (
        <StyledRuneStats>
          <CardBody>
            <Heading size="xl" mb="24px">
              {t('Total Characters')}
            </Heading>
            <ChartWrapper>
              <SimpleLineChart
                yLabel="Total"
                xLabel="Days"
                data={historical?.stats?.totalCharacters?.map((point, i) => ({
                  name: `${i + 1}`,
                  AVG: point[1],
                }))}
              />
            </ChartWrapper>
          </CardBody>
        </StyledRuneStats>
      ) : null}
      <br />

      {historical?.stats?.totalItems ? (
        <StyledRuneStats>
          <CardBody>
            <Heading size="xl" mb="24px">
              {t('Total Items')}
            </Heading>
            <ChartWrapper>
              <SimpleLineChart
                yLabel="Total"
                xLabel="Days"
                data={historical?.stats?.totalItems?.map((point, i) => ({
                  name: `${i + 1}`,
                  AVG: point[1],
                }))}
              />
            </ChartWrapper>
          </CardBody>
        </StyledRuneStats>
      ) : null}
      <br />

      {historical?.stats?.marketItemsAvailable ? (
        <StyledRuneStats>
          <CardBody>
            <Heading size="xl" mb="24px">
              {t('Total Market Items (Available)')}
            </Heading>
            <ChartWrapper>
              <SimpleLineChart
                yLabel="Total"
                xLabel="Days"
                data={historical?.stats?.marketItemsAvailable?.map((point, i) => ({
                  name: `${i + 1}`,
                  AVG: point[1],
                }))}
              />
            </ChartWrapper>
          </CardBody>
        </StyledRuneStats>
      ) : null}
      <br />

      {historical?.stats?.marketItemsSold ? (
        <StyledRuneStats>
          <CardBody>
            <Heading size="xl" mb="24px">
              {t('Total Market Items (Sold)')}
            </Heading>
            <ChartWrapper>
              <SimpleLineChart
                yLabel="Total"
                xLabel="Days"
                data={historical?.stats?.marketItemsSold?.map((point, i) => ({
                  name: `${i + 1}`,
                  AVG: point[1],
                }))}
              />
            </ChartWrapper>
          </CardBody>
        </StyledRuneStats>
      ) : null}
      <br />

      {historical?.stats?.marketItemsDelisted ? (
        <StyledRuneStats>
          <CardBody>
            <Heading size="xl" mb="24px">
              {t('Total Market Items (Delisted)')}
            </Heading>
            <ChartWrapper>
              <SimpleLineChart
                yLabel="Total"
                xLabel="Days"
                data={historical?.stats?.marketItemsDelisted?.map((point, i) => ({
                  name: `${i + 1}`,
                  AVG: point[1],
                }))}
              />
            </ChartWrapper>
          </CardBody>
        </StyledRuneStats>
      ) : null}
      <br />

      {historical?.stats?.marketAverageSoldPrice ? (
        <StyledRuneStats>
          <CardBody>
            <Heading size="xl" mb="24px">
              {t('Average Market Price (Sold) (RXS)')}
            </Heading>
            <ChartWrapper>
              <SimpleLineChart
                yLabel="Total"
                xLabel="Days"
                data={historical?.stats?.marketAverageSoldPrice?.map((point, i) => ({
                  name: `${i + 1}`,
                  AVG: point[1],
                }))}
              />
            </ChartWrapper>
          </CardBody>
        </StyledRuneStats>
      ) : null}
      {historical?.price
        ? Object.keys(historical?.price).map((key) => (
            <StyledRuneStats>
              <CardBody2>
                <Heading size="md" mb="24px">
                  {t(`${key.toUpperCase()}`)}
                </Heading>
                <ChartWrapper>
                  <SimpleLineChart
                    data={historical?.price[key].slice(1).map((point, i) => ({
                      name: `${i + 1}`,
                      AVG: point[1],
                    }))}
                  />
                </ChartWrapper>
                <Flex flexDirection="column" alignItems="center" justifyContent="center" mb="10px">
                  ${Math.round(historical?.price[key][historical?.price[key].length - 1][1] * 100) / 100}
                  <br />${Math.round(cache.runes?.[key]?.price * 100) / 100}
                </Flex>
              </CardBody2>
            </StyledRuneStats>
          ))
        : null}
      <br />
      <hr />
      <br />
      <br />
      <br />
      <Heading size="xl" mb="24px">
        {t(`Circulating Supply`)}
      </Heading>
      <Cards>
        {historical?.circulatingSupply
          ? Object.keys(historical?.circulatingSupply).map((key) => (
              <StyledRuneStats>
                <CardBody2>
                  <Heading size="md" mb="24px">
                    {t(`${key.toUpperCase()} `)}
                  </Heading>
                  <ChartWrapper>
                    <SimpleLineChart
                      data={historical?.circulatingSupply[key].slice(1).map((point, i) => ({
                        name: `${i + 1}`,
                        AVG: Math.round(point[1]),
                      }))}
                    />
                  </ChartWrapper>
                  <Flex flexDirection="column" alignItems="center" justifyContent="center" mb="10px">
                    {Math.round(historical?.circulatingSupply[key][historical?.circulatingSupply[key].length - 1][1])}
                  </Flex>
                </CardBody2>
              </StyledRuneStats>
            ))
          : null}
      </Cards>
      <br />
      <hr />
      <br />
      <br />
      <br />
      <Heading size="xl" mb="24px">
        {t(`Org Token Holdings`)}
      </Heading>
      <Cards>
        {historical?.orgToken?.holdings
          ? Object.keys(historical?.orgToken?.holdings).map((key) => (
              <StyledRuneStats>
                <CardBody2>
                  <Heading size="md" mb="24px">
                    {t(`${key.toUpperCase()} `)}
                  </Heading>
                  <ChartWrapper>
                    <SimpleLineChart
                      data={historical?.orgToken?.holdings[key].slice(1).map((point, i) => ({
                        name: `${i + 1}`,
                        AVG: Math.round(point[1]),
                      }))}
                    />
                  </ChartWrapper>
                  <Flex flexDirection="column" alignItems="center" justifyContent="center" mb="10px">
                    {Math.round(historical?.orgToken?.holdings[key][historical?.orgToken?.holdings[key].length - 1][1])}
                    <br />
                    {Math.round(cache.runes?.[key].holders.orgToken)}
                    <br />
                    <br />
                    {cache.runes?.[key].circulatingSupply
                      ? Math.round((cache.runes?.[key].holders.orgToken / cache.runes?.[key].circulatingSupply) * 100)
                      : 'X'}
                    %
                  </Flex>
                </CardBody2>
              </StyledRuneStats>
            ))
          : null}
      </Cards>
      <br />
      <hr />
      <br />
      <br />
      <br />
      <Heading size="xl" mb="24px">
        {t(`Dev Holdings`)}
      </Heading>
      <Cards>
        {historical?.dev.holdings
          ? Object.keys(historical?.dev.holdings).map((key) => (
              <StyledRuneStats>
                <CardBody2>
                  <Heading size="md" mb="24px">
                    {t(`${key.toUpperCase()} `)}
                  </Heading>
                  <ChartWrapper>
                    <SimpleLineChart
                      data={historical?.dev.holdings[key].slice(1).map((point, i) => ({
                        name: `${i + 1}`,
                        AVG: Math.round(point[1]),
                      }))}
                    />
                  </ChartWrapper>
                  <Flex flexDirection="column" alignItems="center" justifyContent="center" mb="10px">
                    {Math.round(historical?.dev.holdings[key][historical?.dev.holdings[key].length - 1][1])}
                    <br />
                    {Math.round(cache.runes?.[key].holders.dev)}
                  </Flex>
                </CardBody2>
              </StyledRuneStats>
            ))
          : null}
      </Cards>
      <br />
      <hr />
      <br />
      <br />
      <br />
      <Heading size="xl" mb="24px">
        {t(`Vault Holdings`)}
      </Heading>
      <Cards>
        {historical?.vault.holdings
          ? Object.keys(historical?.vault.holdings).map((key) => (
              <StyledRuneStats>
                <CardBody2>
                  <Heading size="md" mb="24px">
                    {t(`${key.toUpperCase()}`)}
                  </Heading>
                  <ChartWrapper>
                    <SimpleLineChart
                      data={historical?.vault.holdings[key].slice(1).map((point, i) => ({
                        name: `${i + 1}`,
                        AVG: Math.round(point[1]),
                      }))}
                    />
                  </ChartWrapper>
                  <Flex flexDirection="column" alignItems="center" justifyContent="center" mb="10px">
                    {Math.round(historical?.vault.holdings[key][historical?.vault.holdings[key].length - 1][1])}
                    <br />
                    {Math.round(cache.runes?.[key].holders.vault)}
                  </Flex>
                </CardBody2>
              </StyledRuneStats>
            ))
          : null}
      </Cards>
      <br />
      <hr />
      <br />
      <br />
      <br />
      <Heading size="xl" mb="24px">
        {t(`Charity Holdings`)}
      </Heading>
      <Cards>
        {historical?.charity.holdings
          ? Object.keys(historical?.charity.holdings).map((key) => (
              <StyledRuneStats>
                <CardBody2>
                  <Heading size="md" mb="24px">
                    {t(`${key.toUpperCase()}`)}
                  </Heading>
                  <ChartWrapper>
                    <SimpleLineChart
                      data={historical?.charity.holdings[key].slice(1).map((point, i) => ({
                        name: `${i + 1}`,
                        AVG: Math.round(point[1]),
                      }))}
                    />
                  </ChartWrapper>
                  <Flex flexDirection="column" alignItems="center" justifyContent="center" mb="10px">
                    {Math.round(historical?.charity.holdings[key][historical?.charity.holdings[key].length - 1][1])}
                    <br />
                    {Math.round(cache.runes?.[key].holders.charity)}
                  </Flex>
                </CardBody2>
              </StyledRuneStats>
            ))
          : null}
      </Cards>
      <br />
      <hr />
      <br />
      <br />
      <br />
      <Heading size="xl" mb="24px">
        {t(`Raid Holdings`)}
      </Heading>
      <Cards>
        {historical?.raid.holdings
          ? Object.keys(historical?.raid.holdings).map((key) => (
              <StyledRuneStats>
                <CardBody2>
                  <Heading size="md" mb="24px">
                    {t(`${key.toUpperCase()}`)}
                  </Heading>
                  <ChartWrapper>
                    <SimpleLineChart
                      data={historical?.raid.holdings[key].slice(1).map((point, i) => ({
                        name: `${i + 1}`,
                        AVG: Math.round(point[1]),
                      }))}
                    />
                  </ChartWrapper>
                  <Flex flexDirection="column" alignItems="center" justifyContent="center" mb="10px">
                    {Math.round(historical?.raid.holdings[key][historical?.raid.holdings[key].length - 1][1])}
                    <br />
                    {Math.round(cache.runes?.[key].holders.raid)}
                  </Flex>
                </CardBody2>
              </StyledRuneStats>
            ))
          : null}
      </Cards>
      <br />
      <hr />
      <br />
      <br />
      <br />
      <Heading size="xl" mb="24px">
        {t(`Evolution Holdings`)}
      </Heading>
      <Cards>
        {historical?.evolution?.holdings
          ? Object.keys(historical?.evolution?.holdings).map((key) => (
              <StyledRuneStats>
                <CardBody2>
                  <Heading size="md" mb="24px">
                    {t(`${key.toUpperCase()}`)}
                  </Heading>
                  <ChartWrapper>
                    <SimpleLineChart
                      data={historical?.evolution?.holdings[key].slice(1).map((point, i) => ({
                        name: `${i + 1}`,
                        AVG: Math.round(point[1]),
                      }))}
                    />
                  </ChartWrapper>
                  <Flex flexDirection="column" alignItems="center" justifyContent="center" mb="10px">
                    {Math.round(
                      historical?.evolution?.holdings[key][historical?.evolution?.holdings[key].length - 1][1]
                    )}
                    <br />
                    {Math.round(cache.runes?.[key].holders.evolution)}
                  </Flex>
                </CardBody2>
              </StyledRuneStats>
            ))
          : null}
      </Cards>
      <br />
      <hr />
      <br />
      <br />
      <br />
      <Heading size="xl" mb="24px">
        {t(`Total Holdings`)}
      </Heading>
      <Cards>
        {historical?.total?.totals
          ? Object.keys(historical?.total?.totals).map((key) => (
              <StyledRuneStats>
                <CardBody2>
                  <Heading size="md" mb="24px">
                    {t(`${key.toUpperCase()}`)}
                  </Heading>
                  <ChartWrapper>
                    <SimpleLineChart
                      data={historical?.total?.totals[key].slice(1).map((point, i) => ({
                        name: `${i + 1}`,
                        AVG: Math.round(point[1]),
                      }))}
                    />
                  </ChartWrapper>
                  <Flex flexDirection="column" alignItems="center" justifyContent="center" mb="10px">
                    {Math.round(historical?.total?.totals[key][historical?.total?.totals[key].length - 1][1])}
                  </Flex>
                </CardBody2>
              </StyledRuneStats>
            ))
          : null}
        <br />
      </Cards>
    </Page>
  );
};

export default Stats;
