import queryString from 'query-string';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import BottomCTA from '~/components/BottomCTA';
import Page from '~/components/layout/Page';
import useWeb3 from '~/hooks/useWeb3';
import { BaseLayout, Card, Card2, CardBody, Card3, Flex, Heading } from '~/ui';

const Cards = styled(BaseLayout)`
  align-items: flex-start;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;
const VerticalCards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  width: calc(100% - 40px);
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 20px;
    & > div {
      max-width: 500px;
      margin: 0 auto;
    }
  }

  & > div {
    grid-column: span 12;
    width: 100%;
    background-image: url(/images/background.jpeg);
    background-size: 400px;
  }
`;
const VerticalCards2 = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  width: calc(100% - 40px);
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 20px;
    & > div {
      max-width: 600px;
      margin: 0 auto;
    }
  }

  & > div {
    grid-column: span 12;
    width: 100%;
    background-image: url(/images/background.jpeg);
    background-size: 400px;
  }
`;

const Video = styled.video`
  display: inline-block;
  width: 100%;
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
  // filter: sepia(1) saturate(5) hue-rotate(-25deg);
  // sepia(1) saturate(5) hue-rotate(-25deg) grayscale(1) drop-shadow(0px 0px 10px #000) invert(1)

  -webkit-animation: fire 0.4s infinite;

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

const MainCard = styled(Card)`
  position: relative;
  font-weight: bold;
  border-width: 15px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 80 repeat;
  border-image-width: 80px;
  background: none;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  background: #000;
  color: #bb955e;
  text-shadow: 1px 1px 1px black;
  font-weight: bold;
  text-align: left;
  padding: 30px;

  p {
    text-align: left;
  }
`;

const SpecialButton = styled.div<{ title: string }>`
  position: relative;
  height: 110px;
  width: 230px;
  border-width: 44px 132px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0);
  border-image-source: url(/images/special-button.png);
  border-image-slice: 110 330 fill;
  filter: drop-shadow(rgba(0, 0, 0, 0.6) 1px 1px 1px) drop-shadow(rgba(0, 0, 0, 0.6) 0px 0px 4px);
  cursor: url('/images/cursor3.png'), pointer;
  font-family: 'webfontexl', sans-serif !important;
  text-transform: uppercase;

  &:before {
    content: '${({ title }) => title}';
    position: absolute;
    top: 2px;
    white-space: nowrap;
    font-size: 24px;
    left: -60px;
    color: #d2c8ae;
  }

  filter: contrast(1.1);
  &:hover {
    filter: contrast(1.2) brightness(1.3);
  }
`;

const parseMatch = (location) => {
  const match = {
    params: queryString.parse(location?.search || ''),
  };

  for (const key in match.params) {
    if (match.params[key] === 'false') {
      // @ts-ignore
      match.params[key] = false;
    } else if (match.params[key] === 'true') {
      // @ts-ignore
      match.params[key] = true;
    }
  }

  return match;
};

const Promo1 = styled.div`
  text-align: right;
  width: 100%;
  padding: 30px 0 10px;
  border-radius: 7px;
  opacity: 1;
  margin-top: 10px;
`;

const Evolution: React.FC<any> = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const match = parseMatch(location);
  const { web3 } = useWeb3();

  const [videoUrl, setVideoUrl] = useState('/videos/cube.mp4');

  // useEffect(() => {
  //   // @ts-ignore
  //   setVideoUrl('/videos/cube.mp4')
  // }, [])
  return (
    <Page>
      <Card2 style={{ maxWidth: 600 }}>
        <Card>
          <CardBody>
            {/* <MainCard> */}
            <Promo1
              onClick={() => {
                navigate('/market');
              }}>
              <Heading
                as="h2"
                size="lg"
                mb="8px"
                style={{ textAlign: 'center', filter: 'drop-shadow(2px 4px 6px black)', lineHeight: '1.6rem' }}>
                Founder's Edition
              </Heading>
              {/* <Heading
            as="h2"
            size="md"
            mb="8px"
            style={{ textAlign: 'center', filter: 'drop-shadow(2px 4px 6px black)', lineHeight: '1.6rem' }}
          >
            Available Now
          </Heading> */}
              <Video
                loop
                autoPlay
                muted
                css={css`
                  mix-blend-mode: difference;
                `}>
                <source src={videoUrl} type="video/mp4" />
              </Video>
            </Promo1>
            <br />
            <br />
            <p>These will be redeemable for multiple benefits. Including:</p>
            <br />
            <p>
              - Heart of the Oasis: Founder's Edition (unreleased)
              <br />
              - Earliest Access to Arken games
              <br />
              - Access to Founder's Tavern in the End of Time
              <br />
              - Every Rune in Heart of the Oasis release (1 EX-ZENO)
              <br />
              - Golden Cube Skin
              <br />
              - Angel Skin + Wings
              <br />
              - Discord Badge + Private Channel
              <br />
              - Exclusive T-shirt
              <br />
            </p>
            <br />
            <br />
            <Flex flexDirection="row" alignItems="center" justifyContent="center">
              <HeadingFire fireStrength={1} color1="#fd3" color2="#ff3" color3="#f80" color4="#f20">
                <SpecialButton
                  title="Buy Now"
                  onClick={() => {
                    navigate('/market');
                  }}>
                  {/* <HeadingFire fireStrength={1} color1="#fd3" color2="#ff3" color3="#f80" color4="#f20">Sss</HeadingFire> */}
                </SpecialButton>
              </HeadingFire>
            </Flex>
            <br />
            <br />
            <p style={{ fontSize: '0.8rem' }}>
              <em>Certain benefits will only be unlocked when available.</em>
            </p>
            {/* </MainCard> */}
          </CardBody>
        </Card>
      </Card2>
      <br />
      <BottomCTA />
    </Page>
  );
};

export default Evolution;

// {/* <p>Loading {progression * 100} percent...</p> */}
