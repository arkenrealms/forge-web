import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { itemData } from '@arken/node/data/items';
import { ItemsMainCategoriesType } from '@arken/node/data/items.type';
import Inventory from '~/components/Inventory';
import Page from '~/components/layout/Page';
import Lore from '~/components/Lore';
import { useModal } from '~/components/Modal';
import { PurchaseModal } from '~/components/PurchaseModal';
import { RecipeInfo } from '~/components/RecipeInfo';
import useCache from '~/hooks/useCache';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import useSettings from '~/hooks/useSettings2';
import useWeb3 from '~/hooks/useWeb3';
import { Button, Card, Card3, CloseIcon, Flex, Heading, Text } from '~/ui';
// import initReactFastclick from "react-fastclick";
import ChampionDetail from '~/components/ChampionDetail';
import ChampionWelcome from '~/components/ChampionWelcome';
import Mechanics from '~/components/Sanctuary/Mechanics';
import { safeRuneList } from '~/config';

import { championsData } from '~/assets/data/champions';
// Import Swiper React components
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

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

const Img = styled.img`
  filter: contrast(1.1) drop-shadow(2px 4px 6px black);
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
  }
`;

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
  box-shadow:
    0 2px 0 0 rgb(0 0 0 / 80%),
    inset 0 -1px 0 0 rgb(0 0 0 / 10%),
    0 0 66px 66px rgb(0 0 0 / 10%);
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
  top: 0;
  left: 20px;
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
  // box-shadow: 0 0 10px rgb(186 148 94);
  // border: 1px solid #ba945e;
  border-width: 10px;
  border-style: solid;
  border-color: transparent;
  border-image: url(/images/frame.png) 80 / 80px / 0 repeat;
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
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { account, library } = useWeb3();
  const settings = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [itemSelected, _setItemSelected] = useState(null);
  const onItemSelected = (value, item) => {
    if (itemSelected && itemSelected.id === item.id) return;
    _setItemSelected(item);
  };

  const runes = safeRuneList;

  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;
  const isHighRes = isXxxl;

  const [videoUrl, setVideoUrl] = useState('/videos/cube.mp4');

  // useEffect(() => {
  //   // @ts-ignore
  //   setVideoUrl('/videos/cube.mp4')
  // }, [])\

  const holders = [];

  return (
    <>
      {/* {isMobile ? (
        <Flex flexDirection="column" alignItems="center" justifyContent="center" style={{ margin: '0 auto' }}>
          <LogoImg
            src="/images/rune-500x500.png"
            css={css`
              max-width: 200px;
              margin-top: 30px;
            `}
          />
          <Heading
            as="h1"
            size="xxl"
            mt="20px"
            mb="20px"
            style={{
              textAlign: 'center',
              filter: 'drop-shadow(2px 4px 6px black)',
              display: 'flex',
              textShadow: '0px 0px 1px #000',
              color: '#c8c7cd',
            }}
          >
            {t('Rune')}
          </Heading>
          <br />
          <br />
          {settings.isCrypto ? (
            <>
              <Button
                as={RouterLink}
                to="/account"
                style={{ zoom: 1.5, padding: '6px 20px', textAlign: 'center' }}
                onClick={() => {
                  window.scrollTo(0, 0)
                }}
              >
                {t('Digital Purchase')}
              </Button>
              <br />
              <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                <Button
                  as={RouterLink}
                  to="/cube"
                  style={{ zoom: 1, padding: '6px 20px', textAlign: 'center', background: '#222' }}
                  onClick={() => {
                    window.scrollTo(0, 0)
                  }}
                >
                  {t("Founder's Edition")}
                </Button>
              </Flex>
            </>
          ) : null}
        </Flex>
      ) : (
        <div
          css={css`
            border-width: 8px;
            border-style: solid;
            border-color: transparent;
            border-image: url(/images/frame.png) 80 / 80px / 0 repeat;
            border-radius: 0px;
            background: #000;
          `}
        >
          <div
            css={css`
              position: relative;
              height: calc(100vh - 118px);
              width: 100%;
              overflow: hidden;
            `}
          >
            <div
              css={css`
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                opacity: 0.9;
              `}
            >
              <video
                src="https://storage.googleapis.com/runepublic/Videos/Rune%20Sanctuary%20-%20Trailer.mp4"
                autoPlay
                loop
                muted
                css={css`
                  position: absolute;
                  top: 0;
                  bottom: 0;
                  right: 0;
                  left: 0;
                  margin: auto;
                  min-height: 50%;
                  min-width: 50%;
                `}
              ></video>
            </div>

            <div
              css={css`
                position: absolute;
                bottom: 60px;
                left: 0;
                text-align: center;
                width: 100%;
              `}
            >
              <Flex flexDirection="column" alignItems="center" justifyContent="center" style={{ margin: '0 auto' }}>
                <br />
                <br />
                {settings.isCrypto ? (
                  <>
                    <Button
                      as={RouterLink}
                      to="/account"
                      style={{ zoom: 1.5, padding: '6px 20px', textAlign: 'center' }}
                      onClick={() => {
                        window.scrollTo(0, 0)
                      }}
                    >
                      {t('Pre-Purchase')}
                    </Button>
                    <br />
                    <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                      <Button
                        as={RouterLink}
                        to="/cube"
                        style={{ zoom: 1, padding: '6px 20px', textAlign: 'center', background: '#222' }}
                        onClick={() => {
                          window.scrollTo(0, 0)
                        }}
                      >
                        {t("Founder's Edition")}
                      </Button>
                    </Flex>
                  </>
                ) : null}
              </Flex>
            </div>
          </div>
        </div>
      )} */}
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
              height: 1000px !important;

              &.special {
                height: 1130px !important;
              }
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
          {/* <Swiper direction="vertical" slidesPerView={3} spaceBetween={0}>
          <SwiperSlide style={{height: '1000px !important'}}>{({ isActive }) =>  */}
          <ChampionWelcome
            title="Heart of the Oasis"
            description={`With the power of the Arkenverse Cube in your hands, you are tasked with saving Haerra from inevitable destruction. Immerse yourself in Arken's groundbreaking fantasy RPG as you customize your unique character and class, craft unique NFTs, and rise against the forces which seek to overwhelm Haerra. In Heart of the Oasis, every choice you make has consequences. Do you have what it takes to save your world, or will you fall to ruin at the feet of the gods?`}>
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
          {/* </SwiperSlide>
          <SwiperSlide className="special"> */}

          <div
            css={css`
              .swiper {
                width: 100%;
                height: 100%;
              }

              .swiper-slide {
                text-align: center;
                font-size: 18px;
                background: #fff;

                /* Center slide text vertically */
                display: -webkit-box;
                display: -ms-flexbox;
                display: -webkit-flex;
                display: flex;
                -webkit-box-pack: center;
                -ms-flex-pack: center;
                -webkit-justify-content: center;
                justify-content: center;
                -webkit-box-align: center;
                -ms-flex-align: center;
                -webkit-align-items: center;
                align-items: center;
              }

              .swiper-slide img {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: cover;
              }

              .swiper {
                width: 100%;
                height: 300px;
                margin-left: auto;
                margin-right: auto;
              }

              .swiper-slide {
                background-size: cover;
                background-position: center;
              }

              .mySwiper2 {
                height: 80%;
                width: 100%;
              }

              .mySwiper {
                height: 20%;
                box-sizing: border-box;
                padding: 10px 0;
              }

              .mySwiper .swiper-slide {
                width: 25%;
                height: 100%;
                opacity: 0.7;
              }

              .mySwiper .swiper-slide-thumb-active {
                opacity: 1;
              }

              .swiper-slide img {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            `}>
            <Swiper
              // style={{
              //   "--swiper-navigation-color": "#fff",
              // }}
              loop
              spaceBetween={10}
              navigation
              centeredSlides
              speed={800}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs, Autoplay]}
              className="mySwiper2">
              <SwiperSlide>
                <img src="/images/previews/sanc1.png" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/previews/sanc2.png" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/previews/sanc3.png" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/previews/sanc4.png" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/previews/sanc5.png" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/previews/sanc6.png" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/previews/sanc7.png" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/previews/sanc8.png" />
              </SwiperSlide>
            </Swiper>
            <Swiper
              onSwiper={setThumbsSwiper}
              loop
              spaceBetween={10}
              slidesPerView={8}
              freeMode
              watchSlidesProgress
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper">
              <SwiperSlide>
                <img src="/images/previews/sanc1.png" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/previews/sanc2.png" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/previews/sanc3.png" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/previews/sanc4.png" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/previews/sanc5.png" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/previews/sanc6.png" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/previews/sanc7.png" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/previews/sanc8.png" />
              </SwiperSlide>
            </Swiper>
          </div>
          {/* 
          </SwiperSlide>
          <SwiperSlide> */}

          {/* </SwiperSlide>
          <SwiperSlide>{({ isActive }) => <Champion isActive={isActive} />}</SwiperSlide> */}
          {/* <SwiperSlide>{({ isActive }) => <ChampionTrailer isActive={isActive}>
            </ChampionTrailer>}</SwiperSlide> */}
          {/* <SwiperSlide>
                  {({ isActive }) => <ChampionCredit isActive={isActive}/>}
              </SwiperSlide> */}
          {/* </Swiper> */}
          {championsData.map((item, index) => (
            <ChampionDetail key={index} item={item} id={index} />
          ))}
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        {isHighRes ? (
          <Promo1
            onClick={() => {
              navigate('/cube');
            }}>
            <Heading
              as="h2"
              size="lg"
              mb="8px"
              style={{ textAlign: 'center', filter: 'drop-shadow(2px 4px 6px black)', lineHeight: '1.6rem' }}>
              {t(`Founder's Cube`)}
            </Heading>
            <Heading
              as="h2"
              size="md"
              mb="8px"
              style={{ textAlign: 'center', filter: 'drop-shadow(2px 4px 6px black)', lineHeight: '1.6rem' }}>
              {t(`Available Now`)}
            </Heading>
            <Video loop autoPlay muted>
              <source src={videoUrl} type="video/mp4" />
            </Video>
          </Promo1>
        ) : null}
      </div>

      <div
        className="relative overlay2"
        css={css`
          background: url(https://dl.airtable.com/.attachments/0e35d0691260802db540df17368f2e2b/6e5358d5/azoragfinal.jpg?ts=1661148512&userId=usrf0GZYc5zCl9Cv7&cs=44f3a1f92b29298f)
            no-repeat 0 0;
          background-size: cover;
        `}>
        <Page>
          {/* <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <LogoImg src="/images/rune-500x500.png" style={{ maxWidth: 200 }} />
          <Heading
            as="h1"
            size="xxl"
            mt="20px"
            mb="20px"
            style={{ textAlign: 'center', filter: 'drop-shadow(2px 4px 6px black)' }}
          >
            {t('Heart of the Oasis')}
          </Heading>
          <Img src="/images/chars.png" />
          <br />
          <br />
          <Button
            as={RouterLink}
            to="/account"
            style={{ zoom: 1.5, padding: '6px 20px', textAlign: 'center' }}
            onClick={() => {
              window.scrollTo(0, 0)
            }}
          >
            {t('Digital Pre-Purchase')}
          </Button>
          <br />
          <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
            <Button
              as={RouterLink}
              to="/cube"
              style={{ zoom: 1, padding: '6px 20px', textAlign: 'center', background: '#222' }}
              onClick={() => {
                window.scrollTo(0, 0)
              }}
            >
              {t("Founder's Edition")}
            </Button>
          </Flex>
        </Flex>
        <br />
        <br /> */}
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

          <div
            css={css`
              position: relative;
              height: 700px !important;
              width: 100%;
              max-height: 700px;
              overflow: hidden;
              border-width: 10px;
              border-style: solid;
              border-color: transparent;
              border-image: url(/images/frame.png) 80 / 80px / 0 repeat;
              margin-bottom: 30px;
            `}>
            <Lore />
          </div>

          <Card3 style={{ zIndex: 2 }}>
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
                              Runic Raids:
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
                {t('A World of Magic and Might')}
              </BoxHeading>
              <hr />
              <br />
              <p>
                Arken aspires to build some of the best RPGs in history. Runes are small stones inscribed with magical
                glyphs. Runes will be distributed to players over time. Runes can be collected in play to earn games,
                competing with other players, raiding, purchasing through the market, airdrops, boss battles, and other
                mechanics. Each rune builds on the last, expanding the universe with new storylines, games, and unique
                collectibles that make your heroes stronger.
              </p>
              {/* <p>
              {t(
                `Arken is the next evolution of DeFi farming. Farming is when you use your tokens to earn bonus tokens by staking them. Every week a new token is created (called a rune). It's farmed until the max supply of 50,000. That rune can then be combined with other runes to create NFTs. Those NFTs can be used to improve your earnings.`,
              )}
            </p> */}
              {/* {isMobile ? (
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
              ) : null} */}
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
                  src="/images/character-classes/sorceress.png"
                  alt="Your Blockchain Hero"
                  style={{ float: 'left', width: '280px', marginTop: '-20px' }}></img>
              ) : null}
              <BoxHeading as="h2" size="xl">
                {t('Your Blockchain Hero')}
              </BoxHeading>
              <hr />
              <br />
              <p>
                Battling angels and demons requires a hero. Choose a hero from one of seven classes: Assassin, Warrior,
                Druid, Necromancer, Ranger, Mage, Paladin.
              </p>
              <br />
              <p>
                We have incorporated blockchain gaming so your hero is a unique NFT, and you control their destiny. Take
                your hero into different games, join a guild with friends, and choose a gaming strategy that is unique
                to you and your hero.
              </p>
              {/* <p>
              {t(
                `You can start building your character right away. Choose from 1 of 7 classes, join a guild, and raid farms to start earning runes instantly.`,
              )}
            </p> */}
              {isMobile ? (
                <img
                  src="/images/character-classes/sorceress.png"
                  alt="Your Blockchain Hero"
                  style={{ width: '240px' }}></img>
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
            <BigCard>
              {!isMobile ? (
                <ItemContainer style={{ float: 'right', marginLeft: 20, width: '450px' }}>
                  <ItemCard>
                    <RecipeInfo
                      item={itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Burial')}
                      showCraftButton
                      showMarketButton
                    />
                    <br />
                  </ItemCard>
                </ItemContainer>
              ) : null}
              <BoxHeading as="h2" size="xl">
                {t('Evolving NFTs')}
              </BoxHeading>
              <hr />
              <p>
                Imagine a digital world where your NFTs adapt to the game you're playing. Equip your hero with unique
                Runeforms with varying attributes to make them more powerful in battle, increase magic find, or improve
                farming and merchant abilities.
              </p>
              <br />
              <p>
                We're expanding the Arken Realms with new games, storylines and lore, through the distribution of runes
                and Runeforms. Runic Raids was the first Rune game, and the first NFT hyperfarm in blockchain. Evolution
                Isles is the second Rune game, and one of the first to be NFT integrated, with more to follow!
              </p>

              {/* <p>
              {t(
                `Imagine a virtual world like Ready Player One, where your NFTs adapt to the game you're playing? We're building the market first, by distributing NFTs in Rune farms, that can later be used in Arken games.`,
              )}
            </p> */}
              {isMobile ? (
                <ItemContainer style={{ width: '100%', margin: '30px auto 0' }}>
                  <ItemCard>
                    <RecipeInfo
                      item={itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Burial')}
                      showCraftButton
                      showMarketButton
                    />
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
                  <br />
                  <br />
                  <br />
                </>
              ) : null}
            </BigCard>
            <br />
            <br />
            <br />
            <BigCard align="left">
              {!isMobile ? (
                <div style={{ width: '275px', float: 'left', marginRight: '10px' }}>
                  <Image src="/images/cube-preview.png" />
                </div>
              ) : null}
              <BoxHeading as="h2" size="xl">
                {t('Unique Crafted Items')}
              </BoxHeading>
              <hr />
              <br />
              <p>
                Runes are needed to craft <strong>Runeforms</strong> (NFTs), unique and powerful weapons and armor
                suitable for a specific hero or style of play.{' '}
              </p>
              <br />
              <p>
                To mint or craft a Runeform in the Crafting Cube you need to know the specific combination of runes,
                called a recipe. Some recipes are <RouterLink to="/craft">known</RouterLink>, some are secret. Once you
                know the recipe of a Runeform you need to burn at least one of each rune in the recipe to craft the NFT.
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
                </>
              ) : null}
              <Mechanics />
            </BigCard>
          </Card3>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          {/* <br />
        <br />
        <br />
        <hr />

        <br />
        <br />
        <br />
        <BottomCTA /> */}
        </Page>
      </div>
      <br />
    </>
  );
};

export default Home;
