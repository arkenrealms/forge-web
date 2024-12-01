import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Page from '~/components/layout/Page';
import { useModal } from '~/components/Modal';
import { PurchaseModal } from '~/components/PurchaseModal';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import { BaseLayout, Card, Card3, Heading, Link } from '~/ui';

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

const Container = styled.div`
  width: 100%;
  clear: both;
  position: relative;
  // margin-top: 30px;
  // border-top: solid 2px rgba(133,133,133,0.1);
  // background-image: linear-gradient(
  //     180deg,transparent 0,rgba(0,0,0,0.42) 50%,transparent), url(/images/background.jpeg);
  //         box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  // background-image: url("/images/bg-brighter.jpg");
  //   background-position: 0px 0px;
  //   background-size: 400px;
  // margin-bottom: 100px;
}
`;

const Row = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin: 0;
  color: #fff;

  p {
  }

  & > div {
    grid-column: span 12;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 3;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 2;
    }
    & > div:first-child {
      grid-column: span 6;
    }
  }
  padding-bottom: 40px;
`;
const HightlightText = styled.span`
  color: #7576df;
`;

const StyledCard = styled(Card)`
  background: rgba(0, 0, 0, 0.8);
  z-index: 2;
`;
const Column = styled.div`
  padding: 20px;
`;

const Page2 = styled(Page)`
  min-height: auto;
`;

const Link2 = styled(Link)`
  color: #fff;
  font-size: 0.9rem;
  font-weight: normal;
`;

const BottomCTA = () => {
  const { t } = useTranslation();
  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />);
  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;

  return (
    <Container>
      {/* <div
      css={css`
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: -2;
        background-image: linear-gradient(-39deg, rgba(0, 0, 0, 0.35), transparent 31%, rgba(71, 71, 71, 0.46)),
          url('/images/bg-brighter.jpg');
        background-position: 0px 0px, 0px 0px;
        background-size: auto, 400px;
        pointer-events: none;
      `}
    ></div> */}
      <Card3>
        <Page2>
          <Row>
            <Column>
              {/* <Img
                src="/images/rune-text-logo.png"
                css={css`
                  width: 220px;
                `}
              /> */}
              <p style={{ marginTop: 20 }}>
                Arken Realms is an AI-driven omniverse. Battle, win &amp; claim glory. <br />
                Or chill, it's up to you.
              </p>
              {/* <p style={{ marginTop: 20 }}>
                Crypto's premiere fantasy omniverse driven by innovative solutions using non-fungible tokens
                (NFTs). Battle, win &amp; collect items.
              </p> */}
              <br />
              <br />
              <iframe
                src="https://discord.com/widget?id=857533189948964874&amp;theme=dark"
                width={isMobile ? '300' : '350'}
                height="350"
                frameBorder="0"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                className="discord-widget"
                title="Discord"></iframe>
              <Heading style={{ color: '#fff', marginTop: 40 }}>
                {t(`© ${new Date().getFullYear()} Arken Technologies, Inc.`)}
              </Heading>
            </Column>
            <Column style={{ minWidth: 200 }}>
              <Heading size="md">Contact</Heading>
              <br />
              <p>sup@arken.gg</p>
            </Column>
            <Column style={{ minWidth: 200 }}>
              <Heading>About</Heading>
              <br />
              <p>
                <RouterLink style={{ marginBottom: 20, display: 'inline-block' }} to="/games">
                  Our Games
                </RouterLink>
                <br />

                <RouterLink style={{ marginBottom: 20, display: 'inline-block' }} to="/guide">
                  Intro Guide
                </RouterLink>
                <br />

                <RouterLink style={{ marginBottom: 20, display: 'inline-block' }} to="/leaderboard">
                  Leaderboard
                </RouterLink>
                <br />

                <RouterLink style={{ marginBottom: 20, display: 'inline-block' }} to="/tokenomics">
                  Tokenomics
                </RouterLink>
              </p>
            </Column>
            <Column>
              <Heading>Social</Heading>
              <br />
              {/* <p>
                <a
                  style={{ marginBottom: 20, display: 'inline-block' }}
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`https://discord.arken.gg/`}>
                  Discord
                </a>

                <br />
                <a
                  style={{ marginBottom: 20, display: 'inline-block' }}
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`https://t.me/Arken_Realms`}>
                  Telegram
                </a>

                <br />
                <a
                  style={{ marginBottom: 20, display: 'inline-block' }}
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`https://twitter.com/ArkenRealms`}>
                  Twitter
                </a>

                <br />
                <a
                  style={{ marginBottom: 20, display: 'inline-block' }}
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`https://facebook.com/ArkenRealms`}>
                  Facebook
                </a>

                <br />
                <a
                  style={{ marginBottom: 20, display: 'inline-block' }}
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`https://ArkenRealms.medium.com/`}>
                  Medium
                </a>

                <br />
                <a
                  style={{ marginBottom: 20, display: 'inline-block' }}
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`https://www.youtube.com/ArkenRealms`}>
                  YouTube
                </a>

                <br />
                <a
                  style={{ marginBottom: 20, display: 'inline-block' }}
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`https://twitch.arken.gg`}>
                  Twitch
                </a>

                <br />
                <a
                  style={{ marginBottom: 20, display: 'inline-block' }}
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`https://www.reddit.com/r/ArkenRealms`}>
                  Reddit
                </a>

                <br />
                <a
                  style={{ marginBottom: 20, display: 'inline-block' }}
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`https://www.linkedin.com/company/rune-games/people/?viewAsMember=true`}>
                  LinkedIn
                </a>

                <br />
                <a
                  style={{ marginBottom: 20, display: 'inline-block' }}
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`https://github.arken.gg`}>
                  Github
                </a>
              </p> */}
            </Column>
          </Row>
        </Page2>
      </Card3>
    </Container>
  );
};

export default BottomCTA;
