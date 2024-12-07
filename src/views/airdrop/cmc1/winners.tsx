import React, { useEffect, useRef, useState, useContext } from 'react';
import styled from 'styled-components';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { decodeItem } from '@arken/node/util/decoder';
import { useTranslation } from 'react-i18next';
import { Button, Flex, Card, Heading, CardBody, Link, BaseLayout, OpenNewIcon } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import Page from '~/components/layout/Page';
import { PurchaseModal } from '~/components/PurchaseModal';
import ItemInformation from '~/components/ItemInformation';
import i18n from '~/config/i18n';
import { ItemInfo } from '~/components/ItemInfo';
import winners from './winners.json';

const Container = styled.div``;

const Img = styled.img`
  filter: contrast(1.1) drop-shadow(2px 4px 6px black);
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
  }
`;
const HeadingSilver = styled.div`
  background-image: -webkit-linear-gradient(
    top,
    #bcbcbc 0%,
    #bcbcbc 17.5%,
    #cecece 33.75%,
    #f0f0f0 50%,
    #cecece 63.75%,
    #bcbcbc 77.5%,
    #bcbcbc 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #cecece;
  text-transform: uppercase;
  line-height: 1rem;
  font-family: 'webfontexl', 'Palatino Linotype', 'Times', serif;
  font-size: 85px;
  font-weight: normal;
  // filter: sepia(1) saturate(5) hue-rotate(-25deg);
  // sepia(1) saturate(5) hue-rotate(-25deg) grayscale(1) drop-shadow(0px 0px 10px #000) invert(1)
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 1));
`;

const HeadingPlain = styled.div`
  color: #cecece;
  text-transform: uppercase;
  line-height: 1rem;
  font-family: 'webfontexl', 'Palatino Linotype', 'Times', serif;
  font-size: 85px;
  font-weight: normal;
  // filter: sepia(1) saturate(5) hue-rotate(-25deg);
  // sepia(1) saturate(5) hue-rotate(-25deg) grayscale(1) drop-shadow(0px 0px 10px #000) invert(1)
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 1));
`;

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 6;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;

const Text = styled.div`
  * {
    font-family: 'Alegreya Sans', Cambria, Verdana, Arial, Helvetica, sans-serif;
    text-transform: none;
    color: #ddd;
  }
`;

const HighlightLink = styled.a`
  color: #7576df;
`;

const StyledCard = styled(Card)`
  background: rgba(0, 0, 0, 0.8);
  z-index: 2;
`;

const LogoImg = styled.img`
  max-width: 200px;
`;

const ItemCard = styled(Card)`
  position: relative;
  font-weight: bold;

  border-width: 18px 6px;
  border-style: solid;
  border-color: transparent;
  border-image-source: url(/images/puzzle_bars.png);
  border-image-slice: 25% fill;
  border-image-width: 100px 100px;
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
`;

const HightlightText = styled.span`
  color: #7576df;
`;

const LearnMore = styled.div`
  text-align: center;
  display: block;

  color: #7576df;
  user-select: none;

  &:hover {
    cursor: url('/images/cursor3.png'), pointer;
  }
`;

const Rules = () => {
  const { t } = useTranslation();
  const [showVision, setShowVision] = useState(false);
  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />);

  const mythicItem = decodeItem('1003000291320400032001005200805020130202007010000000000000000000000000');
  const epicItem = decodeItem('1003000291320400042001004200804020130182007010000000000000000000000002');
  const rareItem = decodeItem('1003000291320400052001003200803020130162007010000000000000000000000102');
  const magicalItem = decodeItem('1003000291320400062001002200802020130142007010000000000000000000000999');

  return (
    <Page>
      <Container>
        <Cards>
          <StyledCard>
            <CardBody>
              <Heading size="lg" mb="24px">
                CoinMarketCap Airdrop
              </Heading>
              <Heading size="xl" mb="24px">
                Winners
              </Heading>
              <Text>
                <p>
                  Congratulations to all the winners!
                  <br />
                  <br />
                  <Button as={RouterLink} scale="sm" to="/account/inventory">
                    Check Inventory
                  </Button>
                </p>
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <br />
                  <br />
                  <ItemInformation item={mythicItem} showActions={false} hideMetadata />
                  <br />
                  <br />
                  {winners
                    .filter((w) => w.item === 'mythic')
                    .map((winner) => {
                      return <p>{winner.address} - Mythic Dragonlight</p>;
                    })}
                  <br />
                  <br />
                  <ItemInformation item={epicItem} showActions={false} hideMetadata />
                  <br />
                  <br />
                  {winners
                    .filter((w) => w.item === 'epic')
                    .map((winner) => {
                      return <p>{winner.address} - Epic Dragonlight</p>;
                    })}
                  <br />
                  <br />
                  <ItemInformation item={rareItem} showActions={false} hideMetadata />
                  <br />
                  <br />
                  {winners
                    .filter((w) => w.item === 'rare')
                    .map((winner) => {
                      return <p>{winner.address} - Rare Dragonlight</p>;
                    })}
                  <br />
                  <br />
                  <ItemInformation item={magicalItem} showActions={false} hideMetadata />
                  <br />
                  <br />
                  {winners
                    .filter((w) => w.item === 'magical')
                    .map((winner) => {
                      return <p>{winner.address} - Magical Dragonlight</p>;
                    })}
                </Flex>
              </Text>
            </CardBody>
          </StyledCard>
          <div style={{ width: '200%', marginLeft: '-50%' }}>
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <LogoImg src="/images/arken-256x256.png" />
              <Heading as="h1" size="xxl" color="secondary" mb="8px">
                <HeadingPlain>ARKEN REALMS</HeadingPlain>
              </Heading>
              <Heading
                as="h2"
                size="lg"
                mb="8px"
                style={{ textAlign: 'center', filter: 'drop-shadow(2px 4px 6px black)' }}>
                {t('The First NFT Hyperfarm')}
              </Heading>
              <Img src="/images/chars.png" />
              <br />
              <br />
              <Button
                as={RouterLink}
                to="/raid"
                style={{ zoom: 1.5, padding: '6px 20px', textAlign: 'center' }}
                onClick={() => {
                  window.scrollTo(0, 0);
                }}>
                {t('Open App')}
                <OpenNewIcon color="white" ml="4px" />
              </Button>
              <br />
              <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                <Button
                  as={RouterLink}
                  to="/account"
                  style={{ zoom: 1, padding: '6px 20px', textAlign: 'center', background: '#222' }}
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}>
                  {t('Create Account')}
                </Button>
                <Button
                  as={RouterLink}
                  to="/guide"
                  style={{ zoom: 1, padding: '6px 20px', textAlign: 'center', background: '#222', marginLeft: 10 }}
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}>
                  {t('Starter Guide')}
                </Button>
                {i18n.language === 'cn' ? (
                  <Button
                    as={Link}
                    href="https://rune-1.gitbook.io/rune-cn/"
                    target="_blank"
                    style={{ zoom: 1, padding: '6px 20px', textAlign: 'center', background: '#222', marginLeft: 10 }}>
                    {t('查看说明文档')}
                  </Button>
                ) : null}
              </Flex>
              {/* <br />
                <Button variant="text" onClick={onPresentPurchaseModal}>
                  {t('Purchase Runes')}
                </Button> */}
            </Flex>
          </div>
        </Cards>
      </Container>
    </Page>
  );
};

export default Rules;
