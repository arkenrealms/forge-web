import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { Button, Heading, Text, LogoIcon, Flex } from '~/ui';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Counter } from 'react95';
import { Link as RouterLink } from 'react-router-dom';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import useSettings from '~/hooks/useSettings2';
import Paragraph from '~/components/Paragraph';
import Linker from '~/components/Linker';
import { normalizeItem, decodeItem } from 'rune-backend-sdk/build/util/item-decoder';
import { ItemType, itemData } from 'rune-backend-sdk/build/data/items';
import { ItemsMainCategoriesType } from 'rune-backend-sdk/build/data/items.type';

const isLocal = process.env.REACT_APP_RUNE_ENV === 'local';

const List = styled.div`
  width: 100%;
  margin-bottom: 30px;
  padding: 25px 15px 0;
  // zoom: 0.9;
  color: #bb955e;
`;

const ListItem = styled.div`
  width: 100%;
  line-height: 2.3rem;
  align-items: stretch;
  justify-content: stretch;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 32px;
`;

const ListItemLeft = styled.div`
  grid-column: span 1;
  width: 30px;
  font-family: 'webfontexl', sans-serif !important;
  text-transform: uppercase;
`;

const ListItemCenter = styled.div`
  grid-column: span 7;
  width: 100%;
  a {
    font-family: 'webfontexl', sans-serif !important;
    text-transform: uppercase;
    color: #ddd;
  }
`;

const ListItemRight = styled.div`
  grid-column: span 1;
  text-align: right;
  text-transform: uppercase;
  font-family: 'webfontexl', sans-serif !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: none;

  @media only screen and (min-width: 480px) {
    grid-column: span 3;
    display: block;
    width: 180px;
  }
`;

const MainHeading = styled.div`
  font-size: 2.5rem;
  line-height: 3.5rem;
`;

const SubHeading = styled.div`
  width: 100%;
  font-size: 2rem;
  line-height: 2rem;
  text-align: center;
  text-decoration: underline;
`;

const HeadingFire = styled.h1<{
  fireStrength: number;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
}>`
  color: rgba(0, 0, 0, 0.9);
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
      text-shadow: 0 0 2px ${(props) => props.color1},
        0 ${(props) => props.fireStrength * -5}px ${(props) => props.fireStrength * 4}px ${(props) => props.color2},
        ${(props) => props.fireStrength * 2}px ${(props) => props.fireStrength * -10}px
          ${(props) => props.fireStrength * 6}px ${(props) => props.color1},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -15}px
          ${(props) => props.fireStrength * 11}px ${(props) => props.color3},
        ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
          ${(props) => props.fireStrength * 18}px ${(props) => props.color4};
    }
    25% {
      text-shadow: 0 0 3px ${(props) => props.color1},
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
      text-shadow: 0 0 3px ${(props) => props.color1},
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
      text-shadow: 0 0 2px ${(props) => props.color1},
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
      text-shadow: 0 0 2px ${(props) => props.color1},
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

const endpoints = {
  // cache: 'https://envoy.arken.gg',
  // coordinator: 'https://coordinator.arken.gg',
  cache: isLocal ? 'http://localhost:6001' : 'https://envoy.arken.gg',
  coordinator: isLocal ? 'http://localhost:5001' : 'https://coordinator.arken.gg',
};

const aaa = styled.div``;

const BoxHeading = styled(Heading)`
  margin-bottom: 16px;
`;

function pad(n, width = 2, z = '0') {
  n += '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const cubeItem = normalizeItem(itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === "Founder's Cube"));
const Skills = () => {
  const { t } = useTranslation();
  const settings = useSettings();
  const [leaderboard, setLeaderboard] = useState([]);
  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;

  const seasonHasStarted = true;

  useEffect(() => {
    if (!window) return;

    const currentSeason = 6;

    async function init() {
      const coeff = 1000 * 60 * 5;
      const date = new Date(); //or use any other date
      const rand = new Date(Math.round(date.getTime() / coeff) * coeff).getTime();

      try {
        // const rand2 = Math.floor(Math.random() * Math.floor(999999))
        const response2 = await fetch(
          `https://envoy.arken.gg/evolution/global/season${currentSeason}/leaderboard.json?${rand}`
        );
        const leaderboardData = await response2.json();

        setLeaderboard(leaderboardData.monetary);
      } catch (e) {
        console.log(e);
      }
    }

    init();

    const inter = setInterval(init, 1 * 60 * 1000);

    return () => {
      clearInterval(inter);
    };
  }, []);

  const [endCount, setEndCount] = useState({
    days: '0',
    hours: '0',
    minutes: '0',
    seconds: '0',
  });

  useEffect(() => {
    function removeTimezoneOffset(date) {
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      if (userTimezoneOffset >= 0) {
        return new Date(date.getTime() - userTimezoneOffset);
      }
      return new Date(date.getTime() + userTimezoneOffset);
    }

    const endTimer = setInterval(() => {
      try {
        const remainingSeconds =
          removeTimezoneOffset(new Date('4/30/2023 22:00:00+00:00')).getTime() / 1000 -
          removeTimezoneOffset(new Date()).getTime() / 1000;

        // if (remainingSeconds < 0) {
        //   remainingSeconds =
        //     removeTimezoneOffset(new Date('10/30/2022 22:00:00+00:00')).getTime() / 1000 -
        //     removeTimezoneOffset(new Date()).getTime() / 1000
        // }

        if (remainingSeconds < 0) {
          setEndCount({
            days: pad(0),
            hours: pad(0),
            minutes: pad(0),
            seconds: pad(0),
          });
          return;
        }

        const days = Math.floor(remainingSeconds / 24 / 60 / 60);
        const hoursLeft = Math.floor(remainingSeconds - days * 86400);
        const hours = Math.floor(hoursLeft / 3600);
        const minutesLeft = Math.floor(hoursLeft - hours * 3600);
        const minutes = Math.floor(minutesLeft / 60);
        const seconds = Math.floor(remainingSeconds % 60);

        if (Number.isNaN(days) || Number.isNaN(days) || Number.isNaN(days) || Number.isNaN(days)) {
          setEndCount({
            days: pad(0),
            hours: pad(0),
            minutes: pad(0),
            seconds: pad(0),
          });
          return;
        }

        setEndCount({
          days: pad(days),
          hours: pad(hours),
          minutes: pad(minutes),
          seconds: pad(seconds),
        });
      } catch (e) {
        console.log('Season ranking countdown issue');
      }
    }, 500);

    return () => {
      clearInterval(endTimer);
    };
  });

  return (
    <>
      <Flex
        flexDirection={isMobile ? 'column' : 'row'}
        alignItems="flex-start"
        justifyContent="center"
        style={{ width: '100%' }}>
        <div
          css={css`
            color: #ddd;
            margin-right: 30px;
          `}>
          <BoxHeading as="h2" size="xl">
            {t('Seasonal Ladder')}
          </BoxHeading>
          <hr />
          <br />
          <Paragraph>
            Join us for <strong>Season 1 (2023)</strong>
            <br />
            <br />
            <strong>Starts:</strong> February 26, 2023
            <br />
            <strong>Ends:</strong> April 30, 2023
            {/* <br />
            <br />
            <strong>Prize:</strong> 1st place and 5th place win. */}
            {/* {' '}
            <RouterLink
              to="/cube"
              // style={{ zoom: 1, padding: '6px 20px', textAlign: 'center', background: '#222' }}
              // onClick={() => {
              //   window.scrollTo(0, 0)
              // }}
              css={css`
                position: relative;
                display: inline-block;
                text-decoration: none;
                border: 0 none !important;
                margin-left: 5px;
                margin-right: 5px;

                & > div {
                  position: relative;
                  width: auto;
                  height: auto;
                  // border: 1px solid #fff;
                  background: rgb(73 74 128 / 10%);
                  border-radius: 5px;
                  // border-size: 1px;
                  padding: 0 8px 8px;

                  &:hover {
                    background: rgb(73 74 128 / 20%);
                  }
                }

                & > div > div:first-child {
                  display: inline;
                  margin-right: 5px;
                }

                & > div > div:first-child > div:first-child {
                  display: inline-block;
                  position: relative;
                  top: 10px;
                  left: 0;
                  width: 30px;
                  height: 30px;
                }
              `}
            >
              <Item
                itemIndex="seasonCube"
                item={cubeItem}
                isDisabled={false}
                showDropdown
                showQuantity={false}
                showActions={false}
                hideMetadata
              >
                <span style={{ borderBottom: '1px solid transparent' }}>Founder's Cube</span>
              </Item>
            </RouterLink> */}
            {/* <br />
            Rewarding #1 and #5 the best items adds an interesting dynamic. Will you grind for #1 or gamble for #5 until
            the end? This gives more players a chance until the end. Top 10 will be rewarded with random items. */}
            <br />
            <br />
            <strong>Specifics:</strong>
            <br />
            {settings.isCrypto ? (
              <Linker id="evo-season-1">
                Every round you are a top 10 winner, you earn ZOD rune rewards. The winners of the season will be
                players who have won the most ZOD rewards. One ZOD = 1000 points. It doesn't matter if you've
                claimed/used them.
              </Linker>
            ) : (
              <Linker id="evo-season-1b">
                Every round you are a top 10 winner, you win gold. The winners of the season will be players who have
                won the most gold. 1G = 1000 points. It doesn't matter if you've used your gold in the shop.
              </Linker>
            )}
            <br />
            <br />
            <strong>Tips:</strong>
            <br />
            It's to your advantage to play when more players are online, since rewards are increased. Make sure you have
            competitive gear equipped. Ask the community for help if you're new.
            <br />
            <br />
            <RouterLink to="/support">Join Telegram</RouterLink> to ask us any other questions!
          </Paragraph>
        </div>
        <div
          css={
            isMobile
              ? css``
              : css`
                  padding-left: 30px;
                  border-left: 1px solid #907c61;
                `
          }>
          <BoxHeading as="h2" size="xl">
            {t('Ranking')}
          </BoxHeading>
          <hr />
          {seasonHasStarted ? (
            leaderboard.slice(0, 1).map(({ name, count, data }) => {
              let rank = 1;
              let prevItem = null;
              return (
                <div key={name}>
                  <List>
                    {data
                      .filter((item) => !['Testman', 'Botter'].includes(item.name))
                      .map((item, index) => {
                        if (rank >= 10) return null;
                        if (prevItem && item.count !== prevItem.count) rank++;
                        prevItem = item;
                        return (
                          <ListItem key={index}>
                            <ListItemLeft>{rank}</ListItemLeft>
                            <ListItemCenter>
                              <RouterLink to={`/user/${item.name}`}>
                                {typeof item.name !== 'object' ? item.name : 'zzz'}
                              </RouterLink>
                            </ListItemCenter>
                            <ListItemRight>{Math.round(item.count * 1000).toFixed(0)} Points</ListItemRight>
                          </ListItem>
                        );
                      })}
                  </List>
                </div>
              );
            })
          ) : (
            <>Season hasn't started yet.</>
          )}
          <br />
          <div
            css={css`
              text-align: center;
            `}>
            <h1 style={{ fontSize: '1em' }}>Season Finale</h1>
            {/* <HeadingFire
              fireStrength={0.5}
              color1="#fd3"
              color2="#ff3"
              color3="#f80"
              color4="#f20"
            >
              Season Finale
            </HeadingFire> */}
            <Counters>
              <CounterBlock>
                <p>DAYS</p>
                <Counter
                  value={endCount.days}
                  minLength={1}
                  size="md"
                  className="counter"
                  style={{
                    border: 0,
                  }}
                />
              </CounterBlock>
              <CounterBlock>
                <p>HOURS</p>
                <Counter
                  value={endCount.hours}
                  minLength={2}
                  size="md"
                  className="counter"
                  style={{
                    border: 0,
                  }}
                />
              </CounterBlock>
              <CounterBlock>
                <p>MINS</p>
                <Counter
                  value={endCount.minutes}
                  minLength={2}
                  size="md"
                  className="counter"
                  style={{
                    border: 0,
                  }}
                />
              </CounterBlock>
              <CounterBlock>
                <p>SECS</p>
                <Counter
                  value={endCount.seconds}
                  minLength={2}
                  size="md"
                  className="counter"
                  style={{
                    border: 0,
                  }}
                />
              </CounterBlock>
            </Counters>
          </div>
          <br />
          <br />
          <em style={{ fontSize: '0.9rem' }}>
            <strong>Note:</strong> The scores above will be reset during Rune Royale stream.
          </em>
        </div>
      </Flex>
      <GlobalStyles />
    </>
  );
};

const Counters = styled.div`
  zoom: 0.8;
`;

const GlobalStyles = createGlobalStyle`
.counter span {
  --react95-digit-bg-color: #000;
  --react95-digit-primary-color: #eee;
  --react95-digit-secondary-color: #000;
}
`;

const CounterBlock = styled.div`
  min-width: 90px;
  text-align: center;
  display: inline-block;
  align-self: center;
  .counter {
    text-align: left;
    background-color: #000;
  }
  p {
    font-size: 15px;
    color: #eee;
  }
`;

export default Skills;
