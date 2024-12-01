import React, { useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Page from '~/components/layout/Page';
import FarmStakingCard from '~/components/raid/FarmStakingCard';
import useWeb3 from '~/hooks/useWeb3';
import { BaseLayout, Button, Flex, Heading } from '~/ui';
import { useTranslation } from 'react-i18next';
import { bg3, trailerImg } from '~/assets/data/images';

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

import ChampionHome from '~/components/ChampionHome';
import ChampionWelcome from '~/components/ChampionWelcome';
import { ProfileInfo } from '~/components/ProfileInfo';
import EarnAPYCard from '~/components/raid/EarnAPYCard';
import RuneStats from '~/components/raid/RuneStats';

const Trailer = (props) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const height = (iframeRef.current.offsetWidth * 9) / 16 + 'px';
    iframeRef.current.setAttribute('height', height);
  }, []);

  return (
    <ChampionHome
      className={`trailer ${props.isActive ? 'active' : ''}`}
      contentClassName="overlay trailer__content"
      bgImage={bg3}
      containerCss={css`
        height: 1000px;

        .trailer__content__wrapper {
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .trailer__content__img,
        .trailer__content__info {
          position: relative;
          width: 50%;
          height: 100%;
          transition:
            transform 0.5s ease,
            opacity 0.5s ease;
          opacity: 0;
          transition-delay: 0s;
        }

        .trailer__content__img {
          transform: translateX(-200px) scale(1.3);
          padding-top: 6.5rem;

          img {
          }
        }

        .trailer__content__info {
          transform: translateX(200px);

          .video {
            margin-top: 3rem;
            width: 90%;
          }
        }

        .trailer__content__img {
          transform: translateX(0) scale(1.3);
          opacity: 1;
          transition-delay: 1s;
        }

        .trailer__content__info {
          transform: translateX(0);
          opacity: 1;
          transition-delay: 1s;
        }
      `}>
      <div className="trailer__content__wrapper">
        <div className="trailer__content__img">
          <img src={trailerImg} alt="" />
        </div>
        <div className="trailer__content__info">
          <div className="title">
            <span>Learn from the</span>
            <h2 className="main-color">community</h2>
          </div>
          <div className="video">
            <iframe
              ref={iframeRef}
              width="100%"
              title="trailer"
              src="https://www.youtube.com/embed/K3oZXgCoRSN"
              css={css`
                border-width: 9px;
                border-style: solid;
                border-color: transparent;
                border-image: url(/images/frame.png) 80 / 80px / 0 repeat;
              `}></iframe>
          </div>
        </div>
      </div>
      {props.children}
    </ChampionHome>
  );
};

const VerticalCards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  align-content: start;

  & > div {
    grid-column: span 12;
    width: 100%;
  }
`;

const HeadingFire = styled.div<{
  fireStrength: number;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
}>`
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
  // -webkit-text-fill-color: transparent;
  color: #000;
  text-transform: uppercase;
  line-height: 1rem;
  font-family: 'webfontexl', 'Palatino Linotype', 'Times', serif;
  font-size: 90px;
  font-weight: bold;
  margin-top: 5px;
  // filter: sepia(1) saturate(5) hue-rotate(-25deg);
  // sepia(1) saturate(5) hue-rotate(-25deg) grayscale(1) drop-shadow(0px 0px 10px #000) invert(1)

  -webkit-animation: fire 0.9s infinite;

  @keyframes fire {
    0% {
      text-shadow:
        0 0 2px ${(props) => props.color1},
        0 ${(props) => props.fireStrength * -5}px ${(props) => props.fireStrength * 4}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 2}px ${(props) => props.fireStrength * -10}px
          ${(props) => props.fireStrength * 6}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -15}px
          ${(props) => props.fireStrength * 11}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
          ${(props) => props.fireStrength * 18}px ${(props) => props.color4};
    }
    25% {
      text-shadow:
        0 0 3px ${(props) => props.color1},
        ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -6}px
          ${(props) => props.fireStrength * 5}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -11}px
          ${(props) => props.fireStrength * 7}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -16}px
          ${(props) => props.fireStrength * 13}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -0}px ${(props) => props.fireStrength * -26}px
          ${(props) => props.fireStrength * 20}px ${(props) => props.color4};
    }
    50% {
      text-shadow:
        0 0 3px ${(props) => props.color1},
        ${(props) => props.fireStrength * -1}px ${(props) => props.fireStrength * -4}px
          ${(props) => props.fireStrength * 6}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 0}px ${(props) => props.fireStrength * -12}px
          ${(props) => props.fireStrength * 6}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -3}px ${(props) => props.fireStrength * -16}px
          ${(props) => props.fireStrength * 15}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -1}px ${(props) => props.fireStrength * -28}px
          ${(props) => props.fireStrength * 22}px ${(props) => props.color4};
    }
    75% {
      text-shadow:
        0 0 2px ${(props) => props.color1},
        ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -7}px
          ${(props) => props.fireStrength * 4}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -11}px
          ${(props) => props.fireStrength * 8}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -1}px ${(props) => props.fireStrength * -14}px
          ${(props) => props.fireStrength * 12}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
          ${(props) => props.fireStrength * 21}px ${(props) => props.color4};
    }
    100% {
      text-shadow:
        0 0 2px ${(props) => props.color1},
        0 ${(props) => props.fireStrength * -5}px ${(props) => props.fireStrength * 4}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 2}px ${(props) => props.fireStrength * -10}px
          ${(props) => props.fireStrength * 6}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -15}px
          ${(props) => props.fireStrength * 11}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
          ${(props) => props.fireStrength * 18}px ${(props) => props.color4};
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

const CTACards = styled(BaseLayout)`
  align-items: start;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
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

const Frame = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const FrameWrapper = styled(RouterLink)`
  position: relative;
  width: 100%;
  height: 75px;
  display: block;
  grid-column: span 12;
  &:hover {
    cursor: url('/images/cursor3.png'), pointer;
  }
  overflow: hidden;
`;
const FrameOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  border-width: 5px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 5 repeat;
  border-image-width: 5px;
  background-color: rgba(0, 0, 0, 0);
`;

const LogoImg = styled.img`
  max-width: 200px;
`;

const BoxHeading = styled(Heading)`
  text-align: center;
  margin-bottom: 16px;
`;

const Img = styled.img`
  filter: contrast(1.1) drop-shadow(2px 4px 6px black);
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
  }
`;

const Raid: React.FC<any> = () => {
  const { t } = useTranslation();
  const { account, library } = useWeb3();

  const holders = [];
  return (
    <>
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
          <ChampionWelcome
            title="Runic Raids"
            description={`Runic Raids is the first game with onchain NFT item mechanics. Use runes to craft gear (NFTs) to make your character more powerful. `}>
            <div>
              {account && holders.find((p) => p.address.toLowerCase() === account.toLowerCase()) ? (
                <Button as={RouterLink} scale="md" to="/download/raid" style={{ zoom: 1.5 }}>
                  {t('Download for Windows')}
                </Button>
              ) : (
                <>
                  <Button
                    as={RouterLink}
                    to="/account"
                    style={{ zoom: 1.5, padding: '6px 20px', textAlign: 'center' }}
                    onClick={() => {
                      window.scrollTo(0, 0);
                    }}>
                    Create Account
                  </Button>
                  <br />
                  <br />
                  <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                    <Button
                      as={RouterLink}
                      to="/cube"
                      style={{ zoom: 1, padding: '6px 20px', textAlign: 'center', background: '#222' }}
                      onClick={() => {
                        window.scrollTo(0, 0);
                      }}>
                      Founder's Edition
                    </Button>
                  </Flex>
                </>
              )}
            </div>
          </ChampionWelcome>
          <Trailer />
        </div>
      </div>

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
          {t('Runic Raids')}
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
          {t('Tutorial')}
        </BoxHeading>
        <br />
        <iframe
          src="https://www.youtube.com/embed/K3oZXgCoRSM"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: '100%', height: '100%', top: 0, left: 0, position: 'absolute' }}
        ></iframe>
      </Flex> */}

        {/* <CardBanner id="banner1">
        <a
          href="https://t.me/Arken_Realms/354"
          rel="noreferrer noopener"
          target="_blank"
          style={{ display: 'block', width: '100%', height: '100%', opacity: 0 }}
        >
          x
        </a>
      </CardBanner>
      <br /> */}
        <Cards>
          <VerticalCards>
            {/* <FrameWrapper to="/evolution">
            <FrameOverlay />
            <Frame title="Ad1" src="/ads/1/mobile/" />
          </FrameWrapper> */}
            <EarnAPYCard />
            <FarmStakingCard />
            {/* <EvolutionStatus />
          <InfiniteStatus />
          <GuardiansStatus />
          <SanctuaryStatus /> */}
          </VerticalCards>
          <VerticalCards>
            <ProfileInfo />
            {/* <Card>
            <CardBody>
              <TotalValueLockedCard />
            </CardBody>
          </Card> */}
            <RuneStats />
          </VerticalCards>
        </Cards>
      </Page>
    </>
  );
};

export default Raid;
