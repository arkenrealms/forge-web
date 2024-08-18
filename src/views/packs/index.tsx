import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Heading,
  Text,
  BaseLayout,
  AutoRenewIcon,
  Button,
  Card,
  CardBody,
  Skeleton,
  CheckmarkCircleIcon,
  Flex,
  Tag,
  PrizeIcon,
  OpenNewIcon,
  LinkExternal,
  Link,
  BlockIcon,
} from '~/ui';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import history from '~/routerHistory';
import useWeb3 from '~/hooks/useWeb3';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import Page from '~/components/layout/Page';
import { itemData } from 'rune-backend-sdk/build/data/items';
import CardValueUnstyled from '~/components/raid/CardValueUnstyled';
import { ItemsMainCategoriesType } from 'rune-backend-sdk/build/data/items.type';
import { RecipeInfo } from '~/components/RecipeInfo';
import { PurchaseModal } from '~/components/PurchaseModal';
import Inventory from '~/components/Inventory';
import useStats from '~/hooks/useStats';
import useCache from '~/hooks/useCache';

const Partners = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(6, 1fr);
  }

  a {
    line-height: 60px;

    img {
      margin: auto;
      vertical-align: middle;
      display: inline-block;
    }
  }
`;

const Img = styled.img`
  filter: contrast(1.1) drop-shadow(2px 4px 6px black);
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
  }
`;

const LogoImg = styled.img`
  max-width: 200px;
`;

const BoxHeading = styled(Heading)`
  margin-bottom: 16px;
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

const ProfileContainer = styled.div``;

const BigCard = styled.div<{ align?: string }>`
  color: ${({ theme }) => theme.colors.text};
  position: relative;

  border-width: 10px 10px;
  border-style: solid;
  border-color: transparent;

  border-image-width: 80px;
  background-color: rgba(0, 0, 0, 0.4);

  background-size: 400px;
  box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  // background-color: rgba(0,0,0,0.4);
  line-height: 1.6rem;
  font-size: 1rem;
  text-shadow: 1px 1px 1px #000;
  p,
  a,
  span {
    font-family: 'Alegreya Sans', sans-serif, monospace;
    text-transform: none;
    color: #ddd;
  }
  & > div > p {
    line-height: 1.7rem;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    border-width: 40px 40px;
  }

  ${({ align }) =>
    align === 'right'
      ? `
    text-align: right;
  `
      : ''}
`;

const BottomButtons = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;

  & > button,
  & > a {
    grid-column: span 3;
    width: 100%;
    font-family: 'Alegreya Sans', sans-serif, monospace;
    text-transform: none;
    color: #ddd;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 6;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 3;
    }
  }
`;

const StatCards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;

  & > div {
    grid-column: span 3;
    width: 100%;
    text-align: center;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 2;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 3;
    }
  }
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
      grid-column: span 12;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;

const BulletPoints = styled.div``;

const BulletPoint = styled.div`
  line-height: 2.6rem;
  color: #fff;
  // color: #7576df;
  font-size: 1.1rem;
  position: relative;
  // padding-left: 12px;

  // &:before {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   content: '•';
  // }
`;

const HeadingWrapper = styled.div`
  position: relative;
  height: 50px;
  padding-top: 0px;
  background: url(/images/pop_up_window_A2.png) no-repeat 50% 0;
  background-size: 200%;
  // filter: contrast(1.5) saturate(1.7) drop-shadow(rgba(0, 0, 0, 0.6) 1px 1px 1px)
  //   drop-shadow(rgba(0, 0, 0, 0.6) 0px 0px 4px) hue-rotate(10deg);
  width: calc(100% + 40px);
  margin-left: -20px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 50px;
    padding-top: 10px;
    background-size: 100%;
    overflow: hidden;
  }
`;

const ItemContainer = styled.div``;

const ItemCard = styled(Card)`
  position: relative;
  overflow: hidden;
  font-weight: bold;
  zoom: 0.9;
  border-width: 18px 6px;
  border-style: solid;
  border-color: transparent;
  border-image-source: url(/images/puzzle_bars.png);
  border-image-slice: 25% fill;
  border-image-width: 100px 100px;
  background: none;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  filter: contrast(1.08);
  padding: 20px 30px;
  text-align: center;

  & > div {
    position: relative;
    z-index: 2;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
  }
`;

const Image = styled.img`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 670px;
  }
`;

const Home: React.FC<any> = () => {
  const { address: account } = useWeb3();
  const { t } = useTranslation();
  const cache = useCache();
  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    if (!window || !window.document) return;

    function switchToFancyLogo() {
      // setTimeout(() => {
      //   setPageLoaded(true)
      // }, 5000)
    }

    if (window.document.readyState === 'complete') {
      switchToFancyLogo();
    } else {
      window.addEventListener('load', switchToFancyLogo);
    }

    // @ts-ignore
    return () => {
      window.removeEventListener('load', switchToFancyLogo);
    };
  }, []);

  const [itemSelected, _setItemSelected] = useState(null);
  const onItemSelected = (value, item) => {
    if (itemSelected && itemSelected.id === item.id) return;
    _setItemSelected(item);
  };

  const runeSupply = cache.runes.rune.circulatingSupply;
  const runePrice = cache.runes.rune.price;
  const runeMarketCap = cache.runes.rune.circulatingSupply * cache.runes.rune.price;
  const runes = ['el', 'eld', 'tir', 'nef', 'ith', 'tal', 'ral', 'ort', 'thul', 'amn'];
  const runesMarketCap = runes
    .map((rune) => cache.runes[rune].circulatingSupply * cache.runes[rune].price)
    .reduce((a, b) => a + b);

  const { totalCharacters, totalItems, totalCommunities, totalPolls, totalClasses, totalGuilds, totalRunes } =
    cache.stats;

  const { isMd, isLg, isXl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl;

  return (
    <Page>
      {/* <PageWindow> */}
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <LogoImg src="/images/rune-500x500.png" />
        <Heading as="h1" size="xxl" color="secondary" mb="8px">
          {pageLoaded ? <HeadingSilver>RUNE</HeadingSilver> : <HeadingPlain>RUNE</HeadingPlain>}
        </Heading>
        <Heading as="h2" size="lg" mb="8px" style={{ textAlign: 'center', filter: 'drop-shadow(2px 4px 6px black)' }}>
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
        <Button
          as={RouterLink}
          to="/guide"
          style={{ zoom: 1.21, padding: '6px 20px', textAlign: 'center', background: '#222' }}
          onClick={() => {
            window.scrollTo(0, 0);
          }}>
          {t('Starter Guide')}
        </Button>
        <br />
        <Button variant="text" onClick={onPresentPurchaseModal}>
          {t('Purchase Runes')}
        </Button>
      </Flex>
      <br />
      <br />
      <br />
      <br />
      <StatCards>
        <BigCard>
          <CardBody>
            <BoxHeading as="h2" size="lg">
              {parseFloat(runeSupply.toFixed(0)).toLocaleString()}
            </BoxHeading>
            <div>Max Supply</div>
          </CardBody>
        </BigCard>
        <BigCard>
          <CardBody>
            <BoxHeading as="h2" size="lg">
              ${runePrice.toFixed(2)}
            </BoxHeading>
            <div>Price</div>
          </CardBody>
        </BigCard>
        <BigCard>
          <CardBody>
            <BoxHeading as="h2" size="lg">
              ${parseFloat(runeMarketCap.toFixed(0)).toLocaleString()}
            </BoxHeading>
            <div>Market Cap</div>
          </CardBody>
        </BigCard>
        <BigCard>
          <CardBody>
            <BoxHeading as="h2" size="lg">
              {'≥'} 1000
            </BoxHeading>
            <div>Holders</div>
          </CardBody>
        </BigCard>
        {/* <BigCard>
          <CardBody>
            <BoxHeading as="h2" size="lg">
              {characterCount}
            </BoxHeading>
            <div>Characters</div>
          </CardBody>
        </BigCard>
        <BigCard>
          <CardBody>
            <BoxHeading as="h2" size="lg">
              {itemCount}
            </BoxHeading>
            <div>Items</div>
          </CardBody>
        </BigCard> */}
      </StatCards>

      <BigCard>
        <CardBody>
          <Partners>
            <a href="https://coinmarketcap.com/currencies/rxs/" rel="noreferrer noopener" target="_blank">
              <img src="/images/other/coinmarketcap.svg" alt="Coin Market Cap" style={{ filter: 'invert(1)' }} />
            </a>
            {/* <a href="https://www.cointiger.com/" rel="noreferrer noopener" target="_blank">
              <img src="/images/other/cointiger.png" alt="Coin Tiger" />
            </a> */}
            <a
              href="https://dappradar.com/binance-smart-chain/defi/rune-farm"
              rel="noreferrer noopener"
              target="_blank">
              <img src="/images/other/dappradar.png" alt="Dapp Radar" />
            </a>
            <a href="https://www.dapp.com/app/rune-farm" rel="noreferrer noopener" target="_blank">
              <img src="/images/other/dapp.png" alt="Dapp.com" />
            </a>
            <a href="https://bscproject.org/#/project/507" rel="noreferrer noopener" target="_blank">
              <img src="/images/other/bscproject.png" alt="BSC Project" />
            </a>
            <a href="https://www.coingecko.com/en/coins/rune" rel="noreferrer noopener" target="_blank">
              <img src="/images/other/coingecko.png" alt="Coin Gecko" />
            </a>
            {/* <a href="http://slime.finance/" rel="noreferrer noopener" target="_blank">
              <img src="/images/other/slime.png" alt="Slime Finance" />
            </a> */}
            <a href="https://www.alturanft.com/" rel="noreferrer noopener" target="_blank">
              <img src="/images/other/altura.png" alt="Altura" />
            </a>
            {/* <a href="https://bscproject.org/#/project/507"><img src="/images/other/bscgemz.png" alt="BSC Gemz" /></a> */}
          </Partners>
        </CardBody>
      </BigCard>
      <br />
      <br />
      <BigCard>
        <CardBody>
          {!isMobile ? (
            <ProfileContainer
              style={{ float: 'right', marginLeft: '10px', width: '350px', zoom: '0.9', opacity: '0.9' }}>
              <Inventory
                columns={6}
                rows={19}
                showFull
                hideExtras
                hideArrows
                noDisabled
                showQuantity={false}
                onItemSelected={onItemSelected}
              />
              {itemSelected ? (
                <div style={{ textAlign: 'center' }}>
                  <RouterLink
                    to={`/runes/${itemSelected?.name.toLowerCase().replace(' rune', '')}`}
                    style={{
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      border: '2px solid #bb955e',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      fontFamily: "'webfontexl',sans-serif",
                      fontSize: '1.2rem',
                      color: '#bb955e',
                      display: 'inline-block',
                      padding: '3px 7px',
                      margin: '15px auto 0',
                    }}>
                    {itemSelected?.name}
                  </RouterLink>
                </div>
              ) : null}
            </ProfileContainer>
          ) : null}
          <BoxHeading as="h2" size="xl">
            {t('NFT Hyperfarming')}
          </BoxHeading>
          <br />
          <p>
            Arken is the next evolution of DeFi farming. Farming is when you use your tokens to earn bonus tokens by
            staking them. Every week a new token is created (called a rune). It&apos;s farmed until the max supply of
            50,000. That rune can then be combined with other runes to create NFTs. Those NFTs can be used to improve
            your earnings.
          </p>
          {isMobile ? (
            <ProfileContainer style={{ width: '100%', margin: '30px auto 0', zoom: '0.9', opacity: '0.9' }}>
              <Inventory
                columns={5}
                rows={19}
                showFull
                hideExtras
                hideArrows
                noDisabled
                showQuantity={false}
                onItemSelected={onItemSelected}
              />
              {itemSelected ? (
                <div style={{ textAlign: 'center' }}>
                  <RouterLink
                    to={`/runes/${itemSelected?.name.toLowerCase().replace(' rune', '')}`}
                    style={{
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      border: '2px solid #bb955e',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      fontFamily: "'webfontexl',sans-serif",
                      fontSize: '1.2rem',
                      color: '#bb955e',
                      display: 'inline-block',
                      padding: '3px 7px',
                      margin: '15px auto 0',
                    }}>
                    {itemSelected?.name}
                  </RouterLink>
                </div>
              ) : null}
            </ProfileContainer>
          ) : null}
          {!isMobile ? (
            <>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </>
          ) : null}
        </CardBody>
      </BigCard>
      <br />
      <br />
      <BigCard align="right">
        <CardBody>
          {!isMobile ? (
            <img
              src="/images/nfts/necromancer.png"
              alt="Necromancer"
              style={{ float: 'left', width: '240px', marginTop: '-20px' }}></img>
          ) : null}
          <BoxHeading as="h2" size="xl">
            {t('Blockchain Gaming')}
          </BoxHeading>
          <br />
          <p>
            You can start building your character right away. Choose from 1 of 7 classes, join a guild, and raid farms
            to start earning runes instantly.
          </p>
          {isMobile ? (
            <img src="/images/nfts/necromancer.png" alt="Necromancer" style={{ width: '240px' }}></img>
          ) : null}
          {!isMobile ? (
            <>
              <br />
              <br />
              <br />
              <br />
            </>
          ) : null}
        </CardBody>
      </BigCard>
      <br />
      <br />
      <BigCard>
        <CardBody>
          {!isMobile ? (
            <ItemContainer style={{ float: 'right', marginLeft: 20, width: '400px' }}>
              <ItemCard>
                <RecipeInfo item={itemData[ItemsMainCategoriesType.OTHER].find((r) => r.id === 1)} showCraftButton />
              </ItemCard>
            </ItemContainer>
          ) : null}
          <BoxHeading as="h2" size="xl">
            {t('Evolving NFTs')}
          </BoxHeading>
          <p>
            Imagine a virtual world like Ready Player One, where your NFTs adapt to the game you&apos;re playing?
            We&apos;re building the market first, by distributing NFTs in Rune farms, that can later be used in Rune
            games.
          </p>
          {isMobile ? (
            <ItemContainer style={{ width: '100%', margin: '30px auto 0' }}>
              <ItemCard>
                <RecipeInfo item={itemData[ItemsMainCategoriesType.OTHER].find((r) => r.id === 1)} showCraftButton />
              </ItemCard>
            </ItemContainer>
          ) : null}
          {!isMobile ? (
            <>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </>
          ) : null}
        </CardBody>
      </BigCard>
      <br />
      <br />
      <BigCard align="right">
        <CardBody>
          {!isMobile ? (
            <div style={{ width: '275px', float: 'left', marginRight: '10px' }}>
              <Image src="/images/cube-preview.png" />
            </div>
          ) : null}
          <BoxHeading as="h2" size="xl">
            {t('Unique Crafted Items')}
          </BoxHeading>
          <br />
          <p>
            Rune brings uniquely generated attributes to NFTs that have real utility.
            <br />
            Every item has an affect on your farm: increase yield, burn, chance to unlock hidden pool, and much more!
          </p>
          {isMobile ? (
            <div style={{ width: '250px', margin: '30px auto 0' }}>
              <Image src="/images/cube-preview.png" />
            </div>
          ) : null}
          {!isMobile ? (
            <>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </>
          ) : null}
        </CardBody>
      </BigCard>
      <br />
      <br />
      <br />
      <br />
      <br />

      <Cards>
        <BigCard>
          <CardBody>
            <BoxHeading as="h2" size="xl">
              {t('Stats')}
            </BoxHeading>
            <BulletPoints>
              <BulletPoint>
                <a href="https://arken.gg/stats" rel="noreferrer noopener" target="_blank">
                  <strong>
                    <CardValueUnstyled fontSize="14px" value={totalRunes} decimals={0} /> / 33 runes
                  </strong>{' '}
                  released
                </a>
              </BulletPoint>
              {/* <BulletPoint><a href="https://arken.gg/characters" rel="noreferrer noopener" target="_blank">Currently <strong><CardValueUnstyled fontSize="14px" value={totalRuneWords} decimals={0} /></strong> runewords</a></BulletPoint> */}
              <BulletPoint>
                <a href="https://arken.gg/characters" rel="noreferrer noopener" target="_blank">
                  <strong>
                    <CardValueUnstyled fontSize="14px" value={totalClasses} decimals={0} />
                  </strong>{' '}
                  classes
                </a>
              </BulletPoint>
              <BulletPoint>
                <a href="https://arken.gg/guilds" rel="noreferrer noopener" target="_blank">
                  <strong>
                    <CardValueUnstyled fontSize="14px" value={totalGuilds} decimals={0} />
                  </strong>{' '}
                  guilds
                </a>
              </BulletPoint>
              <BulletPoint>
                <a href="https://arken.gg/stats" rel="noreferrer noopener" target="_blank">
                  {'≥'}{' '}
                  <strong>
                    <CardValueUnstyled fontSize="14px" value={totalCharacters} decimals={0} />
                  </strong>{' '}
                  characters created
                </a>
              </BulletPoint>
              <BulletPoint>
                <a href="https://arken.gg/stats" rel="noreferrer noopener" target="_blank">
                  {'≥'}{' '}
                  <strong>
                    <CardValueUnstyled fontSize="14px" value={totalItems} decimals={0} />
                  </strong>{' '}
                  items created
                </a>
              </BulletPoint>
              <BulletPoint>
                <a href="https://arken.gg/docs/#welcome-to-rune-farm" rel="noreferrer noopener" target="_blank">
                  {'≥'}{' '}
                  <strong>
                    <CardValueUnstyled fontSize="14px" value={totalCommunities} decimals={0} />
                  </strong>{' '}
                  language communities
                </a>
              </BulletPoint>
              <BulletPoint>
                <a href="https://polls.arken.gg/" rel="noreferrer noopener" target="_blank">
                  {'≥'}{' '}
                  <strong>
                    <CardValueUnstyled fontSize="14px" value={totalPolls} decimals={0} />
                  </strong>{' '}
                  community polls
                </a>
              </BulletPoint>
              <BulletPoint>
                <p>
                  Total MC:{' '}
                  <CardValueUnstyled fontSize="14px" value={runeMarketCap + runesMarketCap} decimals={0} prefix="$" />{' '}
                  USD
                  <br />
                  <span style={{ paddingLeft: 10 }}>
                    $RUNE: <CardValueUnstyled fontSize="14px" value={runeMarketCap} decimals={0} prefix="$" /> USD
                  </span>
                  <br />
                  <span style={{ paddingLeft: 10 }}>
                    $EL-$ZOD: <CardValueUnstyled fontSize="14px" value={runesMarketCap} decimals={0} prefix="$" /> USD
                  </span>
                </p>
              </BulletPoint>
              <BulletPoint>
                <a href="https://arken.gg/stats" rel="noreferrer noopener" style={{ color: '#bb955e' }}>
                  View More...
                </a>
              </BulletPoint>
            </BulletPoints>
            {/* <BoxHeading size="xl" mb="24px">
                {t('Stats')}
              </BoxHeading> */}
          </CardBody>
        </BigCard>
        {/* <BigCard>
          <CardBody>
            <BoxHeading as="h2" size="lg">
              {t('Main Features')}
            </BoxHeading>
            <BulletPoints>
              <BulletPoint>
                <a href="/raid" rel="noreferrer noopener">
                  Buffs (increase yield)
                </a>
              </BulletPoint>
              <BulletPoint>
                <a href="/raid" rel="noreferrer noopener">
                  Character NFTs
                </a>
              </BulletPoint>
              <BulletPoint>
                <a href="/raid" rel="noreferrer noopener">
                  Weapon NFTs
                </a>
              </BulletPoint>
              <BulletPoint>
                <a href="/raid" rel="noreferrer noopener">
                  Inventory / farm equips
                </a>
              </BulletPoint>
              <BulletPoint>
                <a href="/raid" rel="noreferrer noopener">
                  Crafting (random + utility)
                </a>
              </BulletPoint>
              <BulletPoint>
                <a href="/raid" rel="noreferrer noopener">
                  33 Rune Tokens
                </a>
              </BulletPoint>
              <BulletPoint>
                <a href="/raid" rel="noreferrer noopener">
                  50K Max Supply Per Token
                </a>
              </BulletPoint>
              <BulletPoint>
                <a href="/raid" rel="noreferrer noopener">
                  New Rune Weekly (Fluid Farming)
                </a>
              </BulletPoint>
            </BulletPoints>
            <Flex flexDirection="column" alignItems="center" justifyContent="center" mt="20px">
              <a href="https://arken.gg/docs/" rel="noreferrer noopener">
                View more...
              </a>
            </Flex>
          </CardBody>
        </BigCard> */}
        <BigCard>
          {/* <HeadingWrapper> */}
          {/* </HeadingWrapper> */}
          <CardBody style={{ textAlign: 'right' }}>
            <BoxHeading as="h2" size="xl">
              {t('Roadmap')}
            </BoxHeading>
            <BulletPoints>
              <BulletPoint>
                <a href="/roadmap" rel="noreferrer noopener" target="_blank">
                  Games
                </a>
              </BulletPoint>
              <BulletPoint>
                <a href="/roadmap" rel="noreferrer noopener" target="_blank">
                  Market 2.0
                </a>
              </BulletPoint>
              <BulletPoint>
                <a href="/roadmap" rel="noreferrer noopener" target="_blank">
                  Gambling Systems
                </a>
              </BulletPoint>
              <BulletPoint>
                <a href="/roadmap" rel="noreferrer noopener" target="_blank">
                  Evolving Licensed NFTs
                </a>
              </BulletPoint>
              <BulletPoint>
                <a
                  href="https://ArkenRealms.medium.com/ready-player-one-df8cc19741e4"
                  rel="noreferrer noopener"
                  target="_blank">
                  Ultimate Tournament
                </a>
              </BulletPoint>
              <BulletPoint>
                <a
                  href="https://ArkenRealms.medium.com/ready-player-one-df8cc19741e4"
                  rel="noreferrer noopener"
                  target="_blank">
                  Cross-chain NFT Bridge
                </a>
              </BulletPoint>
              <BulletPoint>
                <a
                  href="https://ArkenRealms.medium.com/ready-player-one-df8cc19741e4"
                  rel="noreferrer noopener"
                  target="_blank">
                  Unique NFT Airdrops
                </a>
              </BulletPoint>
              <BulletPoint>
                <a
                  href="https://ArkenRealms.medium.com/ready-player-one-df8cc19741e4"
                  rel="noreferrer noopener"
                  target="_blank">
                  Pet NFT Fundraiser
                </a>
              </BulletPoint>
              <BulletPoint>
                <a
                  href="https://ArkenRealms.medium.com/ready-player-one-df8cc19741e4"
                  rel="noreferrer noopener"
                  target="_blank">
                  $ARC Game Currency
                </a>
              </BulletPoint>
              <BulletPoint>
                <a
                  href="https://ArkenRealms.medium.com/ready-player-one-df8cc19741e4"
                  rel="noreferrer noopener"
                  target="_blank">
                  $RUNE Dividend Staking
                </a>
              </BulletPoint>
              <BulletPoint>
                <a href="/roadmap" rel="noreferrer noopener" style={{ color: '#bb955e' }}>
                  View More...
                </a>
              </BulletPoint>
            </BulletPoints>
          </CardBody>
        </BigCard>
      </Cards>
      <BigCard>
        <CardBody>
          <BottomButtons>
            <Button onClick={onPresentPurchaseModal} style={{ zoom: 1, padding: '6px 20px', textAlign: 'center' }}>
              {t('Buy Rune')}
            </Button>
            <Button
              as={RouterLink}
              to="/raid"
              style={{ zoom: 1, padding: '6px 20px', textAlign: 'center' }}
              onClick={() => {
                window.scrollTo(0, 0);
              }}>
              {t('Open App')}
            </Button>
            <Button
              as={RouterLink}
              to="/guide"
              style={{ zoom: 1, padding: '6px 20px', textAlign: 'center' }}
              onClick={() => {
                window.scrollTo(0, 0);
              }}>
              {t('Starter Guide')}
            </Button>
            <Button
              as="a"
              href="https://ArkenRealms.medium.com/ready-player-one-df8cc19741e4"
              style={{ zoom: 1, padding: '6px 20px', textAlign: 'center' }}
              rel="noreferrer noopener"
              target="_blank">
              {t('Our Vision')}
            </Button>
          </BottomButtons>
        </CardBody>
      </BigCard>
      <br />
      <br />
      <br />
      {/* <Card style={{ overflow: 'visible' }}>
          <CardHeader style={{ paddingBottom: 70 }}>
            <Flex alignItems={['start', null, 'center']} flexDirection={['column', null, 'row']}>
              <Content>
                Ssssss
              </Content>
            </Flex>
            <Status>
                <Tag variant="failure" startIcon={<BlockIcon width="18px" />} outline>
                  {t('Paused')}
                </Tag>
            </Status>
          </CardHeader>
          <CardBody style={{ marginTop: -70 }}>
            <Section>
              <BoxHeading as="h4" size="md">
                {t('Achievements')}
              </BoxHeading>
            </Section>
            <Section>
              <BoxHeading as="h4" size="md" mb="0px">
                {t('Characters')}
              </BoxHeading>
              <Flex justifyContent="center">
                <Button as={Link} to="/characters" style={{ textAlign: 'center' }}>
                  Create Character
                </Button>
              </Flex>
            </Section>
          </CardBody>
        </Card> */}
      {/* </PageWindow> */}
    </Page>
  );
};

export default Home;
