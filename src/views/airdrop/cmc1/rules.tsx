import React, { useEffect, useRef, useState, useContext } from 'react';
import styled from 'styled-components';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Flex, Card, Heading, CardBody, Link, BaseLayout, OpenNewIcon } from '~/ui';
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
                Participation Rules
              </Heading>
              <Text>
                <p>
                  Follow Rune socials to join this airdrop from August 25 to September 9.
                  <br />
                  <br />
                  We will send exclusive Arken NFTs to 1000 successful participants&rsquo; BSC addresses after this
                  campaign ends. Follow the below instructions:
                </p>
                <br />
                <br />
                <p>
                  <HighlightLink href="https://coinmarketcap.com/currencies/rxs/">
                    1. Add Rune (RUNE) to your CoinMarketCap watchlist. <OpenNewIcon color="#7576df" ml="4px" />
                  </HighlightLink>
                </p>
                <br />
                <br />
                <p>
                  <HighlightLink href="https://twitter.com/ArkenRealms">
                    2. Follow Rune&rsquo;s official Twitter account. <OpenNewIcon color="#7576df" ml="4px" />
                  </HighlightLink>
                </p>
                <br />
                <br />
                <p>
                  <HighlightLink href="https://twitter.com/ArkenRealms">
                    3. Like and retweet the Rune x CoinMarketCap NFT Airdrop Tweet, pinned on Twitter.{' '}
                    <OpenNewIcon color="#7576df" ml="4px" />
                  </HighlightLink>
                  <br />
                  <br />{' '}
                  <em>Tag at least 3 of your friends while using the hashtags #BSC #BSCgems #playtoearn #Binance.</em>
                </p>
                <br />
                <br />
                <p>
                  <HighlightLink href="https://t.me/Arken_Realms">
                    4. Join Rune&rsquo;s Telegram group. <OpenNewIcon color="#7576df" ml="4px" />
                  </HighlightLink>
                </p>
                <br />
                <br />
                <p>
                  <HighlightLink href="https://discord.gg/J6yvC56mbc">
                    5. Join Rune&rsquo;s Discord server. <OpenNewIcon color="#7576df" ml="4px" />
                  </HighlightLink>
                </p>
                <br />
                <br />
                <p>
                  <HighlightLink href="https://arkenrealms.medium.com/">
                    6. Follow Rune on Medium. <OpenNewIcon color="#7576df" ml="4px" />
                  </HighlightLink>
                </p>
                <br />
                <br />
                <p>
                  <HighlightLink href="https://www.facebook.com/ArkenRealms">
                    7. Follow Rune on Facebook. <OpenNewIcon color="#7576df" ml="4px" />
                  </HighlightLink>
                </p>
                <br />
                <br />
                <p>
                  <span>
                    To qualify to win, users must complete all of the above steps.
                    <br />
                    <br />
                    Arken Entertainment will, at its sole discretion, select the winners and will transfer any Rune NFT
                    winnings to the user&#39;s BSC wallet address. Please direct any questions to the Rune support staff
                    in any of our official social media channels.
                  </span>
                </p>

                <br />
                <br />

                <img alt="Binzy Dragon" src="/images/binzy-dragon.png" />
                <LearnMore onClick={() => setShowVision(!showVision)}>New? Learn about our vision</LearnMore>

                {showVision ? (
                  <>
                    <div>
                      <br />
                      <br />
                      <p>
                        Arken is the future of gaming. <br />
                        <br />
                        We're building modern game experiences, backed by open immutable hash technology. Aligning
                        incentives between games and gamers in new revolutionary ways. You won't know you're using
                        blockchain, but you'll be glad you are.
                      </p>
                      <br />
                      <br />
                      <p>
                        <HightlightText>1. Gamers own their own assets for life.</HightlightText>
                      </p>
                      <br />
                      <br />
                      <p>
                        <HightlightText>2. Gamers can monetize on their hard work.</HightlightText>
                      </p>
                      <br />
                      <br />
                      <p>
                        <HightlightText>
                          3. Gamers have a say in the games through governance, polling, and constant feedback loop.
                        </HightlightText>
                      </p>
                      <br />
                      <br />
                      <p>
                        <HightlightText>
                          4. Gamers can transfer their items to other games supporting Arken NFTs.
                        </HightlightText>
                      </p>
                      <br />
                      <br />
                      <p>
                        <HightlightText>5. Gamers can see true rarity, exposing manipulation or duping.</HightlightText>
                      </p>
                      <br />
                      <br />
                      <p>
                        <HightlightText>6. Gamers can never lose items.</HightlightText>
                      </p>
                      <br />
                      <br />
                      <p>
                        <HightlightText>
                          7. Define the future of blockchain gaming, evolving licensed NFTs and marketplaces.
                        </HightlightText>
                      </p>
                      <br />
                      <br />
                      <p>
                        <HightlightText>8. Unstoppable distributed &amp; modular games.</HightlightText>
                      </p>
                      <br />
                      <br />
                      <p>
                        <HightlightText>
                          9. Spread adoption of blockchain and transfer wealth throughout the world.
                        </HightlightText>
                      </p>
                    </div>
                  </>
                ) : null}

                <br />
                <p>
                  Welcome to Rune, lets build a better world for our kids.
                  <br />
                  <br />- Binzy
                </p>
              </Text>
            </CardBody>
          </StyledCard>
          <div style={{ width: '200%', marginLeft: '-50%' }}>
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <LogoImg src="/images/rune-500x500.png" />
              <Heading as="h1" size="xxl" color="secondary" mb="8px">
                <HeadingPlain>RUNE</HeadingPlain>
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
