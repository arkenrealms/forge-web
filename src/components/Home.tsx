import React, { useContext, useState } from 'react';
import styled, { css } from 'styled-components';

import { Link as RouterLink } from 'react-router-dom';
import { ThemeContext } from 'styled-components';
import EarnEvolution from '~/components/EarnEvolution';
import EarnRaid from '~/components/EarnRaid';
import Linker from '~/components/Linker';
import TeamComponent from '~/components/Team';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import history from '~/routerHistory';
import { Accordion, BaseLayout, Button, Card, Card2, Card3, CardBody, Flex, Heading, Link, Tag } from '~/ui';

import { Navigation, Pagination, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
// import 'swiper/modules/navigation/navigation.min.css' // Navigation module
// import 'swiper/modules/pagination/pagination.min.css' // Pagination module
// import 'swiper/swiper.min.css'
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useTranslation } from 'react-i18next';
import Page from '~/components/layout/Page';
import Lore from '~/components/Lore';
import News from '~/components/News';
import Games from '~/components/Games';
import CardValueUnstyled from '~/components/raid/CardValueUnstyled';
import ThankYou from '~/components/ThankYou';
import useCache from '~/hooks/useCache';
// import initReactFastclick from "react-fastclick";
import EvolutionIcon from '~/assets/images/icons/evolution-desktop.png';
import GuardiansIcon from '~/assets/images/icons/guardians-desktop.png';
import InfiniteIcon from '~/assets/images/icons/infinite-desktop.png';
import RaidIcon from '~/assets/images/icons/raid-desktop.png';
import SanctuaryIcon from '~/assets/images/icons/sanctuary-desktop.png';
import { safeRuneList } from '~/config';
import i18n from '~/config/i18n';

// initReactFastclick();

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
  line-height: 6rem;
  font-family: 'webfontexl', 'Palatino Linotype', 'Times', serif;
  font-size: 85px;
  font-weight: normal;
  // filter: sepia(1) saturate(5) hue-rotate(-25deg);
  // sepia(1) saturate(5) hue-rotate(-25deg) grayscale(1) drop-shadow(0px 0px 10px #000) invert(1)
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 1));
  text-shadow: none;
`;

const HeadingPlain = styled.div`
  color: #cecece;
  text-transform: uppercase;
  line-height: 6rem;
  font-family: 'webfontexl', 'Palatino Linotype', 'Times', serif;
  font-size: 85px;
  line-height: 6rem;
  font-weight: normal;
  // filter: sepia(1) saturate(5) hue-rotate(-25deg);
  // sepia(1) saturate(5) hue-rotate(-25deg) grayscale(1) drop-shadow(0px 0px 10px #000) invert(1)
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 1));
`;

const ProfileContainer = styled.div``;

const Shortcut = styled.div<{ active?: boolean }>`
  text-align: center;
  height: 90px;
  width: 160px;
  // padding: 0 20px 20px;
  cursor: pointer;
  color: #fff;
  font-size: 0.9rem;
  white-space: nowrap;

  p {
    margin-top: 5px;
    font-family: 'webfontexl', sans-serif !important;
    text-transform: uppercase;
  }

  img {
    width: auto;
    height: 50px;
    image-rendering: pixelated;
  }

  &:hover {
    cursor: url('/images/cursor3.png'), pointer;
    filter: drop-shadow(0 0 5px rgba(255 255 255/70%)); // drop-shadow(0 0 8px rgba(187 149 94/100%));
    zoom: 1.5;
  }

  zoom: 1.5;

  transition: zoom 0.2 ease-in-out;

  ${({ theme }) => theme.mediaQueries.sm} {
    zoom: ${({ active }) => (active ? '1.5' : '1')};
  }
`;

const PitchCard = styled.div`
  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
    flex: 1;
    flex-direction: row;

    & > div:first-child {
      flex-grow: 0;
      flex-shrink: 0;
    }

    & > div {
    }
  }
`;
const BigCard = styled.div<{ align?: string }>`
  color: ${({ theme }) => theme.colors.text};
  position: relative;

  width: 100%;
  line-height: 1.6rem;
  font-size: 1rem;
  text-shadow: 1px 1px 1px #000;
  p,
  a,
  span {
    font-family: 'Alegreya Sans', sans-serif, monospace !important;
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

const GameCards = styled(BaseLayout)``;

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

const BulletPoints = styled.div`
  margin-top: 20px;
`;

const BulletPoint = styled.div`
  line-height: 2.6rem;
  color: #fff;
  // color: #7576df;
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

const CardBodyHover = styled(CardBody)`
  &:hover {
    cursor: url('/images/cursor3.png'), pointer;
  }
`;

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

const Video = styled.video`
  display: inline-block;
  width: 280px;
`;

// function touchCapable() {
//   if (!window) return false

//   // @ts-ignore
//   return (
//     'ontouchstart' in window ||
//     (window.DocumentTouch && document instanceof window.DocumentTouch) ||
//     navigator.maxTouchPoints > 0 ||
//     window.navigator.msMaxTouchPoints > 0
//   )
// }

const PromoBlock = styled.div``;

const Promo1 = styled.a`
  position: sticky;
  top: 70px;
  right: 50px;
  z-index: 999;
  text-align: right;
  width: 300px;
  height: 400px;
  float: right;
  padding: 30px 0 10px;
  background: #000;
  border-radius: 7px;
  opacity: 1;
  margin-top: 30px;
  display: none;
  box-shadow: 0 0 10px rgb(186 148 94);
  border: 1px solid #ba945e;
  @media (min-width: 1920px) {
    display: block;
  }
`;

const barStyleOptions = {
  backgroundColor: '#c3dde0',
  placeholderColor: '#ddeced',
  eventCompletedColor: '#541919',
  eventOnStatusColor: '#7d2828',
  expandedColor: '#e3e3e3',
  fontColor: 'white',
  barWidth: { large: 1040, small: 380 },
};

const GameTitleMap = {
  1: 'Raid',
  2: 'Evolution',
  3: 'Infinite',
  4: 'Sanctuary',
};

const mode = 'large';

const Timeline2021 = () => {
  return <div>Timeline2021</div>;
};
const Timeline2022 = () => {
  return <div>Timeline2022</div>;
};
const Timeline2023 = () => {
  return <div>Timeline2023</div>;
};
const Timeline2024 = () => {
  return <div>Timeline2024</div>;
};
const UtilityModal = styled.div`
  margin-top: 10px;
  position: relative;
  border: 1px solid #bb955e;
  border-radius: 6px;
  padding: 8px;
  z-index: 999;
`;
const UtilityModalClose = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  color: #999;
`;

const GameCard = styled.div`
  position: relative;
  padding: 0 10px;
  // transform: scale(0.8);
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  text-align: center;
  color: #bb955e;
  text-shadow: 1px 1px 1px black;
  // font-weight: bold;
  min-height: 920px;
`;

const Header = styled.div`
  min-height: 28px;
  width: 100%;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  padding: 10px;
`;

const InfoBlock = styled.div`
  // padding: 24px;
  margin-top: 20px;
  text-align: left;
  font-size: 1rem;
`;

const HeaderTag = styled.div`
  margin-top: 10px;
  width: 100%;
`;

const Tag2 = styled(Tag)`
  zoom: 0.7;
`;

const ImageBlock = ({ url }) => <Image src={url} />;

const BottomMenu = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  text-align: center;
`;

const RoadmapItem = function ({ item }) {
  return (
    <div
      css={css`
        position: relative;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        width: 100%;
        height: 100%;
      `}>
      {/* <div
        css={css`
          position: absolute;
          top: 15px;
          right: 15px;
        `}
      >
        <Button scale="sm" as={Link} href={item.href}>
          Visit
        </Button>
      </div> */}
      {/* <div
        css={css`
          border-radius: 6px 6px 0 0;
          height: 200px;
          width: 100%;
          background-image: url(${item.image});
          background-size: cover;
          background-position: 50% 50%;
        `}
      /> */}
      <div
        css={css`
          padding: 10px;
        `}>
        {/* <div
          css={css`
            height: 80px;
          `}
        > */}
        <h3 style={{ fontSize: '1.3rem' }}>{item.date}</h3>
        <h4 style={{ fontSize: '1rem' }}>{item.title}</h4>
        {/* </div> */}
        <p style={{ marginTop: 10 }}>{item.description}</p>
      </div>
    </div>
  );
};

const AccordionContent = styled.div`
  padding: 20px;
  a {
    display: inline;
    width: auto;
    height: auto;
  }
`;

const CardMidContent = styled(Heading).attrs({ size: 'xl' })`
  line-height: 44px;
`;
const Home: React.FC<any> = ({ match }) => {
  const cache = useCache();
  const [pageLoaded, setPageLoaded] = useState(false);
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const [activeFaq, setActiveFaq] = useState(0);

  // useEffect(() => {
  //   if (!window || !window.document) return

  //   function switchToFancyLogo() {
  //     // setTimeout(() => {
  //     //   setPageLoaded(true)
  //     // }, 5000)
  //   }

  //   if (window.document.readyState === 'complete') {
  //     switchToFancyLogo()
  //   } else {
  //     window.addEventListener('load', switchToFancyLogo)
  //   }

  //   // @ts-ignore
  //   return () => {
  //     window.removeEventListener('load', switchToFancyLogo)
  //   }
  // }, [])

  const [itemSelected, _setItemSelected] = useState(null);
  const onItemSelected = (value, item) => {
    if (itemSelected && itemSelected.id === item.id) return;
    _setItemSelected(item);
  };

  const runes = safeRuneList;

  const totalRaised = cache.runes.totals.charity;

  let totalVault = 0;

  for (const runeSymbol of runes) {
    if (!cache.runes[runeSymbol]) continue;
    totalVault += cache.runes[runeSymbol].holders
      ? cache.runes[runeSymbol].price * cache.runes[runeSymbol].holders.vault
      : 0;
  }

  totalVault += cache.runes.rune.price * cache.runes.rune.holders.vault;

  const runeSupply = cache.runes.rxs.circulatingSupply;
  const runePrice = cache.runes.rxs.price;
  const runeMarketCap = cache.runes.rxs.circulatingSupply * cache.runes.rxs.price;
  const runesMarketCap = runes
    .filter((rune) => cache.runes[rune] && cache.runes[rune].circulatingSupply > 0 && cache.runes[rune].price > 0)
    .map((rune) => cache.runes[rune].circulatingSupply * cache.runes[rune].price)
    .reduce((a, b) => a + b);

  const { totalCharacters, totalItems, totalCommunities, totalPolls, totalClasses, totalGuilds, totalRunes } =
    cache.stats;

  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;
  const isHighRes = isXxxl;

  // const [videoUrl, setVideoUrl] = useState()

  // useEffect(() => {
  //   // @ts-ignore
  //   setVideoUrl('/videos/cube.mp4')
  // }, [])

  // const roadmap = [
  //   {
  //     number: 2021,
  //     status: 'done',
  //     q1: 'yes',
  //     q2: 'yes',
  //     q3: 'yes',
  //     q4: 'yes'
  //   },
  //   // {
  //   //   number: 2022,
  //   //   status: 'pending',
  //   //   q1: 'yes',
  //   //   q2: 'yes',
  //   //   q3: 'yes',
  //   //   q4: 'yes'
  //   // }
  // ]
  const games = [
    {
      name: 'Raid',
      path: '/raid',
      image: '/images/games/raid-card.png',
      description: (
        <ul>
          <li>Liquidity farming strategy with on-chain NFT mechanics</li>
          <li>Win rewards by staking liquidity</li>
          <li>Craft items that change harvest mechanics</li>
          <li>Web only</li>
        </ul>
      ),
      status: 'released',
    },
    {
      name: 'Evolution',
      path: '/evolution',
      image: '/images/games/evolution-card.png',
      description: (
        <ul>
          <li>Simple to play arcade, hard to master</li>
          <li>Quick 5 minute battles</li>
          <li>Find random valuable NFT items</li>
          <li>Win rounds to win tokens</li>
          <li>Weekly &amp; monthly Battle Royales</li>
          <li>Desktop + Android</li>
        </ul>
      ),
      status: 'beta',
    },
    {
      name: 'Infinite',
      path: '/infinite',
      image: '/images/games/infinite-card.png',
      description: (
        <ul>
          <li>Fast-paced top-down arena brawler</li>
          <li>3 rounds 3 minutes each</li>
          <li>Progress through the ranks</li>
          <li>Win tokens and find random NFT items</li>
          <li>Desktop, with web + mobile app for certain features</li>
        </ul>
      ),
      status: 'earliestaccess',
    },
    {
      name: 'Sanctuary',
      path: '/sanctuary',
      image: '/images/games/sanctuary-card.png',
      description: (
        <ul>
          <li>3D MMORPG</li>
          <li>Find unique items in your journey</li>
          <li>Win tokens in arena &amp; raid battles</li>
          <li>Buy land + NPCs + guild tokens to customize the world around you</li>
          <li>Desktop, with web + mobile app for certain features</li>
        </ul>
      ),
      status: 'pending',
    },
    {
      name: 'Guardians',
      path: '/guardians',
      image: '/images/games/guardians-card.png',
      description: (
        <ul>
          <li>Explore this 2D world full of guardians</li>
          <li>Hatch, grow and customize your guardian</li>
          <li>Bring your guardians to other games and battle along side them</li>
          <li>Desktop + Android + iPhone</li>
        </ul>
      ),
      status: 'pending',
    },
  ];

  const roadmapItems = [
    {
      title: 'Runic Raids Launched',
      image: 'https://pbs.twimg.com/media/FMkoMBAVcAIGXC3?format=jpg&name=large',
      date: 'Q1 2021',
      description: `Runic Raids launched March 30, 2021`,
    },
    {
      title: 'Evolution Isles Launched',
      image: 'https://i.imgur.com/ba1Jc3E.png',
      date: 'Q3 2021',
      description: `Evolution Isles launched July 3, 2021`,
    },
    {
      title: 'Infinite Arena Earliest Access',
      image: 'https://i.imgur.com/ba1Jc3E.png',
      date: 'Q1 2022',
      description: `Infinite Arena EA launched April 6, 2022`,
    },
    {
      title: 'Arken Realms',
      image: 'https://i.imgur.com/ba1Jc3E.png',
      date: 'Future',
      description: `Arken Realms will connect everything we've built into an omniverse.`,
    },
    {
      title: 'Heart of the Oasis',
      image: 'https://pbs.twimg.com/media/FKtrPCdVIAEmZL7?format=jpg&name=large',
      date: 'Future',
      description: `Heart of the Oasis will be a dark fantasy MMORPG set within the Arken Realms.`,
    },
  ];

  const faq = [
    {
      title: 'When did the token go live?',
      content: <p>The token went live on Binance Smart Chain (BSC) on March 30th 2021 at 21:15 UTC</p>,
    },
    {
      title: 'Max supply?',
      content: (
        <p>
          <strong>$RUNE</strong> is the old protocol token, and has a max supply of 22,529.999999. Burned: 3,230. Total
          circulating supply: 19,300. Originally 10,000 were minted, and the remaining 12,529.999999 were farmed. The
          farm was closed and <strong>$RUNE</strong> ownership was renounced, and is{' '}
          <a href="https://bscscan.com/address/0xaa3c49605e1b05aa70aaadd1aabc11d887e96b98#code">owned by the Void</a>, a
          contract which can only set the transfer fees (hardcoded to 1.2% max).
          <br />
          <br />
          <strong>$RXS</strong> is the new protocol token, and has a max supply of 192,999,312.886826. Burned:
          1,000,000. The RXS contract itself allows you to exchange 1 $RUNE for 10,000 $RXS. More than 75%&nbsp;has been
          converted and 10% is in a locked LP. <strong>$RUNE</strong>&nbsp;is burned in the process. This means that
          there can only be RXS&nbsp;or RUNE&nbsp;available at once time, so there is no chance of inflation.
        </p>
      ),
    },
    {
      title: 'Tokenomics?',
      content: (
        <p>
          <a href="https://arken.gg/tokenomics">See here for details</a>.
        </p>
      ),
    },
    {
      title: 'Audit?',
      content: (
        <p>
          Rune has been audited by{' '}
          <a href="https://www.certik.com/projects/rune" target="_blank" rel="noreferrer noopener">
            CertiK
          </a>{' '}
          and RD Auditors. It has been internally audited by half a dozen developers.{' '}
        </p>
      ),
    },
    {
      title: 'Slippage?',
      content: (
        <p>
          If trading for RXS, then 0.5%. If trading between <strong>runes</strong> then 2.2% or up to 3%. If trading 1{' '}
          <strong>rune</strong> and BNB/BUSD then 1.2%. For simplicity try 5%, but be aware you may get frontrun.
          <br />
          <br />
          Make sure to use round numbers.
        </p>
      ),
    },
  ];

  return (
    <div>
      <div
        css={css`
          position: relative;
          height: calc(100vh - 200px);
          width: 100%;

          ${({ theme }) => theme.mediaQueries.md} {
            height: calc(100vh - 100px);
            min-height: 900px;
          }
        `}>
        <Lore />
        <div
          id="landing-actions"
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 999;
            text-align: center;
            display: flex;
            pointer-events: none;
            opacity: 1;

            ${({ theme }) => theme.mediaQueries.md} {
              height: 100%;
            }
            &.disabled {
              opacity: 0;

              transition: opacity 0.5s;

              * {
                pointer-events: none;
              }
            }
          `}>
          <div
            css={css`
              align-self: center;
              margin: 0 auto;
            `}>
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              css={css`
                filter: drop-shadow(4px 6px 10px black);
                padding: 30px;
              `}>
              {/* <LogoImg src="/images/rune-500x500.png" />
              <Heading as="h1" size="xxl" color="secondary" mb="0px" mt="8px">
                <HeadingSilver>RUNE</HeadingSilver>
              </Heading> */}
            </Flex>
            <Card
              css={css`
                margin: 0 auto 30px auto;
                max-width: 820px;
                max-height: 900px;
                pointer-events: all;
              `}>
              <Flex
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                css={css`
                  filter: drop-shadow(1px 1px 1px black);
                  padding: 30px;
                  border-radius: 8px;
                  background: rgba(0, 0, 0, 0.1) radial-gradient(black, transparent);

                  // &:before {
                  //   position: absolute;
                  //   top: 0;
                  //   left: 0;
                  //   background: url(https://uploads-ssl.webflow.com/618ec26aa362f8479a86d117/619abe5cb521b2aa40456ecf_parchment-overlay-2.png) no-repeat 0 0;
                  //   background-size: 100%;
                  //   width: 100%;
                  //   height: 100%;
                  //   pointer-events: none;
                  //   content: ' ';
                  //   opacity: 0.5;
                  // }
                `}>
                <Flex
                  flexDirection={['column', null, 'row']}
                  alignItems="center"
                  justifyContent="center"
                  mb="30px"
                  css={css`
                    min-height: 135px;
                  `}>
                  {/* <Shortcut
                    onClick={() => {
                      history.push('/raid');
                    }}>
                    <img src={RaidIcon} />
                    <p>RUNIC RAIDS</p>
                  </Shortcut> */}
                  <Shortcut onClick={() => history.push('/evolution')}>
                    <img src={EvolutionIcon} />
                    <p>EVOLUTION ISLES</p>
                  </Shortcut>
                  <Shortcut onClick={() => history.push('/infinite')} active>
                    <img src={InfiniteIcon} />
                    <p>INFINITE ARENA</p>
                  </Shortcut>
                  {!isMobile ? (
                    <Shortcut onClick={() => history.push('/sanctuary')}>
                      <img src={SanctuaryIcon} />
                      <p>HEART OF THE OASIS</p>
                    </Shortcut>
                  ) : null}
                  {/* {!isMobile ? (
                    <Shortcut onClick={() => history.push('/guardians')}>
                      <img src={GuardiansIcon} />
                      <p>GUARDIANS</p>
                    </Shortcut>
                  ) : null} */}
                </Flex>
                <Heading
                  as="h2"
                  size="lg"
                  mb="8px"
                  style={{ textAlign: 'center', filter: 'drop-shadow(2px 4px 6px black)' }}>
                  {t('The First NFT Hyperfarm')}
                </Heading>
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
                    style={{
                      zoom: 1,
                      padding: '6px 20px',
                      textAlign: 'center',
                      background: '#222',
                      marginLeft: 10,
                    }}
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
                      style={{
                        zoom: 1,
                        padding: '6px 20px',
                        textAlign: 'center',
                        background: '#222',
                        marginLeft: 10,
                      }}>
                      {t('查看说明文档')}
                    </Button>
                  ) : null}
                </Flex>
              </Flex>
            </Card>
          </div>
        </div>
        {/* <div css={css`
position: absolute;
bottom: 0;
left: calc(50% - 200px);
width: 400px;
height: 400px;
z-index: 999;
// -webkit-filter: drop-shadow(1px 1px 30px rgba(0,0,0,1));
// -webkit-mask-image: url(https://uploads-ssl.webflow.com/618ec26aa362f8479a86d117/619abd17dab55b090dfd2c7f_parchment-bg-2.png);
// -webkit-mask-size: 100%;
// background: url(https://uploads-ssl.webflow.com/618ec26aa362f8479a86d117/bg-brighter.jpg) repeat 0 0;
`}>
             
      </div>*/}
      </div>
      <Page style={{ zIndex: 2, position: 'relative', maxWidth: 'none', width: '100%' }}>
        <Card3
          id="landing-intro"
          css={css`
            max-width: 1200px;
            margin: 500px auto 30px auto;

            ${({ theme }) => theme.mediaQueries.md} {
              margin-top: -75px;
            }
            &.disabled {
              margin-top: 0px;

              transition: margin 0.5s;
            }
          `}>
          <Card>
            <CardBody>
              <PitchCard>
                <div style={{ width: '280px', marginTop: '-20px' }}>
                  <img src="/images/character-classes/sorceress.png" alt="Metaverse"></img>
                </div>
                <div>
                  <BoxHeading as="h2" size="xl">
                    {t('Metaverse')}
                  </BoxHeading>
                  <br />
                  <p>
                    Immerse yourself in our fantasy games, win runes and items, trade them on the{' '}
                    <RouterLink to="/market" style={{ borderBottom: '1px solid #fff' }}>
                      Arken Market
                    </RouterLink>
                    .
                    <br />
                    <br />
                    We build fun games, and incorporate web3 gaming so you own your character and items for life, can
                    bring them between games, and monetize on your hard work.
                  </p>
                </div>
              </PitchCard>
              <br />
              <PitchCard>
                <div style={{ width: '280px', marginTop: '-20px' }}>
                  <img src="/images/dragons.png" alt="Play4Rewards"></img>
                </div>
                <div>
                  <BoxHeading as="h2" size="xl">
                    {t('Play4Rewards')}
                  </BoxHeading>
                  <br />
                  <p>
                    Imagine a digital game world where you have real ownership, control and impact. You have developed
                    your skill &amp; knowledge, and are now rewarded for your effort.
                    <br />
                    <br />
                    Our goal is for rewards to feel meaningful, and provide an income for at least 1% of our most
                    talented/hard working players.
                    <br />
                    <br />
                    There are{' '}
                    <RouterLink to="/runes" style={{ borderBottom: '1px solid #fff' }}>
                      33 Runes
                    </RouterLink>{' '}
                    and each have different utility. Runes can be used to unlock specific features, or for crafting
                    items. Players are then rewarded runes by winning games or finding them randomly in the game.
                  </p>
                </div>
              </PitchCard>
              <br />
              <PitchCard>
                <div style={{ width: '275px', marginRight: '10px' }}>
                  <Image src="/images/cube-preview.png" />
                </div>
                <div>
                  <BoxHeading as="h2" size="xl">
                    {t('Evolving NFTs')}
                  </BoxHeading>
                  <br />
                  <p>
                    <Linker id="home-1">
                      Runes are needed to{' '}
                      <RouterLink to="/craft" style={{ borderBottom: '1px solid #fff' }}>
                        craft Runeforms
                      </RouterLink>{' '}
                      (NFTs), unique and powerful weapons and armor used to enhance your Runic Raids farm rewards, or
                      buff your Infinite Arena hero. <br />
                      <br />
                      The item attributes that power the mechanics are built directly into the NFTs themselves. These
                      items can be used in all Arken games, or even games not published by us. We call these Evolving
                      NFTs.
                      <br />
                      <br />
                      Our eventual goal is to build unstoppable distributed &amp; modular games within the Arken Realms.
                    </Linker>
                  </p>
                </div>
              </PitchCard>
              <br />
              <br />
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <Button as={RouterLink} to="/about" variant="text" style={{ border: '2px solid #ddd' }}>
                  Learn More
                </Button>
              </Flex>
            </CardBody>
          </Card>
        </Card3>
        {/* {!isMobile ? (
          <Flex
            flexDirection={['column', null, 'row']}
            alignItems="center"
            justifyContent="space-between"
            css={css`
              max-width: 1200px;
              margin: 0px auto 30px;
              text-align: center;
            `}>
            <BigCard>
              <CardBodyHover
                onClick={() => {
                  window.location.href =
                    'https://bscscan.com/token/0x2098fef7eeae592038f4f3c4b008515fed0d5886#balances';
                }}>
                <BoxHeading as="h2" size="lg">
                  {runePrice ? `${parseFloat(runeSupply.toFixed(0)).toLocaleString()}` : 'Loading...'}
                </BoxHeading>
                <div>{t('Max Supply')}</div>
              </CardBodyHover>
            </BigCard>
            <BigCard>
              <CardBodyHover
                onClick={() => {
                  window.location.href = 'https://poocoin.app/tokens/0x2098fef7eeae592038f4f3c4b008515fed0d5886';
                }}>
                <BoxHeading as="h2" size="lg">
                  {runePrice ? `$${runePrice.toFixed(4)}` : 'Loading...'}
                </BoxHeading>
                <div>{t('Price')}</div>
              </CardBodyHover>
            </BigCard>
            <BigCard>
              <CardBodyHover
                onClick={() => {
                  window.location.href = 'https://poocoin.app/tokens/0x2098fef7eeae592038f4f3c4b008515fed0d5886';
                }}>
                <BoxHeading as="h2" size="lg">
                  {runePrice ? `$${parseFloat(runeMarketCap.toFixed(0)).toLocaleString()}` : 'Loading...'}
                </BoxHeading>
                <div>{t('Market Cap')}</div>
              </CardBodyHover>
            </BigCard>
            <BigCard>
              <CardBodyHover
                onClick={() => {
                  // window.location.href = 'https://bscscan.com/token/0x2098fef7eeae592038f4f3c4b008515fed0d5886#balances'
                }}>
                <BoxHeading as="h2" size="lg">
                  {runePrice ? `≥ 19,000` : 'Loading...'}
                </BoxHeading>
                <div>{t('Users')}</div>
              </CardBodyHover>
            </BigCard>
          </Flex>
        ) : null} */}

        <Card2 style={{ maxWidth: 1200, margin: '0 auto 30px auto' }}>
          <Card>
            <BoxHeading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
              {t('Games')}
            </BoxHeading>
            <Games />
            {/* <Swiper
            // install Swiper modules
            // direction={"vertical"}
            modules={[Navigation, Pagination, Scrollbar]}
            spaceBetween={5}
            slidesPerView={isMobile ? 1 : 4}
            navigation
            // simulateTouch={!touchCapable()}
            // pagination={{ clickable: true }}
            // scrollbar={{ draggable: true }}
            // onSwiper={(swiper) => console.log(swiper)}
            // onSlideChange={() => console.log('slide change')}
            style={{ maxWidth: 1200, margin: '0 auto 30px auto' }}>
            {games.map((game) => (
              <SwiperSlide key={game.name} style={{ height: '100%', position: 'relative' }}>
                <GameCard>
                  <Header>
                    <Heading as="h2" size="lg" mb="8px" style={{ fontSize: '1.8rem' }}>
                      <span style={{ fontSize: '0.8rem' }}>Rune</span>
                      <br />
                      {game.name}
                    </Heading>
                    <HeaderTag>
                      {game.status === 'released' ? (
                        <Tag2 outline variant="success">
                          Released
                        </Tag2>
                      ) : null}
                      {game.status === 'beta' ? (
                        <Tag2 outline variant="success">
                          Beta
                        </Tag2>
                      ) : null}
                      {game.status === 'earlyaccess' ? (
                        <Tag2 outline variant="success">
                          Early Access
                        </Tag2>
                      ) : null}
                      {game.status === 'earliestaccess' ? (
                        <Tag2 outline variant="success">
                          Earliest Access
                        </Tag2>
                      ) : null}
                      {game.status === 'pending' ? (
                        <Tag2 outline variant="textDisabled">
                          In Development
                        </Tag2>
                      ) : null}
                      {game.status === 'soon' ? (
                        <Tag2 outline variant="textDisabled">
                          Coming Soon
                        </Tag2>
                      ) : null}
                    </HeaderTag>
                  </Header>
                  <ImageBlock url={game.image} />
                  <InfoBlock>{game.description}</InfoBlock>
                  <BottomMenu>
                    {game.status === 'released' || game.status === 'beta' ? (
                      <Button
                        as={RouterLink}
                        to={game.path}
                        style={{ zoom: 1, padding: '6px 20px', textAlign: 'center' }}>
                        Play Now
                      </Button>
                    ) : null}
                    {game.status === 'earlyaccess' ? (
                      <Button
                        as={RouterLink}
                        to={game.path}
                        style={{ zoom: 1, padding: '6px 20px', textAlign: 'center' }}>
                        Get Early Access
                      </Button>
                    ) : null}
                    {game.status === 'earliestaccess' ? (
                      <Button
                        as={RouterLink}
                        to={game.path}
                        style={{ zoom: 1, padding: '6px 20px', textAlign: 'center' }}>
                        Get Earliest Access
                      </Button>
                    ) : null}
                    {game.status === 'pending' || game.status === 'soon' ? (
                      <Button
                        as={RouterLink}
                        variant="text"
                        to={game.path}
                        style={{
                          zoom: 1,
                          padding: '6px 20px',
                          textAlign: 'center',
                          border: '2px solid #ddd',
                          borderRadius: '10px',
                        }}>
                        Preview
                      </Button>
                    ) : null}
                  </BottomMenu>
                </GameCard>
              </SwiperSlide>
            ))}
          </Swiper>
          <CardBody>
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <Button as={RouterLink} variant="text" to="/games" style={{ border: '2px solid #ddd' }}>
                View All Games
              </Button>
            </Flex>
          </CardBody> */}
          </Card>
        </Card2>
        {/* <Flex
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          css={css`
            max-width: 1200px;
            margin: 0 auto;
          `}>
          <BigCard>
            <div
              css={css`
                zoom: 0.8;
                text-align: center;

                ${({ theme }) => theme.mediaQueries.md} {
                  padding: 0 40px 30px;
                }

                ${({ theme }) => theme.mediaQueries.xxxl} {
                  display: block;
                  position: fixed;
                  bottom: 95px;
                  left: 20px;
                  cursor: url('/images/cursor3.png'), pointer;
                  z-index: 50;
                  filter: drop-shadow(black 2px 4px 6px);
                  opacity: 0.85;
                  zoom: 0.9;
                  text-align: left;
                  padding: 0;
                }
              `}
              onClick={() => history.push('/raid')}>
              <EarnRaid />
            </div>
          </BigCard>
          <BigCard>
            <div
              css={css`
                // display: none;
                zoom: 0.8;
                text-align: center;

                ${({ theme }) => theme.mediaQueries.md} {
                  padding: 0 40px 30px;
                }

                ${({ theme }) => theme.mediaQueries.xxxl} {
                  display: block;
                  position: fixed;
                  bottom: 225px;
                  left: 20px;
                  cursor: url('/images/cursor3.png'), pointer;
                  z-index: 50;
                  filter: drop-shadow(black 2px 4px 6px);
                  opacity: 0.85;
                  zoom: 0.9;
                  text-align: left;
                  padding: 0;
                }
              `}
              onClick={() => history.push('/evolution')}>
              <EarnEvolution />
            </div>
          </BigCard>
        </Flex> */}
        <News />
        <Card3 style={{ maxWidth: 1200, margin: '0 auto 30px auto' }}>
          <Card>
            <BoxHeading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
              {t('Roadmap')}
            </BoxHeading>
            <hr />
            <br />
            <Swiper
              // install Swiper modules
              // direction={"vertical"}
              modules={[Navigation, Pagination, Scrollbar]}
              spaceBetween={30}
              slidesPerView={isMobile ? 1 : 3}
              navigation
              // pagination={{ clickable: true }}
              // scrollbar={{ draggable: true }}
              // onSwiper={(swiper) => console.log(swiper)}
              // onSlideChange={() => console.log('slide change')}
              style={{ maxWidth: 1200, margin: '0 auto 30px auto', padding: '0 20px' }}>
              {roadmapItems.map((item) => (
                <SwiperSlide style={{ maxWidth: 1200, margin: '0 auto', height: 'auto' }}>
                  <RoadmapItem item={item} />
                </SwiperSlide>
              ))}
            </Swiper>
            <CardBody>
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <Button as={RouterLink} to="/roadmap" variant="text" style={{ border: '2px solid #ddd' }}>
                  View Full Roadmap
                </Button>
              </Flex>
            </CardBody>
          </Card>
        </Card3>

        <Card3 style={{ maxWidth: 1200, margin: '0 auto 30px auto' }}>
          <Card>
            <BoxHeading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
              {t('FAQ')}
            </BoxHeading>
            <hr />
            <CardBody>
              {faq.map((item, index) => (
                <Accordion
                  isPushed={activeFaq === index}
                  pushNav={(isPushed) => setActiveFaq(index)}
                  icon={<div />}
                  label={item.title}
                  initialOpenState={activeFaq === index}
                  // className={calloutClass}
                  isActive={index === activeFaq}
                  // style={{maxHeight: 'auto'}}
                  contentCss={css`
                    box-shadow: 0 0 10px rgb(255 255 255 / 20%);
                    max-height: ${activeFaq === index ? 'none' : '0'};
                  `}
                  entryCss={css`
                    // background: rgba(0, 0, 0, 0.1);
                    font-weight: bold;
                    box-shadow: 0 0 10px rgb(255 255 255 / 20%);
                    * {
                      color: #bb955e !important;
                    }
                  `}>
                  <AccordionContent>{item.content}</AccordionContent>
                </Accordion>
              ))}
              <br />
              <br />
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <Button as={RouterLink} to="/faq" variant="text" style={{ border: '2px solid #ddd' }}>
                  View All
                </Button>
              </Flex>
            </CardBody>
          </Card>
        </Card3>
        {/* 
        <Card3 style={{ maxWidth: 1200, margin: '0 auto 30px auto' }}>
          <Card>
            <BoxHeading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
              {t('Council')}
            </BoxHeading>
            <hr />
            <CardBody>
              <TeamComponent showAll={true} />
              <br />
              <br />
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <Button as={RouterLink} to="/team" variant="text" style={{ border: '2px solid #ddd' }}>
                  View Full Council
                </Button>
              </Flex>
            </CardBody>
          </Card>
        </Card3> */}

        <Swiper
          // install Swiper modules
          // direction={"vertical"}
          modules={[Navigation, Pagination, Scrollbar]}
          spaceBetween={30}
          slidesPerView={isMobile ? 1 : 2}
          navigation
          // pagination={{ clickable: true }}
          // scrollbar={{ draggable: true }}
          // onSwiper={(swiper) => console.log(swiper)}
          // onSlideChange={() => console.log('slide change')}
          style={{ maxWidth: 1200, margin: '0 auto 30px auto' }}>
          {/* <ul><li><a href="#" class="active"><span class="fp-sr-only">Welcome</span><span></span></a><div class="fp-tooltip fp-right">Welcome</div></li><li><a href="#"><span class="fp-sr-only">What is Rune?</span><span></span></a><div class="fp-tooltip fp-right">What is Rune?</div></li><li><a href="#"><span class="fp-sr-only">Our Games</span><span></span></a><div class="fp-tooltip fp-right">Our Games</div></li><li><a href="#"><span class="fp-sr-only">Twitch Stream</span><span></span></a><div class="fp-tooltip fp-right">Twitch Stream</div></li><li><a href="#"><span class="fp-sr-only">Main Features</span><span></span></a><div class="fp-tooltip fp-right">Main Features</div></li><li><a href="#"><span class="fp-sr-only">Tokenomics</span><span></span></a><div class="fp-tooltip fp-right">Tokenomics</div></li><li><a href="#"><span class="fp-sr-only">Roadmap</span><span></span></a><div class="fp-tooltip fp-right">Roadmap</div></li><li><a href="#"><span class="fp-sr-only">Stats</span><span></span></a><div class="fp-tooltip fp-right">Stats</div></li><li><a href="#"><span class="fp-sr-only">Our Vision</span><span></span></a><div class="fp-tooltip fp-right">Our Vision</div></li></ul>
          .fp-enabled body,html.fp-enabled{margin:0;padding:0;overflow:hidden;-webkit-tap-highlight-color:rgba(0,0,0,0)}.fp-section{position:relative;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.fp-slide{float:left}.fp-slide,.fp-slidesContainer{height:100%;display:block}.fp-slides{z-index:1;height:100%;overflow:hidden;position:relative;-webkit-transition:all .3s ease-out;transition:all .3s ease-out}.fp-section.fp-table,.fp-slide.fp-table{display:table;table-layout:fixed;width:100%}.fp-tableCell{display:table-cell;vertical-align:middle;width:100%;height:100%}.fp-slidesContainer{float:left;position:relative}.fp-controlArrow{-webkit-user-select:none;-moz-user-select:none;-khtml-user-select:none;-ms-user-select:none;position:absolute;z-index:4;top:50%;cursor:pointer;width:0;height:0;border-style:solid;margin-top:-38px;-webkit-transform:translateZ(0);-ms-transform:translateZ(0);transform:translateZ(0)}.fp-controlArrow.fp-prev{left:15px;width:0;border-width:38.5px 34px 38.5px 0;border-color:transparent #fff transparent transparent}.fp-controlArrow.fp-next{right:15px;border-width:38.5px 0 38.5px 34px;border-color:transparent transparent transparent #fff}.fp-scrollable{position:relative}.fp-scrollable,.fp-scroller{overflow:hidden}.iScrollIndicator{border:0!important}.fp-notransition{-webkit-transition:none!important;transition:none!important}#fp-nav{position:fixed;z-index:100;top:50%;opacity:1;transform:translateY(-50%);-ms-transform:translateY(-50%);-webkit-transform:translate3d(0,-50%,0)}#fp-nav.fp-right{right:17px}#fp-nav.fp-left{left:17px}.fp-slidesNav{position:absolute;z-index:4;opacity:1;-webkit-transform:translateZ(0);-ms-transform:translateZ(0);transform:translateZ(0);left:0!important;right:0;margin:0 auto!important}.fp-slidesNav.fp-bottom{bottom:17px}.fp-slidesNav.fp-top{top:17px}#fp-nav ul,.fp-slidesNav ul{margin:0;padding:0}#fp-nav ul li,.fp-slidesNav ul li{display:block;width:14px;height:13px;margin:7px;position:relative}.fp-slidesNav ul li{display:inline-block}#fp-nav ul li a,.fp-slidesNav ul li a{display:block;position:relative;z-index:1;width:100%;height:100%;cursor:pointer;text-decoration:none}#fp-nav ul li:hover a.active span,#fp-nav ul li a.active span,.fp-slidesNav ul li:hover a.active span,.fp-slidesNav ul li a.active span{height:12px;width:12px;margin:-6px 0 0 -6px;border-radius:100%}#fp-nav ul li a span,.fp-slidesNav ul li a span{border-radius:50%;position:absolute;z-index:1;height:4px;width:4px;border:0;background:#333;left:50%;top:50%;margin:-2px 0 0 -2px;-webkit-transition:all .1s ease-in-out;-moz-transition:all .1s ease-in-out;-o-transition:all .1s ease-in-out;transition:all .1s ease-in-out}#fp-nav ul li:hover a span,.fp-slidesNav ul li:hover a span{width:10px;height:10px;margin:-5px 0 0 -5px}#fp-nav ul li .fp-tooltip{position:absolute;top:-2px;color:#fff;font-size:14px;font-family:arial,helvetica,sans-serif;white-space:nowrap;max-width:220px;overflow:hidden;display:block;opacity:0;width:0;cursor:pointer}#fp-nav.fp-show-active a.active+.fp-tooltip,#fp-nav ul li:hover .fp-tooltip{-webkit-transition:opacity .2s ease-in;transition:opacity .2s ease-in;width:auto;opacity:1}#fp-nav ul li .fp-tooltip.fp-right{right:20px}#fp-nav ul li .fp-tooltip.fp-left{left:20px}.fp-auto-height.fp-section,.fp-auto-height .fp-slide,.fp-auto-height .fp-tableCell,.fp-responsive .fp-auto-height-responsive.fp-section,.fp-responsive .fp-auto-height-responsive .fp-slide,.fp-responsive .fp-auto-height-responsive .fp-tableCell{height:auto!important}.fp-sr-only{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
 */}
          {/* <ReactFullpage
          //fullpage options
          licenseKey={'YOUR_KEY_HERE'}
          navigation
          // anchors={['welcome', 'rune', 'games', 'stream', 'features', 'tokenomics', 'roadmap', 'stats', 'vision']}
          paddingTop={105}
          paddingLeft={56}
          cards={false}
          // scrollOverflowReset
          scrollOverflow
          navigationTooltips={[
            'Welcome',
            'What is Rune?',
            'Our Games',
            'Twitch Stream',
            'Main Features',
            'Tokenomics',
            'Roadmap',
            'Stats',
            'Our Vision',
          ]}
          // fitToSection
          cardsOptions={{
            perspective: 100,
            fadeContent: true,
            fadeBackground: true,
          }}
          render={({ state, fullpageApi }) => {
            return (
              <ReactFullpage.Wrapper> */}
          <SwiperSlide style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ padding: 5 }}>
              <Card3 style={{ minHeight: 610 }}>
                <Card>
                  <BoxHeading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
                    {t('Features')}
                  </BoxHeading>
                  <hr />
                  <CardBody>
                    <Cards>
                      <BigCard align="left">
                        <BulletPoints>
                          {/* <BulletPoint>
                        <a href="/raid" rel="noreferrer noopener">
                          ■ Farm / Pool mechanics
                        </a>
                      </BulletPoint> */}
                          <BulletPoint>
                            <a href="/craft" rel="noreferrer noopener">
                              ■ NFT Crafting
                            </a>
                          </BulletPoint>
                          <BulletPoint>
                            <a href="/craft" rel="noreferrer noopener">
                              ■ NFT Mechanics
                            </a>
                          </BulletPoint>
                          <BulletPoint>
                            <a href="/characters" rel="noreferrer noopener">
                              ■ Character NFTs
                            </a>
                          </BulletPoint>
                          <BulletPoint>
                            <a href="/account/inventory" rel="noreferrer noopener">
                              ■ Cross-game Inventory
                            </a>
                          </BulletPoint>
                          <BulletPoint>
                            <a href="/account/inventory" rel="noreferrer noopener">
                              ■ Character Equipment
                            </a>
                          </BulletPoint>
                          <BulletPoint>
                            <a href="https://www.certik.com/projects/rune" rel="noreferrer noopener">
                              ■ Audited (CertiK)
                            </a>
                          </BulletPoint>
                        </BulletPoints>
                      </BigCard>
                      <BigCard align="right">
                        <BulletPoints>
                          {/* <BulletPoint>
                        <a href="/runes" rel="noreferrer noopener">
                          33 Rune Tokens Max ■
                        </a>
                      </BulletPoint> */}
                          <BulletPoint>
                            <a href="/runes" rel="noreferrer noopener">
                              Utility Per Rune ■
                            </a>
                          </BulletPoint>
                          <BulletPoint>
                            <a href="/developers" rel="noreferrer noopener">
                              Data Transparency ■
                            </a>
                          </BulletPoint>
                          <BulletPoint>
                            <a href="https://github.arken.gg" rel="noreferrer noopener">
                              Open Source ■
                            </a>
                          </BulletPoint>
                          <BulletPoint>
                            <a href="/community" rel="noreferrer noopener">
                              Weekly Quizes ■
                            </a>
                          </BulletPoint>
                          <BulletPoint>
                            <a href="/community" rel="noreferrer noopener">
                              Contests ■
                            </a>
                          </BulletPoint>
                          <BulletPoint>
                            <a href="/community" rel="noreferrer noopener">
                              Community Riddles ■
                            </a>
                          </BulletPoint>
                        </BulletPoints>
                      </BigCard>
                    </Cards>
                    <Flex flexDirection="column" alignItems="center" justifyContent="center">
                      <Button as={RouterLink} to="/features" variant="text" style={{ border: '2px solid #ddd' }}>
                        View More
                      </Button>
                    </Flex>
                  </CardBody>
                </Card>
              </Card3>
            </div>
          </SwiperSlide>
          {/* <SwiperSlide style={{maxWidth: 1200, margin: '0 auto'}}>
                  <Card>
                    <BoxHeading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
                      {t('Tokenomics')}
                    </BoxHeading>
                    <hr />
                    <CardBody>
                      <Cards>
                        <BigCard align="left">
                          <BulletPoints>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                ■ Supply: 193,000,000 $RXS
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                ■ Fee: 1% (vault + charity + dev)
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                ■ Weapon NFTs
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                ■ Inventory / farm equips
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                ■ Crafting (random + utility)
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                ■ 33 Rune Tokens Max
                              </a>
                            </BulletPoint>
                          </BulletPoints>
                        </BigCard>
                        <BigCard align="right">
                          <BulletPoints>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                Buffs (increase yield) ■
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                Character NFTs ■
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                Weapon NFTs ■
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                Inventory / farm equips ■
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                Crafting (random + utility) ■
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                33 Rune Tokens ■
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                50K Max Supply Per Token ■
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                New Rune Weekly (Fluid Farming) ■
                              </a>
                            </BulletPoint>
                          </BulletPoints>
                        </BigCard>
                      </Cards>
                      <Flex flexDirection="column" alignItems="center" justifyContent="center">
                        <Button as={RouterLink} to="/tokenomics" variant="text" style={{border: '2px solid #ddd'}}>
                          View More
                        </Button>
                      </Flex>
                    </CardBody>
                  </Card>
                </SwiperSlide> */}
          {/* <SwiperSlide style={{maxWidth: 1200, margin: '0 auto'}}>
                  <Card>
                    <BoxHeading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
                      {t('Roadmap')}
                    </BoxHeading>
                    <hr />
                    <CardBody>
                      <Cards>
                        <BigCard align="left">
                          <BulletPoints>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                ■ Supply: 193,000,000 $RXS
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                ■ Fee: 1% (vault + charity + dev)
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                ■ Weapon NFTs
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                ■ Inventory / farm equips
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                ■ Crafting (random + utility)
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                ■ 33 Rune Tokens Max
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                ■ 50K Max Supply Per Token
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                ■ New Rune Weekly (Fluid Farming)
                              </a>
                            </BulletPoint>
                          </BulletPoints>
                        </BigCard>
                        <BigCard align="right">
                          <BulletPoints>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                Buffs (increase yield) ■
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                Character NFTs ■
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                Weapon NFTs ■
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                Inventory / farm equips ■
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                Crafting (random + utility) ■
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                33 Rune Tokens ■
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                50K Max Supply Per Token ■
                              </a>
                            </BulletPoint>
                            <BulletPoint>
                              <a href="/raid" rel="noreferrer noopener">
                                New Rune Weekly (Fluid Farming) ■
                              </a>
                            </BulletPoint>
                          </BulletPoints>
                        </BigCard>
                      </Cards>
                      <Flex flexDirection="column" alignItems="center" justifyContent="center">
                        <Button as={RouterLink} to="/roadmap" variant="text" style={{border: '2px solid #ddd'}}>
                          View More
                        </Button>
                      </Flex>
                    </CardBody>
                  </Card>
                </SwiperSlide> */}
          <SwiperSlide style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ padding: 5 }}>
              <Card3 style={{ minHeight: 610 }}>
                <Card>
                  <BoxHeading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
                    {t('Stats')}
                  </BoxHeading>
                  <hr />
                  <CardBody>
                    <Cards>
                      <BigCard>
                        <BulletPoints>
                          <BulletPoint>
                            <a href="https://arken.gg/stats" rel="noreferrer noopener" target="_blank">
                              {'≥'}{' '}
                              <strong>
                                <CardValueUnstyled fontSize="14px" value={14873} decimals={0} />
                              </strong>{' '}
                              {t(`token holders`)}
                            </a>
                          </BulletPoint>
                          <BulletPoint>
                            <a href="https://arken.gg/stats" rel="noreferrer noopener" target="_blank">
                              {'≥'}{' '}
                              <strong>
                                <CardValueUnstyled fontSize="14px" value={totalCharacters} decimals={0} />
                              </strong>{' '}
                              {t(`registered users`)}
                            </a>
                          </BulletPoint>
                          <BulletPoint>
                            <a href="https://arken.gg/stats" rel="noreferrer noopener" target="_blank">
                              {'≥'}{' '}
                              <strong>
                                <CardValueUnstyled fontSize="14px" value={totalItems} decimals={0} />
                              </strong>{' '}
                              {t(`items created`)}
                            </a>
                          </BulletPoint>
                          <BulletPoint>
                            <a href="https://arken.gg/market" rel="noreferrer noopener" target="_blank">
                              {'≥'}{' '}
                              <strong>
                                <CardValueUnstyled
                                  fontSize="14px"
                                  value={cache.stats.marketItemsSold + 3454}
                                  decimals={0}
                                />
                              </strong>{' '}
                              {t(`items sold in market`)}
                            </a>
                          </BulletPoint>
                          <BulletPoint>
                            <a
                              href="https://arken.gg/docs/#welcome-to-rune-farm"
                              rel="noreferrer noopener"
                              target="_blank">
                              {'≥'}{' '}
                              <strong>
                                <CardValueUnstyled fontSize="14px" value={totalCommunities} decimals={0} />
                              </strong>{' '}
                              {t(`language communities`)}
                            </a>
                          </BulletPoint>
                          <BulletPoint>
                            <a href="https://polls.arken.gg/" rel="noreferrer noopener" target="_blank">
                              {'≥'}{' '}
                              <strong>
                                <CardValueUnstyled fontSize="14px" value={totalPolls} decimals={0} />
                              </strong>{' '}
                              {t(`community polls`)}
                            </a>
                          </BulletPoint>
                          <BulletPoint>
                            <a
                              href="https://bscscan.com/address/0xa40b29b0dacb37331456c2ca3b65e56a6d79fc9e"
                              rel="noreferrer noopener"
                              target="_blank">
                              {'≥'}{' '}
                              <strong>
                                <CardValueUnstyled fontSize="14px" value={totalRaised} decimals={0} prefix="$" />
                              </strong>{' '}
                              {t(`raised for charity`)}
                            </a>
                          </BulletPoint>
                          <br />
                          {/* <BulletPoint>
                  <p>
                    Raised For Charity: <CardValueUnstyled fontSize="14px" value={totalRaised} decimals={0} prefix="$" />{' '}
                    USD
                  </p>
                </BulletPoint>
                <BulletPoint>
                  <p>
                    Held By Vault: <CardValueUnstyled fontSize="14px" value={totalVault} decimals={0} prefix="$" /> USD
                  </p>
                </BulletPoint> */}
                        </BulletPoints>
                      </BigCard>
                      <BigCard align="right">
                        <BulletPoints>
                          <BulletPoint>
                            <a href="https://arken.gg/stats" rel="noreferrer noopener" target="_blank">
                              <strong>
                                <CardValueUnstyled fontSize="14px" value={28} decimals={0} /> / 33 runes
                              </strong>{' '}
                              {t(`released`)}
                            </a>
                          </BulletPoint>
                          {/* <BulletPoint><a href="https://arken.gg/characters" rel="noreferrer noopener" target="_blank">Currently <strong><CardValueUnstyled fontSize="14px" value={totalRuneforms} decimals={0} /></strong> runewords</a></BulletPoint> */}
                          <BulletPoint>
                            <a href="https://arken.gg/characters" rel="noreferrer noopener" target="_blank">
                              <strong>
                                <CardValueUnstyled fontSize="14px" value={totalClasses} decimals={0} />
                              </strong>{' '}
                              {t(`classes`)}
                            </a>
                          </BulletPoint>
                          <BulletPoint>
                            <a href="https://arken.gg/guilds" rel="noreferrer noopener" target="_blank">
                              <strong>
                                <CardValueUnstyled fontSize="14px" value={totalGuilds} decimals={0} />
                              </strong>{' '}
                              {t(`guilds`)}
                            </a>
                          </BulletPoint>
                          <BulletPoint>
                            <p>
                              Total MC:{' '}
                              <CardValueUnstyled
                                fontSize="14px"
                                value={runeMarketCap + runesMarketCap}
                                decimals={0}
                                prefix="$"
                              />{' '}
                              USD
                              <br />
                              <span style={{ paddingLeft: 10 }}>
                                $RXS:{' '}
                                <CardValueUnstyled fontSize="14px" value={runeMarketCap} decimals={0} prefix="$" /> USD
                              </span>
                              <br />
                              <span style={{ paddingLeft: 10 }}>
                                $EX-$ZENO:{' '}
                                <CardValueUnstyled fontSize="14px" value={runesMarketCap} decimals={0} prefix="$" /> USD
                              </span>
                            </p>
                          </BulletPoint>
                          {/* <br />
              <BulletPoints>
                <BulletPoint>
                  <a href="https://runeguardians.com" rel="noreferrer noopener" target="_blank">
                    Guardians Unleashed (Collectibles)
                  </a>
                </BulletPoint>
                <BulletPoint>
                  <a
                    href="https://arcanesanctuary.miraheze.org/wiki/Rune_Infinite_Arena"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Infinite Arena (P2E)
                  </a>
                </BulletPoint>
                <BulletPoint>
                  <a href="/roadmap" rel="noreferrer noopener" target="_blank">
                    Heart of the Oasis (MMO)
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
                    target="_blank"
                  >
                    Ultimate Tournament
                  </a>
                </BulletPoint>
                <BulletPoint>
                  <a
                    href="https://ArkenRealms.medium.com/ready-player-one-df8cc19741e4"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Cross-chain NFT Bridge
                  </a>
                </BulletPoint>
                <BulletPoint>
                  <a
                    href="https://ArkenRealms.medium.com/ready-player-one-df8cc19741e4"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Unique NFT Airdrops
                  </a>
                </BulletPoint>
                <BulletPoint>
                  <a
                    href="https://ArkenRealms.medium.com/ready-player-one-df8cc19741e4"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    NFT Fundraisers
                  </a>
                </BulletPoint>
                <BulletPoint>
                  <a
                    href="https://ArkenRealms.medium.com/ready-player-one-df8cc19741e4"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Game Currency
                  </a>
                </BulletPoint>
                <BulletPoint>
                  <a
                    href="https://ArkenRealms.medium.com/ready-player-one-df8cc19741e4"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    $RXS Reward Staking
                  </a>
                </BulletPoint>
                <BulletPoint>
                  <a
                    href="/roadmap"
                    rel="noreferrer noopener"
                    style={{ color: '#bb955e' }}
                  >
                    View More...
                  </a>
                </BulletPoint> */}
                        </BulletPoints>
                      </BigCard>
                    </Cards>
                    <Flex flexDirection="column" alignItems="center" justifyContent="center">
                      <Button as={RouterLink} to="/stats" variant="text" style={{ border: '2px solid #ddd' }}>
                        View More
                      </Button>
                    </Flex>
                  </CardBody>
                </Card>
              </Card3>
            </div>
          </SwiperSlide>
        </Swiper>

        <Card3 style={{ maxWidth: 1200, margin: '0 auto 30px auto' }}>
          <Card>
            {/* <hr />
          <BoxHeading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
            {t('Partners')}
          </BoxHeading>
          <hr /> */}
            <CardBody>
              <BoxHeading as="h2" size="lg" style={{ textAlign: 'center' }}>
                {t('Partners & Listings')}
              </BoxHeading>
              <Partners>
                <a
                  href="https://www.binance.com/en/nft/profile/rune-7a727bcfb6d429fda32f2af9bb513f64"
                  rel="noreferrer noopener"
                  target="_blank"
                  style={{ textAlign: 'center' }}>
                  <img src="/images/other/binancenft.png" alt="Binance NFT" />
                </a>
                <a
                  href="https://app.mochi.market/collection/56/0xe97a1b9f5d4b849f0d78f58adb7dd91e90e0fb40?ViewAll=true"
                  rel="noreferrer noopener"
                  target="_blank"
                  style={{ textAlign: 'center' }}>
                  <img
                    src="/images/other/mochi.png"
                    alt="Mochi.Market"
                    css={css`
                      height: 35px;
                    `}
                  />
                </a>
                <a
                  href="https://treasureland.market/assets?contract=0xe97a1b9f5d4b849f0d78f58adb7dd91e90e0fb40&chain_id=56"
                  rel="noreferrer noopener"
                  target="_blank"
                  style={{ textAlign: 'center' }}>
                  <img
                    src="/images/other/treasureland.svg"
                    alt="Treasureland"
                    css={css`
                      filter: invert(1);
                    `}
                  />
                </a>
                <a
                  href="https://app.alturanft.com/user/0xa987f487639920a3c2efe58c8fbdedb96253ed9b?view=collections"
                  rel="noreferrer noopener"
                  target="_blank"
                  style={{ textAlign: 'center' }}>
                  <img
                    src="/images/other/altura.png"
                    alt="Altura"
                    css={css`
                      width: 110px;
                    `}
                  />
                </a>
                <a
                  href="https://app.babylons.io/rune"
                  rel="noreferrer noopener"
                  target="_blank"
                  style={{ textAlign: 'center' }}>
                  <img
                    src="/images/other/babylons.png"
                    alt="Babylons"
                    css={css`
                      height: 40px;
                    `}
                  />
                </a>
                <a
                  href="https://app.teaparty.life/p/arkenrealms"
                  rel="noreferrer noopener"
                  target="_blank"
                  style={{ textAlign: 'center' }}>
                  <img
                    src="/images/other/teaparty.png"
                    alt="Teaparty"
                    css={css`
                      height: 40px;
                    `}
                  />
                </a>
                {/* <a href="https://bscproject.org/#/project/507"><img src="/images/other/bscgemz.png" alt="BSC Gemz" /></a> */}
              </Partners>
            </CardBody>
            {/* <hr />
          <BoxHeading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
            {t('Listings')}
          </BoxHeading>
          <hr /> */}
            <CardBody>
              <Partners>
                <a
                  href="https://coinmarketcap.com/watchlist/6155d7e5bea8737592b2b8a6"
                  rel="noreferrer noopener"
                  target="_blank"
                  style={{ textAlign: 'center' }}>
                  <img
                    src="/images/other/coinmarketcap.svg"
                    alt="Coin Market Cap"
                    css={css`
                      filter: invert(1);
                    `}
                  />
                </a>
                <a
                  href="https://www.coingecko.com/en/coins/rune-shards"
                  rel="noreferrer noopener"
                  target="_blank"
                  style={{ textAlign: 'center' }}>
                  <img
                    src="/images/other/coingecko.png"
                    alt="Coin Gecko"
                    css={css`
                      width: 125px;
                    `}
                  />
                </a>
                {/* <a href="https://www.cointiger.com/" rel="noreferrer noopener" target="_blank">
                <img src="/images/other/cointiger.png" alt="Coin Tiger" />
              </a> */}
                <a
                  href="https://bnbproject.org/#/project/1669"
                  rel="noreferrer noopener"
                  target="_blank"
                  style={{ textAlign: 'center' }}>
                  <img
                    src="/images/other/bscproject.png"
                    alt="BSC Project"
                    css={css`
                      width: 140px;
                    `}
                  />
                </a>
                <a
                  href="https://bscscan.com/token/0x2098fef7eeae592038f4f3c4b008515fed0d5886#balances"
                  rel="noreferrer noopener"
                  target="_blank"
                  style={{ textAlign: 'center' }}>
                  <img
                    src="/images/other/bscscan.png"
                    alt="BscScan"
                    css={css`
                      width: 120px;
                    `}
                  />
                </a>
                <a
                  href="https://www.dapp.com/app/rune-farm"
                  rel="noreferrer noopener"
                  target="_blank"
                  style={{ textAlign: 'center' }}>
                  <img
                    src="/images/other/dapp.png"
                    alt="Dapp.com"
                    css={css`
                      width: 140px;
                    `}
                  />
                </a>
                <a
                  href="https://dappradar.com/binance-smart-chain/defi/rune-farm"
                  rel="noreferrer noopener"
                  target="_blank"
                  style={{ textAlign: 'center' }}>
                  <img src="/images/other/dappradar.png" alt="Dapp Radar" />
                </a>
              </Partners>
            </CardBody>
          </Card>
        </Card3>

        <Card3 style={{ maxWidth: 1200, margin: '0 auto 30px auto', overflow: 'visible' }}>
          <Card>
            <CardBody>
              <ThankYou />
            </CardBody>
          </Card>
        </Card3>
      </Page>
    </div>
  );
};

export default Home;
