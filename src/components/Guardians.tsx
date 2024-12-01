import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import BottomCTA from '~/components/BottomCTA';
import ChampionWelcome from '~/components/ChampionWelcome';
import Page from '~/components/layout/Page';
import { useModal } from '~/components/Modal';
import { PurchaseModal } from '~/components/PurchaseModal';
import useCache from '~/hooks/useCache';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import useWeb3 from '~/hooks/useWeb3';
import { Button, Card, Flex, Heading } from '~/ui';
// import initReactFastclick from "react-fastclick";
import { safeRuneList } from '~/config';

// Import Swiper styles
//import '~swiper/swiper.min.css'
//import '~swiper/modules/free-mode/free-mode.min.css'
//import '~swiper/modules/navigation/navigation.min.css'
//import '~swiper/modules/thumbs/thumbs.min.css'

const BoxHeading = styled(Heading)`
  margin-bottom: 16px;
`;

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

const Home: React.FC<any> = () => {
  const cache = useCache();
  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />);
  const [pageLoaded, setPageLoaded] = useState(false);
  const { account, library } = useWeb3();
  const { t } = useTranslation();

  const [itemSelected, _setItemSelected] = useState(null);
  const onItemSelected = (value, item) => {
    if (itemSelected && itemSelected.id === item.id) return;
    _setItemSelected(item);
  };

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
            title="Guardians Unleashed"
            description={`Hatch unique pets, unlock special abilities, and raise your perfect Guardian in the newest digital pet NFT game from Rune. Grow and evolve your pets as you fight alongside them in Arken's expanding metaverse: from the Infinite Arena PvP brawler to the vast RPG of Sanctuary. With over 50 unique pet designs and nearly a trillion combinations: breed an epic companion that’s unique to you! Earn new and exclusive recipes, rewards, and abilities as you progress in this constantly evolving game, seamlessly integrated into Arken's flourishing ecosystem.`}>
            <div>
              {account && holders.find((p) => p.address.toLowerCase() === account.toLowerCase()) ? (
                <Button as={RouterLink} scale="md" to="/download/guardians" style={{ zoom: 1.5 }}>
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
        </div>
      </div>

      <Page>
        {/* <Flex flexDirection="column" alignItems="center" justifyContent="center"> */}
        {/* <LogoImg src="/images/rune-500x500.png" style={{ maxWidth: 200 }} />
          <Heading
            as="h1"
            size="xxl"
            mt="20px"
            mb="20px"
            style={{ textAlign: 'center', filter: 'drop-shadow(2px 4px 6px black)' }}
          >
            {t('Guardians Unleashed')}
          </Heading> */}
        {/* <Img src="/images/chars.png" /> */}
        {/* <br />
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
          <br />
          <Button variant="text" onClick={onPresentPurchaseModal}>
            {t('Purchase Runes')}
          </Button> */}
        {/* </Flex>
        <br />
        <br /> */}
        <Card style={{ zIndex: 2 }}>
          <BigCard align="left">
            {/* {!isMobile ? (
              <div style={{ float: 'right', width: '275px', marginRight: '10px' }}>
                <Image src="/images/cube-preview.png" />
              </div>
            ) : null} */}
            <BoxHeading as="h2" size="xl">
              {t('In Development')}
            </BoxHeading>
            <hr />
            <br />
            <p>Stay tuned for more information.</p>
          </BigCard>
        </Card>
        <br />
        <br />
        <br />
        <BottomCTA />
      </Page>
    </>
  );
};

export default Home;
