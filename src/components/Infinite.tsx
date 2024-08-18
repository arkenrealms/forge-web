import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import Inventory from '~/components/Inventory';
import Page from '~/components/layout/Page';
import { useModal } from '~/components/Modal';
import { PurchaseModal } from '~/components/PurchaseModal';
import Skills from '~/components/Skills';
import useCache from '~/hooks/useCache';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import useWeb3 from '~/hooks/useWeb3';
import { useProfile } from '~/state/hooks';
import { BaseLayout, Button, Card, CloseIcon, Flex, Heading, Text } from '~/ui';
// import initReactFastclick from "react-fastclick";
import { safeRuneList } from '~/config';

import { Swiper, SwiperSlide } from 'swiper/react';

// import { FreeMode, Navigation, Thumbs } from "swiper";

// Import Swiper styles
//import '~swiper/swiper.min.css'
//import '~swiper/modules/free-mode/free-mode.min.css'
//import '~swiper/modules/navigation/navigation.min.css'
//import '~swiper/modules/thumbs/thumbs.min.css'
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import Champion from '~/components/Champion';
import ChampionDetail from '~/components/ChampionDetail';
import ChampionTrailer from '~/components/ChampionTrailer';
import ChampionWelcome from '~/components/ChampionWelcome';

import { championsData } from '~/assets/data/champions';

// SwiperCore.use([Mousewheel, Pagination, EffectFade])

const Img = styled.img`
  filter: contrast(1.1) drop-shadow(2px 4px 6px black);
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
  }
`;

const endpoints = {
  cache: 'https://envoy.arken.gg',
  coordinator: 'https://coordinator.arken.gg',
  // cache: 'http://localhost:6001', // 'https://envoy.arken.gg'
  // coordinator: 'http://localhost:5001' // 'https://coordinator.arken.gg'
};

const LogoImg = styled.img``;

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

const ItemContainer = styled.div``;

const Cards = styled(BaseLayout)`
  align-items: flex-start;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 12;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    & > div {
      grid-column: span 4;
    }
  }
`;
const MainCard = styled(Card)`
  position: relative;
  font-weight: bold;
  padding: 20px;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  text-align: center;
  color: #bb955e;
  text-shadow: 1px 1px 1px black;
  font-weight: bold;
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

const Promo1 = styled.a`
  position: absolute;
  top: 50px;
  left: 40px;
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

const GameTitleMap = {
  1: 'Raid',
  2: 'Evolution',
  3: 'Infinite',
  4: 'Sanctuary',
};

const mode = 'large';

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
const Home: React.FC<any> = () => {
  const cache = useCache();
  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />);
  const [pageLoaded, setPageLoaded] = useState(false);
  const { t } = useTranslation();
  const { profile } = useProfile();
  const { account, library } = useWeb3();
  const [rewards, setRewards] = useState({});
  const [playerRewards, setPlayerRewards] = useState({});

  const [itemSelected, _setItemSelected] = useState(null);
  const onItemSelected = (value, item) => {
    if (itemSelected && itemSelected.id === item.id) return;
    _setItemSelected(item);
  };

  const [holders, setHolders] = useState([]);

  useEffect(() => {
    if (holders.length) return;

    const init = async function () {
      const res = ((await (await fetch(`${endpoints.cache}/patrons.json`)).json()) as any) || [];

      setHolders(res.filter((p) => !!p.isCubeHolder));
    };

    init();
  }, [holders, setHolders]);

  const runes = safeRuneList;

  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;
  const isHighRes = isXxxl;

  const [videoUrl, setVideoUrl] = useState();

  useEffect(
    function () {
      if (!account) return;
      if (!window) return;

      async function init() {
        try {
          // const account2 = '0x0d835cEa2c866B2be91E82e0b5FBfE6f64eD14cd' // pet account on asia1
          // const account2 = '0xa6d1e757cE8de4341371a8e225f0bBB417D47E31' // rune account on asia1
          const response = await fetch(`${endpoints.cache}/users/${account}/overview.json`);
          const responseData = await response.json();

          if (responseData) {
            setPlayerRewards(responseData.rewards?.runes || {});
            setRewards(responseData.rewards?.items || {});
          }
        } catch (e) {
          console.log(e);
          setPlayerRewards({});
          setRewards({});
        }
      }

      init();

      const inter = setInterval(init, 1 * 60 * 1000);

      return () => {
        clearInterval(inter);
      };
    },
    [account]
  );
  useEffect(() => {
    // @ts-ignore
    setVideoUrl('/videos/cube.mp4');
  }, []);

  return (
    <div
      css={css`
        .overlay {
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
          }
        }

        .overlay2 {
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
          }
        }
      `}>
      <div
        className="main-swiper-wrapper"
        css={css`
          @import url('https://fonts.googleapis.com/css2?family=Rowdies:wght@300;400;700&display=swap');

          font-family: 'Rowdies', cursive;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          background-color: #000;
          color: #fff;
          overflow: hidden;

          * {
            -webkit-tap-highlight-color: transparent;
            user-select: none;
          }

          ul,
          li {
            list-style-type: none;
          }

          a {
            color: unset;
            text-decoration: none;
          }

          iframe {
            border: 0;
          }

          .bg-image {
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
          }

          & > .swiper > .swiper-wrapper > .swiper-slide > .section > .overlay {
            position: relative;
          }

          .main-color {
            color: #d0a85c;
          }

          .second-color {
            color: #86aeff;
          }

          .title {
            font-weight: 700;
            span {
              font-size: 3rem;
            }
            h2 {
              font-size: 5rem;
              line-height: 5rem;
            }
          }

          .container {
            max-width: 1670px;
            margin: auto;
          }

          .m-t-4 {
            margin-top: 4rem;
          }

          .relative {
            position: relative;
          }

          & > .swiper > .swiper-wrapper > .swiper-slide {
            height: 1000px;
          }

          .swiper-pagination-bullet {
            width: 20px;
            height: 20px;
            border-radius: unset;
            margin: 10px;
            background-color: transparent;

            position: relative;

            &::before {
              content: '';
              width: 80%;
              height: 80%;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%) rotate(45deg);
              background-color: #4267b2;
            }

            &-active {
              background-color: transparent;

              &::before {
                background-color: #d0a85c;
              }
            }
          }

          .swiper-pagination {
            position: absolute;
            text-align: center;
            transition: 0.3s opacity;
            transform: translate3d(0, 0, 0);
            z-index: 10;
          }
          .swiper-pagination-vertical.swiper-pagination-bullets,
          .swiper-vertical > .swiper-pagination-bullets {
            right: 10px;
            top: 50%;
            transform: translate3d(0px, -50%, 0);
          }

          .scroll {
            position: fixed;
            bottom: 1rem;
            z-index: 1;
            left: 50%;
            transform: translateX(-50%);
            animation: bounce 3s ease infinite;
          }

          @keyframes bounce {
            0% {
              transform: translateX(-50%) translateY(0);
            }
            50% {
              transform: translateX(-50%) translateY(-10px);
            }
            100% {
              transform: translateX(-50%) translateY(0);
            }
          }
        `}>
        <Swiper direction="vertical" slidesPerView={3} spaceBetween={0}>
          <SwiperSlide>
            {({ isActive }) => (
              <ChampionWelcome
                isActive={isActive}
                title="Arken: Infinite Arena"
                description={`Crush opponents while earning unique prizes in this fast-paced fantasy PvP brawler from Rune: an innovative
            crypto gaming company pushing GameFi to new horizons. Choose your class, customize your avatar, and collect
            unique NFTs playing the third game in Arken's ever-expanding metaverse. Test your mettle against players
            across the globe and rise above the rest as Champion of the Infinite Arena.`}>
                <div>
                  {account && holders.find((p) => p.address.toLowerCase() === account.toLowerCase()) ? (
                    <Button as={RouterLink} scale="md" to="/download/infinite" style={{ zoom: 1.5 }}>
                      {t('Download for Windows')}
                    </Button>
                  ) : (
                    <>
                      <Button
                        as={RouterLink}
                        to="/cube"
                        style={{ zoom: 1.5, padding: '6px 20px', textAlign: 'center' }}
                        onClick={() => {
                          window.scrollTo(0, 0);
                        }}>
                        Get Earliest Access
                      </Button>
                      <br />
                      <br />
                      <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                        <Button
                          as={RouterLink}
                          to="/account"
                          style={{ zoom: 1, padding: '6px 20px', textAlign: 'center', background: '#222' }}
                          onClick={() => {
                            window.scrollTo(0, 0);
                          }}>
                          Digital Pre-Purchase
                        </Button>
                      </Flex>
                    </>
                  )}
                </div>
              </ChampionWelcome>
            )}
          </SwiperSlide>
          <SwiperSlide>{({ isActive }) => <Champion isActive={isActive} />}</SwiperSlide>
          <SwiperSlide>{({ isActive }) => <ChampionTrailer isActive={isActive}></ChampionTrailer>}</SwiperSlide>
          {/* <SwiperSlide>
                  {({ isActive }) => <ChampionCredit isActive={isActive}/>}
              </SwiperSlide> */}
        </Swiper>
        {championsData.map((item, index) => (
          <ChampionDetail key={index} item={item} id={index} />
        ))}
      </div>

      {/* <Cards>
          <div></div>
          <MainCard>
            <Heading color="contrast" size="lg" style={{ textAlign: 'center', marginTop: 20 }}>
              Quick Links
            </Heading>
            <br />
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <Button
                  variant="text"
                  as={Link}
                  href="https://arken.gg/infinite/tutorial"
                  target="_blank"
                  style={{ color: '#bb955e', padding: '6px 20px', textAlign: 'center' }}
                >
                  {t('Tutorial')}
                  <OpenNewIcon ml="4px" />
                </Button>
              </Flex>
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <Button
                  variant="text"
                  as={Link}
                  href="https://t.me/ArkenRealms"
                  target="_blank"
                  style={{ color: '#bb955e', padding: '6px 20px', textAlign: 'center' }}
                >
                  {t('Announcements')}
                  <OpenNewIcon ml="4px" />
                </Button>
              </Flex>
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <Button
                  variant="text"
                  as={Link}
                  href="https://t.me/runereports"
                  target="_blank"
                  style={{ color: '#bb955e', padding: '6px 20px', textAlign: 'center' }}
                >
                  {t('Report Bugs')}
                  <OpenNewIcon ml="4px" />
                </Button>
              </Flex>
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <Button
                  variant="text"
                  as={Link}
                  href="https://arken.gg/sign?message=infinite"
                  target="_blank"
                  style={{ color: '#bb955e', padding: '6px 20px', textAlign: 'center' }}
                >
                  {t('Mobile Login')}
                  <OpenNewIcon ml="4px" />
                </Button>
              </Flex>
            </Flex>
          </MainCard>
          <MainCard>
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <Heading color="contrast" size="lg" style={{ textAlign: 'center', marginTop: 20 }}>
                Your Rewards
              </Heading>
              <br />
              {!profile?.nft ? (
                <>
                  <br />
                  <br />
                  <p
                    style={{
                      textAlign: 'left',
                      fontWeight: 'normal',
                      fontFamily: 'Cambria, Verdana, Arial, Helvetica, sans-serif',
                      textTransform: 'none',
                      fontSize: '0.9rem',
                    }}
                  >
                    You cannot claim rewards until you have created a Rune account.
                  </p>
                  <br />
                  <br />
                  <Button
                    scale="sm"
                    as={RouterLink}
                    to="/account"
                    onClick={() => {
                      window.scrollTo(0, 0)
                    }}
                  >
                    Create Account
                  </Button>
                </>
              ) : (
                <>
                  {Object.keys(playerRewards).filter((id) => playerRewards[id] > 0).length
                    ? Object.keys(playerRewards).map((id) => {
                        if (!playerRewards[id]) return null

                        return (
                          <div key={id}>
                            {(playerRewards[id] > 0 ? playerRewards[id] : 0).toFixed(3)} {id} <br />
                          </div>
                        )
                      })
                    : null}
                  <br />
                  <br />
                  <Button as={RouterLink} to="/account/rewards">
                    Reward Centre
                  </Button>
                </>
              )}
            </Flex>
          </MainCard>
        </Cards> */}
      {/* <div className="relative overlay2" css={css`
        background: url(https://dl.airtable.com/.attachments/56226c7a552c83d9c1fd180ce0a53762/0b41c243/Linden_1.jpg?ts=1661138074&userId=usrf0GZYc5zCl9Cv7&cs=b6d4fc8814763c41) no-repeat 0 0;
        background-size: cover;
      `}>
      <Page> */}
      {/* <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <LogoImg src="/images/rune-500x500.png" style={{ maxWidth: 200 }} />
          <Heading
            as="h1"
            size="xxl"
            mt="20px"
            mb="20px"
            style={{ textAlign: 'center', filter: 'drop-shadow(2px 4px 6px black)' }}
          >
            {t('Arken: Infinite Arena')}
          </Heading>
          <Img src="/images/chars.png" />
          <br />
          <br /> */}

      {/* <br />
          <Button variant="text" onClick={onPresentPurchaseModal}>
            {t('Purchase Runes')}
          </Button> */}
      {/* </Flex> */}
      {/* <Flex
          flexDirection="column"
          alignItems="center"
          mb="8px"
          justifyContent="start"
          style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}
        >
          <BoxHeading as="h2" size="xl">
            {t('Pre-Alpha Preview')}
          </BoxHeading>
          <br />
            <iframe
              src="https://www.youtube.com/embed/mhVL-VoEbQg"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', top: 0, left: 0, position: 'absolute' }}
            ></iframe>
        </Flex>
        <br />
        <br /> */}
      {/* </Page>
      </div> */}
      <div
        className="relative overlay2"
        css={css`
          background: url(https://dl.airtable.com/.attachments/eb804401d111e131c1bf2c15d8115d58/58c0d1cb/Miraqesh.jpg?ts=1661148536&userId=usrf0GZYc5zCl9Cv7&cs=3a12e1b560db4c6a)
            no-repeat 0 0;
          background-size: cover;
        `}>
        <Page>
          <Card style={{ zIndex: 2 }}>
            <BigCard align="left">
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
                      <UtilityModal>
                        <UtilityModalClose onClick={() => _setItemSelected(null)}>
                          <CloseIcon />
                        </UtilityModalClose>
                        <RouterLink
                          to={`/runes/${itemSelected?.name.toLowerCase().replace(' rune', '')}`}
                          style={{
                            // borderRadius: '5px',
                            fontWeight: 'bold',
                            borderBottom: '2px solid #bb955e',
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
                        <br />
                        <br />
                        <div style={{ textAlign: 'left', paddingLeft: '8px' }}>
                          <div>
                            <Text mr="10px" bold>
                              Arken: Runic Raids:
                            </Text>{' '}
                            <Text>Crafting.</Text>
                            <br />
                          </div>
                          {itemSelected.branches
                            ? Object.keys(itemSelected.branches)
                                .slice(1)
                                .map((i) =>
                                  itemSelected.branches[i].description !== 'To be announced.' ? (
                                    <div key={i}>
                                      <Text mr="10px" bold>
                                        Rune {GameTitleMap[i]}:
                                      </Text>{' '}
                                      <Text>{itemSelected.branches[i].description}</Text>
                                      <br />
                                    </div>
                                  ) : null
                                )
                            : null}
                        </div>
                      </UtilityModal>
                    </div>
                  ) : null}
                </ProfileContainer>
              ) : null}
              <BoxHeading as="h2" size="xl">
                {t('Infinite Glory')}
              </BoxHeading>
              <hr />
              <br />
              <p>
                Skills and combat in Infinite are unlike any Action RPG in history. Your deck is your gear. Your active
                cards are your skill bar. Your build is based on your gear. You have multiple gearsets you can choose
                from in town, changing your class + build instantly. Thus, your skills are made up from your gear. And
                just like a card game, certain skills are only useable under certain conditions. If your opponent
                Special Summons a Dragon, you will be allowed to cast Soul Barrier, which protects your summons from
                their pet's attacks. In this way, combat is more diverse with a very high skill cap. There will be much
                simpler situations where you'll be able to catch and deflect sorcery if you identify it in time.
                <br />
                <br />
                There are no LIMITS with the number of combinations! Feel free to use any skills you like!
                <br />
                Necromancer casting blizzard?
                <br />
                Warrior using illusions?
                <br />
                High level whirlwind on Assassin?
                <br />
                <br />
                <br />
                Build what you like, no excuses! You're the META MAKER!
              </p>
              {/* <p>
              {t(
                `Arken is the next evolution of DeFi farming. Farming is when you use your tokens to earn bonus tokens by staking them. Every week a new token is created (called a rune). It's farmed until the max supply of 50,000. That rune can then be combined with other runes to create NFTs. Those NFTs can be used to improve your earnings.`,
              )}
            </p> */}
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
                        to={`/runes/${itemSelected.name.toLowerCase().replace(' rune', '')}`}
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
                      <br />
                      <br />
                      {itemSelected.branches
                        ? Object.keys(itemSelected.branches).map((i) => (
                            <div key={i}>
                              <Text mr="10px" bold>
                                {GameTitleMap[i]} Utility:
                              </Text>{' '}
                              <Text>{itemSelected.branches[i].description}</Text>
                              <br />
                            </div>
                          ))
                        : null}
                    </div>
                  ) : null}
                </ProfileContainer>
              ) : null}
              {!isMobile ? (
                <>
                  <br />
                </>
              ) : null}
            </BigCard>
            <br />
            <br />
            <BigCard>
              {!isMobile ? (
                <img
                  src="/images/nfts/sorceress.png"
                  alt="Infinite Rewards"
                  style={{ float: 'left', width: '280px', marginTop: '-20px' }}></img>
              ) : null}
              <BoxHeading as="h2" size="xl">
                {t('Infinite Rewards')}
              </BoxHeading>
              <hr />
              <br />
              <p>
                We have incorporated blockchain gaming so your hero is a unique NFT, and you control their destiny.
                Battle for rewards in Arken: Infinite Arena arenas, find random loot, take a break and go destroy some
                dragons in Arken: Evolution Isles.
                <br />
                <br />
                Claim any amount, any time, with our smooth reward system.
              </p>
              {/* <p>
              {t(
                `You can start building your character right away. Choose from 1 of 7 classes, join a guild, and raid farms to start earning runes instantly.`,
              )}
            </p> */}
              {isMobile ? (
                <img src="/images/nfts/sorceress.png" alt="Infinite Rewards" style={{ width: '240px' }}></img>
              ) : null}
              {!isMobile ? (
                <>
                  <br />
                  <br />
                </>
              ) : null}
            </BigCard>
            <br />
            <br />
            <BigCard align="left">
              {!isMobile ? (
                <div style={{ float: 'right', width: '275px', marginRight: '10px' }}>
                  <Image src="/images/cube-preview.png" />
                </div>
              ) : null}
              <BoxHeading as="h2" size="xl">
                {t('Infinite Fun')}
              </BoxHeading>
              <hr />
              <br />
              <p>
                We're hyper focused on fun. We're throwing away all of the boring leveling so you can jump straight into
                the action right away. Battle it out over 3 rounds, use your skills and strategy in RPG combat like
                you've never done before.
                <br />
                <br />
                Join us every season for a fresh ladder, and claim the top prize. It'll be different every time, with
                our Dynamic Charged Skill System.
                <br />
                <br />
                Arken Entertainment are constantly evolving and being improved, and we listen to the community. Give us
                a shout in Telegram and make yourself heard.
              </p>
              {/* <p>
              <span
                dangerouslySetInnerHTML={{
                  __html: t(`Rune brings uniquely generated attributes to NFTs that have real utility.`, {
                    interpolation: { escapeValue: false },
                  }),
                }}
              />
              <br />
              <br />
              {t(
                `Every item has an affect on your farm: increase yield, burn, chance to unlock hidden pool, and much more!`,
              )}
            </p> */}
              {!isMobile ? (
                <>
                  <br />
                  <br />
                  <br />
                </>
              ) : null}
            </BigCard>
            <br />
            <br />
            <BigCard align="left">
              {/* <BoxHeading as="h2" size="xl">
              {t('NFT Skills')}
            </BoxHeading>
            <hr />
            <br /> */}
              <Skills />
            </BigCard>
          </Card>
        </Page>
      </div>
      <br />
    </div>
  );
};

export default Home;
