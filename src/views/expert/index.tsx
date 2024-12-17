import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import farmsConfig from '@arken/node/legacy/farmInfo';
import styled from 'styled-components';
import Page from '~/components/layout/Page';
import { useModal } from '~/components/Modal';
import PageWindow from '~/components/PageWindow';
import { PurchaseModal } from '~/components/PurchaseModal';
import Trollbox from '~/components/Trollbox';
import { CHEF_MAP } from '~/config';
import useAccount from '~/hooks/useAccount';
import { useTotalSupply } from '~/hooks/useTokenBalance';
import useWeb3 from '~/hooks/useWeb3';
import { Button, ButtonMenu, ButtonMenuItem, Card, CardBody, Flex, Heading, LinkExternal } from '~/ui';
import { getArcaneCharacterContract, getArcaneItemContract } from '~/utils/contractHelpers';

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

const Cards = styled.div`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
`;

const BuyLink = styled.a`
  color: #fff;
  padding: 3px 15px;
  margin-top: 20px;
  text-align: center;
  font-family: unset;

  &:hover {
    color: #bb955e;
  }
`;

const Frame = styled.iframe`
  width: 100%;
  height: 700px;
`;

const arcaneCharactersContract = getArcaneCharacterContract();
const arcaneItemsContract = getArcaneItemContract();

const Teams = () => {
  const { t } = useTranslation();
  const totalSupply = useTotalSupply('RUNE');
  const { stakedTokens } = useAccount();
  // const burnedBalance = getBalanceNumber(useBurnedBalance(getRuneAddress('RUNE')), 18)
  const [onPresentPurchaseModal] = useModal(<PurchaseModal defaultAmount={1 + ''} onSuccess={() => {}} />);
  // const runeSupply = totalSupply ? getBalanceNumber(totalSupply, 18) - burnedBalance : 0
  // const runePrice = useRunePrice('RUNE')

  const [tabIndex, setTabIndex] = useState(CHEF_MAP.length - 1);
  const [path, setPath] = useState('');

  const { address: account } = useWeb3();

  // const runeBalance = useRuneBalance('RXS')
  // const farmsLP = useFarms()
  // const hasRuneStaked = !!farmsLP.filter(
  //   (farm) =>
  //     farm.lpSymbol.indexOf('RXS') !== -1 &&
  //     farm.userData &&
  //     new BigNumber(farm.userData.stakedBalance).isGreaterThan(9500),
  // ).length
  // const hasRuneWallet = getBalanceNumber(runeBalance) >= 9500
  const hasRequirement = stakedTokens >= 10000;

  // const path = tabMap[tabIndex]

  useEffect(() => {
    const tabMap = {
      0: 'https://dnsonly.arken.gg/bsc/rune-el',
      1: 'https://dnsonly.arken.gg/bsc/rune-tir',
      2: 'https://dnsonly.arken.gg/bsc/rune-nef',
      3: 'https://dnsonly.arken.gg/bsc/rune-ith',
      4: 'https://dnsonly.arken.gg/bsc/rune-tal',
    };

    let p = tabMap[tabIndex];

    if (!p) {
      const symbol = CHEF_MAP[tabIndex];
      const { chefKey } = farmsConfig[0];
      const farmCount = farmsConfig.filter((f) => f.chefKey === chefKey).length;
      p = `https://dnsonly.arken.gg/bsc/rune/#${symbol}-${farmCount}`;
    }

    setPath('https://dnsonly.arken.gg/bsc/rune-el');
    setTimeout(() => setPath(p), 500);
  }, [tabIndex]);

  return (
    <Page>
      <PageWindow>
        {!hasRequirement ? (
          <Cards>
            <Card>
              <CardBody>
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <Heading size="xl" mb="24px">
                    {t('Expert Mode')}
                  </Heading>
                  <p>
                    <em>You must have 10,000 $RXS in your wallet to view.</em>
                  </p>
                  <br />
                  <Button onClick={onPresentPurchaseModal}>Buy 10,000 RXS</Button>
                </Flex>
              </CardBody>
            </Card>
          </Cards>
        ) : null}
        {hasRequirement ? (
          <Cards>
            <Card>
              <CardBody>
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <Heading size="xl" mb="24px">
                    {t('Expert Mode')}
                  </Heading>
                  <p>
                    <em>Use these if you know what you&apos;re doing.</em>
                  </p>
                </Flex>
              </CardBody>
            </Card>
            <br />
            <br />
            <Card>
              <Trollbox />
            </Card>
            <br />
            <br />
            <br />
            <br />
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <Card>
                <ButtonMenu activeIndex={tabIndex} scale="md" onItemClick={(index) => setTabIndex(index)}>
                  {CHEF_MAP.map((c) => <ButtonMenuItem key={c}>{t(c)}</ButtonMenuItem>) as any}
                </ButtonMenu>
              </Card>
            </Flex>
            <br />
            <br />
            <Card>
              <Frame src={`${path}`} />
            </Card>
            <br />
            <LinkExternal href={`${path}`}>Open In New Window</LinkExternal>
          </Cards>
        ) : null}
      </PageWindow>
    </Page>
  );
};

export default Teams;
