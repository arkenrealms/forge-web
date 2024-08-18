import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { safeRuneList } from '~/config';
import useCache from '~/hooks/useCache';
import useWeb3 from '~/hooks/useWeb3';
import { Card, CardBody, Flex, Heading, Text } from '~/ui';
import { getArcaneCharacterContract } from '~/utils/contractHelpers';
import CardValue from './CardValue';

const StyledRuneStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
`;

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Row2 = styled(Row)`
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const arcaneCharactersContract = getArcaneCharacterContract();

const RuneStats = () => {
  const { t } = useTranslation();
  const { address: account } = useWeb3();
  const cache = useCache();

  const runeSupply = cache.runes.rxs.circulatingSupply;
  const runePrice = cache.runes.rxs.price;
  const runeBurned = cache.runes.rxs.totalBurned;
  const runeMarketCap = cache.runes.rxs.circulatingSupply * cache.runes.rxs.price;
  const runes = safeRuneList;
  const runesMarketCap = runes
    .slice(0, runes.length - 2)
    .map((rune) => (cache.runes[rune] ? cache.runes[rune].circulatingSupply * cache.runes[rune].price : 0))
    .reduce((a, b) => a + b);

  const characterCount = cache.stats.totalCharacters;
  const itemCount = cache.stats.totalItems;

  return (
    <StyledRuneStats>
      <CardBody>
        <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <Heading size="xl" mb="24px" color="white">
            {t('Stats')}
          </Heading>
        </Flex>
        <Row>
          <Text>{t('Total Characters')}</Text>
          {characterCount && <CardValue fontSize="16px" value={characterCount} decimals={0} />}
        </Row>
        <Row>
          <Text>{t('Total Items')}</Text>
          {itemCount && <CardValue fontSize="16px" value={itemCount} decimals={0} />}
        </Row>
        {/* <Row>
          <Text>{t('Total RXS Supply')}</Text>
          {runeSupply && <CardValue fontSize="16px" value={runeSupply} decimals={0} />}
        </Row>
        <Row>
          <Text>{t('Total RXS Burned')}</Text>
          <CardValue fontSize="16px" decimals={0} value={runeBurned} />
        </Row>
        <Row>
          <Text>{t('Market Cap ($RXS only)')}</Text>
          {runeSupply && <CardValue fontSize="16px" value={runePrice * runeSupply} decimals={0} prefix="$" />}
        </Row>
        {runeMarketCap + runesMarketCap > 0 ? (
          <Row>
            <Text>{t('Market Cap ($RXS + runes)')}</Text>
            {runeSupply && <CardValue fontSize="16px" value={runeMarketCap + runesMarketCap} decimals={0} prefix="$" />}
          </Row>
        ) : null} */}
        <Row></Row>
        <Row></Row>
        <Row></Row>
        {/* {['rxs', ...safeRuneList].map((rune) => {
          if (!cache.runes[rune]) return null;
          const { price } = cache.runes[rune];

          return (
            <div key={rune}>
              <Text color="textSubtle" mb="5px">
                <strong>{t(rune.toUpperCase())}</strong> {`$${price.toFixed(4)}`}
              </Text>
            </div>
          );
        })} */}
        <Flex justifyContent="space-between">
          <NavLink exact activeClassName="active" to="/stats"></NavLink>
          <NavLink exact activeClassName="active" to="/stats">
            <span style={{ padding: '5px', marginTop: '26px', float: 'left', fontSize: '18px' }}>View more</span>
            {/* <ArrowForwardIcon mt={30} color="primary" /> */}
          </NavLink>
        </Flex>
      </CardBody>
    </StyledRuneStats>
  );
};

export default RuneStats;
