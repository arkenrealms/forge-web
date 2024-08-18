import React, { useEffect, useRef, useState, useContext } from 'react';
import styled from 'styled-components';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Flex, Card, Heading, Link, CardBody, BaseLayout, OpenNewIcon } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import Page from '~/components/layout/Page';
import { PurchaseModal } from '~/components/PurchaseModal';
import i18n from '~/config/i18n';

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
  line-height: 5rem;
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
  line-height: 5rem;
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
    font-size: 1.2rem;
  }
`;

const HightlightText = styled.span`
  color: #7576df;
`;

const StyledCard = styled(Card)`
  background: rgba(0, 0, 0, 0.8);
  z-index: 2;
`;

const LogoImg = styled.img``;

const BottomCTA = () => {
  const { t } = useTranslation();
  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />);

  return (
    <Cards>
      <StyledCard>
        <CardBody>
          <Heading size="lg" mb="24px">
            New?
          </Heading>
          <Heading size="xl" mb="24px">
            Our Vision
          </Heading>
          <Text>
            <p>
              Arken is the future of gaming. <br />
              <br />
              We're building modern game experiences, backed by open immutable hash technology. Aligning incentives
              between games and gamers in new revolutionary ways. Soon you won't know you're using blockchain, but
              you'll be glad you are.
            </p>
            <br />
            <p>
              <HightlightText>1. Games should fun first, with blockchain enhancements.</HightlightText>
            </p>
            <br />
            <p>
              <HightlightText>2. Gamers own their own assets for life.</HightlightText>
            </p>
            <br />
            <p>
              <HightlightText>3. Gamers can monetize on their hard work.</HightlightText>
            </p>
            <br />
            <p>
              <HightlightText>
                4. Gamers have a say in the games through governance, polling, and constant feedback loop.
              </HightlightText>
            </p>
            <br />
            <p>
              <HightlightText>5. Gamers can transfer their items to other games supporting Arken NFTs.</HightlightText>
            </p>
            <br />
            <p>
              <HightlightText>6. Gamers can see true rarity, exposing manipulation or duping.</HightlightText>
            </p>
            <br />
            <p>
              <HightlightText>
                7. Define the future of blockchain gaming, evolving licensed NFTs and marketplaces.
              </HightlightText>
            </p>
            <br />
            <p>
              <HightlightText>8. Unstoppable distributed &amp; modular games.</HightlightText>
            </p>
            <br />
            <p>
              <HightlightText>
                9. Spread adoption of blockchain and transfer wealth throughout the world.
              </HightlightText>
            </p>
            <br />
            {/* <p>Arken Realms will be the gold standard of metaverses.</p> */}

            {/* <img alt="Binzy Dragon" src="/images/binzy-dragon.png" style={{ opacity: 0.85 }} />
            <p>
              Welcome to Rune, lets build{' '}
              <a href="https://ArkenRealms.medium.com/ready-player-one-df8cc19741e4" style={{ fontWeight: 'bold' }}>
                Ready Player One
              </a>{' '}
              for our kids.
              <br />
              <br />- Binzy
            </p> */}
          </Text>
        </CardBody>
      </StyledCard>
      <div style={{ width: '200%', marginLeft: '-50%' }}>
        <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <LogoImg src="/images/rune-500x500.png" style={{ maxWidth: 200 }} />
          <Heading as="h1" size="xxl" color="secondary" mb="8px">
            <HeadingPlain>RUNE</HeadingPlain>
          </Heading>
          <Heading as="h2" size="lg" mb="8px" style={{ textAlign: 'center', filter: 'drop-shadow(2px 4px 6px black)' }}>
            {t('The First NFT Hyperfarm')}
          </Heading>
          <Img src="/images/chars.png" />
          <br />
          <br />
          <Button
            as={RouterLink}
            to="/games"
            style={{ zoom: 1.5, padding: '6px 20px', textAlign: 'center' }}
            onClick={() => {
              window.scrollTo(0, 0);
            }}>
            {t('Play Now')}
            {/* <OpenNewIcon color="white" ml="4px" /> */}
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
  );
};

export default BottomCTA;
