import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { decodeItem } from '@arken/node/util/decoder';
import styled, { css } from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button, Flex, Card, Card2, Heading, CardBody, BaseLayout, Skeleton, ButtonMenu, ButtonMenuItem } from '~/ui';
import Page from '~/components/layout/Page';
import { Link as RouterLink } from 'react-router-dom';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import PageWindow from '~/components/PageWindow';
import useWeb3 from '~/hooks/useWeb3';
import { getUsername } from '~/state/profiles/getProfile';

import { ItemInfo } from '~/components/ItemInfo';
import { ItemCategoriesType } from '@arken/node/legacy/data/items.type';
import useCache from '~/hooks/useCache';
import craftersData from './crafters.json';
import craftingCompetition1Data from './competition1.json';
import craftingCompetition2Data from './competition2.json';

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  grid-gap: 75px;

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

const VerticalCards = styled.div``;

const Container = styled.div`
  & > * {
    text-transform: uppercase;
    line-height: 1rem;
    font-family: 'webfontexl', 'Palatino Linotype', 'Times', serif;
    color: #fff;
  }
`;

const List = styled.div`
  width: 100%;
  margin-bottom: 30px;
  padding: 25px 15px 0;
`;

const ListItem = styled.div`
  width: 100%;
  font-size: 1.5rem;
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
`;

const ListItemCenter = styled.div`
  grid-column: span 8;
  width: 100%;
`;

const ListItemRight = styled.div`
  grid-column: span 3;
  text-align: center;
  width: 120px;
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

const Leaderboard = () => {
  const currentSeason = 6;

  const navigate = useNavigate();
  const { address, library } = useWeb3();
  const location = useLocation();
  const match = parseMatch(location);
  const [tab, setTab] = useState(match?.params?.tab ? parseInt(match?.params?.tab + '') : 4);
  const [subtab, setSubTab] = useState(match?.params?.subtab ? parseInt(match?.params?.subtab + '') : 0);
  const [subSubtab, setSubSubTab] = useState(
    match?.params?.subtab ? parseInt(match?.params?.subtab + '') : tab === 4 ? currentSeason - 1 : 0
  );
  const [playerLeaderboard, setPlayerLeaderboard] = useState(null);
  const [craftingLeaderboard, setCraftingLeaderboard] = useState(null);
  const [realms, setRealms] = useState([]);
  const [username, setUsername] = useState(null);
  const { t } = useTranslation();

  const updateHistory = useCallback(
    (key, keys) => {
      setTimeout(
        () =>
          navigate({
            pathname: '/leaderboard',
            search:
              '?' +
              new URLSearchParams({
                tab: tab.toString(),
                subtab: subtab.toString(),
                ...keys,
              }).toString(),
            // state: { detail: 'some_value' }
          }),
        500
      );
    },
    [navigate, tab, subtab]
  );

  const updateTab = (val) => {
    setTab(val);
    setSubTab(0);

    updateHistory('tab', {
      tab: val,
      subtab: 0,
    });
  };

  const updateSubTab = (val) => {
    setSubTab(val);

    updateHistory('subtab', { subtab: val });
  };

  const updateSubSubTab = (val) => {
    setSubSubTab(val);

    updateHistory('subsubtab', { subsubtab: val });
  };

  const cache = useCache();

  const GlobalStyles = createGlobalStyle`
  input, textarea {
    text-transform: none;
  }
  `;

  useEffect(() => {
    if (!window) return;

    async function init() {
      const coeff = 1000 * 60 * 5;
      const date = new Date(); //or use any other date
      const rand = new Date(Math.round(date.getTime() / coeff) * coeff).getTime();

      {
        const leaderboard = {} as any;

        // const rand1 = Math.floor(Math.random() * Math.floor(999999))
        const response1 = await fetch(`https://s1.envoy.arken.asi.sh/evolution/realms.json?${rand}`);
        let _realms = await response1.json();

        _realms = [
          {
            key: 'global',
            name: 'Global',
            status: 'online',
            region: 1,
          },
          ..._realms,
        ];
        // _realms.find((r) => r.name === 'World' && r.regionId === 2).name = 'North America'

        setRealms(_realms.filter((r) => r.status === 'online'));

        for (let season = 1; season <= currentSeason; season++) {
          for (const realmIndex in _realms) {
            const realm = _realms[realmIndex];
            if (realm.name === 'Test Realm') continue;
            if (realm.key === 'world1') continue;
            // if (realm.regionId > 1) continue

            try {
              // const rand2 = Math.floor(Math.random() * Math.floor(999999))
              const response2 = await fetch(
                `https://s1.envoy.arken.asi.sh/evolution/${realm.key}/season${season}/leaderboard.json?${rand}`
              );
              const leaderboardData = await response2.json();

              if (!leaderboard[season]) leaderboard[season] = {};

              leaderboard[season][realm.key] = leaderboardData;
            } catch (e) {
              console.log(e);
            }
          }

          try {
            // const rand2 = Math.floor(Math.random() * Math.floor(999999))
            const response2 = await fetch(
              `https://s1.envoy.arken.asi.sh/evolution/global/season${season}/leaderboard.json?${rand}`
            );
            const leaderboardData = await response2.json();

            leaderboard[season].global = leaderboardData;
          } catch (e) {
            console.log(e);
          }

          setPlayerLeaderboard(leaderboard);
        }
      }

      {
        // const rand = Math.floor(Math.random() * Math.floor(999999))
        const response = await fetch(`https://s1.envoy.arken.asi.sh/crafting/leaderboard.json?${rand}`);
        const responseData = await response.json();

        setCraftingLeaderboard(responseData);
      }
    }

    init();

    const inter = setInterval(init, 1 * 60 * 1000);

    return () => {
      clearInterval(inter);
    };
  }, []);

  useEffect(
    function () {
      if (!address) return;

      async function init() {
        try {
          const res = await getUsername(address);
          // @ts-ignore
          if (res) {
            setUsername(res);
          }
        } catch (e) {
          console.log(e);
        }
      }

      const inter = setInterval(init, 1 * 60 * 1000);
      init();

      return () => {
        clearInterval(inter);
      };
    },
    [address, setUsername]
  );

  const subtabToRealmKey = function (st) {
    return realms[st]?.key;
  };

  return (
    <Page>
      <GlobalStyles />
      <Container>
        <Card2>
          <Card style={{ width: '100%' }}>
            <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
              {t('Leaderboard')}
            </Heading>
            <hr />
            <CardBody>
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <ButtonMenu activeIndex={tab} scale="md" onItemClick={(index) => updateTab(index)}>
                  <ButtonMenuItem>{t('Crafters')}</ButtonMenuItem>
                  <ButtonMenuItem>{t('Guilds')}</ButtonMenuItem>
                  <ButtonMenuItem>{t('Raiders')}</ButtonMenuItem>
                  <ButtonMenuItem>{t('Royales')}</ButtonMenuItem>
                  <ButtonMenuItem>{t('Evolution')}</ButtonMenuItem>
                  <ButtonMenuItem>{t('Infinite')}</ButtonMenuItem>
                </ButtonMenu>
              </Flex>
              <br />
              <br />
              {tab === 3 ? (
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <RouterLink to={`/tournament`}>View Rune Royale Tournament Data</RouterLink>
                </Flex>
              ) : null}
              {tab === 0 ? (
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <ButtonMenu activeIndex={subtab} scale="md" onItemClick={(index) => updateSubTab(index)}>
                    <ButtonMenuItem>{t('Overall')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('Competition #1')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('Competition #2')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('Competition #3')}</ButtonMenuItem>
                  </ButtonMenu>
                  <br />
                  <br />
                  {!craftingLeaderboard ? <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" /> : null}
                </Flex>
              ) : null}
              {tab === 4 ? (
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <ButtonMenu activeIndex={subtab} scale="md" onItemClick={(index) => updateSubTab(index)}>
                    {realms.map((realm) => (
                      <ButtonMenuItem key={realm.name}>
                        {t(realm.name)}
                        {/* {realm.regionId} */}
                      </ButtonMenuItem>
                    ))}
                  </ButtonMenu>
                  <br />
                  <br />
                  <Flex flexDirection="column" alignItems="center" justifyContent="center">
                    <ButtonMenu activeIndex={subSubtab} scale="md" onItemClick={(index) => updateSubSubTab(index)}>
                      <ButtonMenuItem>{t('Season 1 (2022)')}</ButtonMenuItem>
                      <ButtonMenuItem>{t('Season 2 (2022)')}</ButtonMenuItem>
                      <ButtonMenuItem>{t('Season 3 (2022)')}</ButtonMenuItem>
                      <ButtonMenuItem>{t('Season 4 (2022)')}</ButtonMenuItem>
                      <ButtonMenuItem>{t('Season 5 (2022)')}</ButtonMenuItem>
                      <ButtonMenuItem>{t('Season 1 (2023)')}</ButtonMenuItem>
                      <ButtonMenuItem style={{ display: 'none' }}>{t('Season 0')}</ButtonMenuItem>
                    </ButtonMenu>
                  </Flex>
                  <br />
                  <br />
                  {!playerLeaderboard ? <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" /> : null}
                </Flex>
              ) : null}
              <br />
              <br />
              <br />
              {tab === 0 && subtab === 0 && craftingLeaderboard ? (
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <MainHeading>Top Crafters</MainHeading>
                  <br />
                  <br />
                  <br />
                  <Cards>
                    <VerticalCards>
                      {craftingLeaderboard?.all.slice(0, 1).map(({ name, count, data }) => {
                        let rank = 1;
                        let prevItem = null;
                        let other = cache.stats.totalItems;
                        return (
                          <div key={name}>
                            <SubHeading>{name}</SubHeading>
                            <List>
                              {data.map((item, index) => {
                                if (rank >= count) return null;
                                if (prevItem && item.count !== prevItem.count) rank++;
                                prevItem = item;
                                other -= item.count;
                                return (
                                  <ListItem key={index}>
                                    <ListItemLeft>{rank}</ListItemLeft>
                                    <ListItemCenter>
                                      <RouterLink to={`/user/${item.username}`}>{item.username}</RouterLink>
                                    </ListItemCenter>
                                    <ListItemRight>{item.count}</ListItemRight>
                                  </ListItem>
                                );
                              })}
                              <ListItem key="other">
                                <ListItemCenter>{count + 1}+</ListItemCenter>
                                <ListItemLeft></ListItemLeft>
                                <ListItemRight>{other}</ListItemRight>
                              </ListItem>
                            </List>
                          </div>
                        );
                      })}
                    </VerticalCards>
                    <VerticalCards>
                      {craftingLeaderboard?.all.slice(1).map(({ name, count, data }) => {
                        let rank = 1;
                        let prevItem = null;
                        return (
                          <div key={name}>
                            <SubHeading>{name}</SubHeading>
                            <List>
                              {data.map((item, index) => {
                                if (rank >= count) return null;
                                if (prevItem && item.count !== prevItem.count) rank++;
                                prevItem = item;
                                return (
                                  <ListItem key={index}>
                                    <ListItemLeft>{rank}</ListItemLeft>
                                    <ListItemCenter>
                                      <RouterLink to={`/user/${item.username}`}>{item.username}</RouterLink>
                                    </ListItemCenter>
                                    <ListItemRight>{item.count}</ListItemRight>
                                  </ListItem>
                                );
                              })}
                            </List>
                          </div>
                        );
                      })}
                    </VerticalCards>
                  </Cards>
                  <br />
                  <br />
                  <p>
                    <em>Note: Direct crafts only. Not transfers/sales.</em>
                  </p>
                  <br />
                  <br />
                  <a href="https://www.youtube.com/channel/UCFkCD9N_-d4QGKddOkWbhgg">
                    <em>
                      Data provided by <strong>Rune Experiments</strong>
                    </em>
                  </a>
                </Flex>
              ) : null}
              {tab === 0 && subtab === 1 && craftingLeaderboard ? (
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <MainHeading>Crafting Competition #1</MainHeading>
                  <br />
                  <br />
                  <br />
                  <Cards>
                    <VerticalCards>
                      {craftingLeaderboard?.competition1.slice(0, 1).map(({ name, count, data }) => {
                        let rank = 1;
                        let prevItem = null;
                        return (
                          <div key={name}>
                            <SubHeading>{name}</SubHeading>
                            <List>
                              {data.map((item, index) => {
                                if (rank >= count) return null;
                                if (prevItem && item.count !== prevItem.count) rank++;
                                prevItem = item;
                                return (
                                  <ListItem key={index}>
                                    <ListItemLeft>{rank}</ListItemLeft>
                                    <ListItemCenter>
                                      <RouterLink to={`/user/${item.username}`}>{item.username}</RouterLink>
                                    </ListItemCenter>
                                    <ListItemRight>{item.count}</ListItemRight>
                                  </ListItem>
                                );
                              })}
                            </List>
                          </div>
                        );
                      })}
                    </VerticalCards>
                    <VerticalCards>
                      {craftingLeaderboard?.competition1.slice(1).map(({ name, count, data }) => {
                        let rank = 1;
                        let prevItem = null;
                        return (
                          <div key={name}>
                            <SubHeading>{name}</SubHeading>
                            <List>
                              {data.map((item, index) => {
                                if (rank >= count) return null;
                                if (prevItem && item.count !== prevItem.count) rank++;
                                prevItem = item;
                                return (
                                  <ListItem key={index}>
                                    <ListItemLeft>{rank}</ListItemLeft>
                                    <ListItemCenter>
                                      <RouterLink to={`/user/${item.username}`}>{item.username}</RouterLink>
                                    </ListItemCenter>
                                    <ListItemRight>{item.count}</ListItemRight>
                                  </ListItem>
                                );
                              })}
                            </List>
                          </div>
                        );
                      })}
                    </VerticalCards>
                  </Cards>
                  <br />
                  <br />
                  <p>
                    <em>Note: Direct crafts only. Not transfers/sales.</em>
                  </p>
                  <br />
                  <br />
                  <a href="https://www.youtube.com/channel/UCFkCD9N_-d4QGKddOkWbhgg">
                    <em>
                      Data provided by <strong>Rune Experiments</strong>
                    </em>
                  </a>
                </Flex>
              ) : null}
              {tab === 0 && subtab === 2 && craftingLeaderboard ? (
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <MainHeading>Crafting Competition #2</MainHeading>
                  <br />
                  <br />
                  <br />
                  <Cards>
                    <VerticalCards>
                      {craftingLeaderboard?.competition2.slice(0, 1).map(({ name, count, data }) => {
                        let rank = 1;
                        let prevItem = null;
                        return (
                          <div key={name}>
                            <SubHeading>{name}</SubHeading>
                            <List>
                              {data.map((item, index) => {
                                if (rank >= count) return null;
                                if (prevItem && item.count !== prevItem.count) rank++;
                                prevItem = item;
                                return (
                                  <ListItem key={index}>
                                    <ListItemLeft>{rank}</ListItemLeft>
                                    <ListItemCenter>
                                      <RouterLink to={`/user/${item.username}`}>{item.username}</RouterLink>
                                    </ListItemCenter>
                                    <ListItemRight>{item.count}</ListItemRight>
                                  </ListItem>
                                );
                              })}
                            </List>
                          </div>
                        );
                      })}
                    </VerticalCards>
                    <VerticalCards>
                      {craftingLeaderboard?.competition2.slice(1).map(({ name, count, data }) => {
                        let rank = 1;
                        let prevItem = null;
                        return (
                          <div key={name}>
                            <SubHeading>{name}</SubHeading>
                            <List>
                              {data.map((item, index) => {
                                if (rank >= count) return null;
                                if (prevItem && item.count !== prevItem.count) rank++;
                                prevItem = item;
                                return (
                                  <ListItem key={index}>
                                    <ListItemLeft>{rank}</ListItemLeft>
                                    <ListItemCenter>
                                      <RouterLink to={`/user/${item.username}`}>{item.username}</RouterLink>
                                    </ListItemCenter>
                                    <ListItemRight>{item.count}</ListItemRight>
                                  </ListItem>
                                );
                              })}
                            </List>
                          </div>
                        );
                      })}
                    </VerticalCards>
                  </Cards>
                  <br />
                  <br />
                  <p>
                    <em>Note: Direct crafts only. Not transfers/sales.</em>
                  </p>
                  <br />
                  <br />
                  <a href="https://www.youtube.com/channel/UCFkCD9N_-d4QGKddOkWbhgg">
                    <em>
                      Data provided by <strong>Rune Experiments</strong>
                    </em>
                  </a>
                </Flex>
              ) : null}
              {tab === 0 && subtab === 3 && craftingLeaderboard ? (
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <MainHeading>Crafting Competition #3</MainHeading>
                  <br />
                  <br />
                  <br />
                  <Cards>
                    <VerticalCards>
                      {craftingLeaderboard?.competition3.slice(0, 1).map(({ name, count, data }) => {
                        let rank = 1;
                        let prevItem = null;
                        return (
                          <div key={name}>
                            <SubHeading>{name}</SubHeading>
                            <List>
                              {data.map((item, index) => {
                                if (rank >= count) return null;
                                if (prevItem && item.count !== prevItem.count) rank++;
                                prevItem = item;
                                return (
                                  <ListItem key={index}>
                                    <ListItemLeft>{rank}</ListItemLeft>
                                    <ListItemCenter>
                                      <RouterLink to={`/user/${item.username}`}>{item.username}</RouterLink>
                                    </ListItemCenter>
                                    <ListItemRight>{item.count}</ListItemRight>
                                  </ListItem>
                                );
                              })}
                            </List>
                          </div>
                        );
                      })}
                    </VerticalCards>
                    <VerticalCards>
                      {craftingLeaderboard?.competition3.slice(1).map(({ name, count, data }) => {
                        let rank = 1;
                        let prevItem = null;
                        return (
                          <div key={name}>
                            <SubHeading>{name}</SubHeading>
                            <List>
                              {data.map((item, index) => {
                                if (rank >= count) return null;
                                if (prevItem && item.count !== prevItem.count) rank++;
                                prevItem = item;
                                return (
                                  <ListItem key={index}>
                                    <ListItemLeft>{rank}</ListItemLeft>
                                    <ListItemCenter>
                                      <RouterLink to={`/user/${item.username}`}>{item.username}</RouterLink>
                                    </ListItemCenter>
                                    <ListItemRight>{item.count}</ListItemRight>
                                  </ListItem>
                                );
                              })}
                            </List>
                          </div>
                        );
                      })}
                    </VerticalCards>
                  </Cards>
                  <br />
                  <br />
                  <p>
                    <em>Note: Direct crafts only. Not transfers/sales.</em>
                  </p>
                  <br />
                  <br />
                  <a href="https://www.youtube.com/channel/UCFkCD9N_-d4QGKddOkWbhgg">
                    <em>
                      Data provided by <strong>Rune Experiments</strong>
                    </em>
                  </a>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                </Flex>
              ) : null}

              {tab === 4 && playerLeaderboard?.[subSubtab + 1]?.[subtabToRealmKey(subtab)] ? (
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <MainHeading>Top Players</MainHeading>
                  <br />
                  <br />
                  <br />

                  <Cards>
                    {/* <VerticalCards>
                {players.all.slice(0, 1).map(({ name, count, data }) => {
                  let rank = 1
                  let prevItem = null
                  return (
                    <>
                      <SubHeading>{name}</SubHeading>
                      <List>
                        {data.map((item, index) => {
                          if (rank >= count) return null
                          if (prevItem && item.count !== prevItem.count) rank++
                          prevItem = item
                          return (
                            <ListItem key={index}>
                              <ListItemLeft>{rank}</ListItemLeft>
                              <ListItemCenter><RouterLink to={`/user/${item.username}`}>{item.username}</RouterLink></ListItemCenter>
                              <ListItemRight>{item.count}</ListItemRight>
                            </ListItem>
                          )
                        })}
                      </List>
                    </>
                  )
                })}
              </VerticalCards> */}
                    {/* <VerticalCards>
                    {playerLeaderboard[subtabToRealmKey(subtab)].monetary.slice(0, 1).map(({ name, count, data }) => {
                      let rank = 1
                      let prevItem = null
                      return (
                        <div key={name}>
                          <SubHeading>{name}</SubHeading>
                          <List>
                            {data.map((item, index) => {
                              if (rank >= count) return null
                              if (prevItem && item.count !== prevItem.count) rank++
                              prevItem = item
                              return (
                                <ListItem key={index}>
                                  <ListItemLeft>{rank}</ListItemLeft>
                                  <ListItemCenter>
                                    <RouterLink to={`/user/${item.username}`}>{item.username}</RouterLink>
                                  </ListItemCenter>
                                  <ListItemRight>
                                    ${parseFloat(item.count.toFixed(0)).toLocaleString('en-US')}
                                  </ListItemRight>
                                </ListItem>
                              )
                            })}
                          </List>
                        </div>
                      )
                    })}
                  </VerticalCards> */}
                    <VerticalCards>
                      {playerLeaderboard[subSubtab + 1][subtabToRealmKey(subtab)].monetary.map(
                        ({ name, count, data }) => {
                          let rank = 1;
                          let prevItem = null;
                          return (
                            <div key={name}>
                              <SubHeading>Rewards</SubHeading>
                              <List>
                                {data
                                  .filter((item) => !['Testman', 'Botter'].includes(item.name))
                                  .map((item, index) => {
                                    if (prevItem && item.count !== prevItem.count) rank++;
                                    prevItem = item;
                                    if (rank > 50 && item.name !== username) return null;
                                    return (
                                      <ListItem key={index}>
                                        <ListItemLeft>{rank}</ListItemLeft>
                                        <ListItemCenter>
                                          <RouterLink to={`/user/${item.name}`}>{item.name}</RouterLink>
                                        </ListItemCenter>
                                        <ListItemRight>{item.count.toFixed(2)} ZOD</ListItemRight>
                                      </ListItem>
                                    );
                                  })}
                              </List>
                            </div>
                          );
                        }
                      )}
                    </VerticalCards>
                    <VerticalCards>
                      {playerLeaderboard[subSubtab + 1][subtabToRealmKey(subtab)].kills.map(({ name, count, data }) => {
                        let rank = 1;
                        let prevItem = null;
                        return (
                          <div key={name}>
                            <SubHeading>{name}</SubHeading>
                            <List>
                              {data
                                .filter((item) => !['Testman', 'Botter'].includes(item.name))
                                .map((item, index) => {
                                  if (prevItem && item.count !== prevItem.count) rank++;
                                  prevItem = item;
                                  if (rank > 50 && item.name !== username) return null;
                                  return (
                                    <ListItem key={index}>
                                      <ListItemLeft>{rank}</ListItemLeft>
                                      <ListItemCenter>
                                        <RouterLink to={`/user/${item.name}`}>{item.name}</RouterLink>
                                      </ListItemCenter>
                                      <ListItemRight>{item.count}</ListItemRight>
                                    </ListItem>
                                  );
                                })}
                            </List>
                          </div>
                        );
                      })}
                    </VerticalCards>
                    <VerticalCards>
                      {playerLeaderboard[subSubtab + 1][subtabToRealmKey(subtab)].rounds.map(
                        ({ name, count, data }) => {
                          let rank = 1;
                          let prevItem = null;
                          return (
                            <div key={name}>
                              <SubHeading>{name}</SubHeading>
                              <List>
                                {data
                                  .filter((item) => !['Testman', 'Botter'].includes(item.name))
                                  .map((item, index) => {
                                    if (prevItem && item.count !== prevItem.count) rank++;
                                    prevItem = item;
                                    if (rank > 50 && item.name !== username) return null;
                                    return (
                                      <ListItem key={index}>
                                        <ListItemLeft>{rank}</ListItemLeft>
                                        <ListItemCenter>
                                          <RouterLink to={`/user/${item.name}`}>{item.name}</RouterLink>
                                        </ListItemCenter>
                                        <ListItemRight>{item.count}</ListItemRight>
                                      </ListItem>
                                    );
                                  })}
                              </List>
                            </div>
                          );
                        }
                      )}
                    </VerticalCards>
                    <VerticalCards>
                      {playerLeaderboard[subSubtab + 1][subtabToRealmKey(subtab)].wins.map(({ name, count, data }) => {
                        let rank = 1;
                        let prevItem = null;
                        return (
                          <div key={name}>
                            <SubHeading>{name}</SubHeading>
                            <List>
                              {data
                                .filter((item) => !['Testman', 'Botter'].includes(item.name))
                                .map((item, index) => {
                                  if (prevItem && item.count !== prevItem.count) rank++;
                                  prevItem = item;
                                  if (rank > 50 && item.name !== username) return null;
                                  return (
                                    <ListItem key={index}>
                                      <ListItemLeft>{rank}</ListItemLeft>
                                      <ListItemCenter>
                                        <RouterLink to={`/user/${item.name}`}>{item.name}</RouterLink>
                                      </ListItemCenter>
                                      <ListItemRight>{item.count}</ListItemRight>
                                    </ListItem>
                                  );
                                })}
                            </List>
                          </div>
                        );
                      })}
                    </VerticalCards>
                    <VerticalCards>
                      {playerLeaderboard[subSubtab + 1][subtabToRealmKey(subtab)].powerups.map(
                        ({ name, count, data }) => {
                          let rank = 1;
                          let prevItem = null;
                          return (
                            <div key={name}>
                              <SubHeading>{name}</SubHeading>
                              <List>
                                {data
                                  .filter((item) => !['Testman', 'Botter'].includes(item.name))
                                  .map((item, index) => {
                                    if (prevItem && item.count !== prevItem.count) rank++;
                                    prevItem = item;
                                    if (rank > 50 && item.name !== username) return null;
                                    return (
                                      <ListItem key={index}>
                                        <ListItemLeft>{rank}</ListItemLeft>
                                        <ListItemCenter>
                                          <RouterLink to={`/user/${item.name}`}>{item.name}</RouterLink>
                                        </ListItemCenter>
                                        <ListItemRight>{item.count}</ListItemRight>
                                      </ListItem>
                                    );
                                  })}
                              </List>
                            </div>
                          );
                        }
                      )}
                    </VerticalCards>
                    <VerticalCards>
                      {playerLeaderboard[subSubtab + 1][subtabToRealmKey(subtab)].rewards.map(
                        ({ name, count, data }) => {
                          let rank = 1;
                          let prevItem = null;
                          return (
                            <div key={name}>
                              <SubHeading>Pickups</SubHeading>
                              <List>
                                {data
                                  .filter((item) => !['Testman', 'Botter'].includes(item.name))
                                  .map((item, index) => {
                                    if (prevItem && item.count !== prevItem.count) rank++;
                                    prevItem = item;
                                    if (rank > 50 && item.name !== username) return null;
                                    return (
                                      <ListItem key={index}>
                                        <ListItemLeft>{rank}</ListItemLeft>
                                        <ListItemCenter>
                                          <RouterLink to={`/user/${item.name}`}>{item.name}</RouterLink>
                                        </ListItemCenter>
                                        <ListItemRight>{item.count}</ListItemRight>
                                      </ListItem>
                                    );
                                  })}
                              </List>
                            </div>
                          );
                        }
                      )}
                    </VerticalCards>
                    <VerticalCards>
                      {playerLeaderboard[subSubtab + 1][subtabToRealmKey(subtab)].evolves.map(
                        ({ name, count, data }) => {
                          let rank = 1;
                          let prevItem = null;
                          return (
                            <div key={name}>
                              <SubHeading>{name}</SubHeading>
                              <List>
                                {data
                                  .filter((item) => !['Testman', 'Botter'].includes(item.name))
                                  .map((item, index) => {
                                    if (prevItem && item.count !== prevItem.count) rank++;
                                    prevItem = item;
                                    if (rank > 50 && item.name !== username) return null;
                                    return (
                                      <ListItem key={index}>
                                        <ListItemLeft>{rank}</ListItemLeft>
                                        <ListItemCenter>
                                          <RouterLink to={`/user/${item.name}`}>{item.name}</RouterLink>
                                        </ListItemCenter>
                                        <ListItemRight>{item.count}</ListItemRight>
                                      </ListItem>
                                    );
                                  })}
                              </List>
                            </div>
                          );
                        }
                      )}
                    </VerticalCards>
                    <VerticalCards>
                      {playerLeaderboard[subSubtab + 1][subtabToRealmKey(subtab)].points.map(
                        ({ name, count, data }) => {
                          let rank = 1;
                          let prevItem = null;
                          return (
                            <div key={name}>
                              <SubHeading>{name}</SubHeading>
                              <List>
                                {data
                                  .filter((item) => !['Testman', 'Botter'].includes(item.name))
                                  .map((item, index) => {
                                    if (prevItem && item.count !== prevItem.count) rank++;
                                    prevItem = item;
                                    if (rank > 50 && item.name !== username) return null;
                                    return (
                                      <ListItem key={index}>
                                        <ListItemLeft>{rank}</ListItemLeft>
                                        <ListItemCenter>
                                          <RouterLink to={`/user/${item.name}`}>{item.name}</RouterLink>
                                        </ListItemCenter>
                                        <ListItemRight>{item.count}</ListItemRight>
                                      </ListItem>
                                    );
                                  })}
                              </List>
                            </div>
                          );
                        }
                      )}
                    </VerticalCards>
                  </Cards>
                  <br />
                  <br />
                  <p>
                    <em>Note: Only counts Rune accounts.</em>
                  </p>
                </Flex>
              ) : null}

              {/* {tab === 1 && subtab === 1 && playerLeaderboard ? (
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <MainHeading>Player Competition #1</MainHeading>
            <br />
            <br />
            <br />
            <MainHeading>Coming Soon</MainHeading>
            <Cards>
              <VerticalCards>
                {playerLeaderboard?.competition1?.slice(0, 1).map(({ name, count, data }) => {
                  let rank = 1
                  let prevItem = null
                  return (
                    <div key={name}>
                      <SubHeading>{name}</SubHeading>
                      <List>
                        {data.map((item, index) => {
                          if (rank >= count) return null
                          if (prevItem && item.count !== prevItem.count) rank++
                          prevItem = item
                          return (
                            <ListItem key={index}>
                              <ListItemLeft>{rank}</ListItemLeft>
                              <ListItemCenter>
                                <RouterLink to={`/user/${item.username}`}>{item.username}</RouterLink>
                              </ListItemCenter>
                              <ListItemRight>{item.count}</ListItemRight>
                            </ListItem>
                          )
                        })}
                      </List>
                    </div>
                  )
                })}
              </VerticalCards>
              <VerticalCards>
                {playerLeaderboard?.competition1?.slice(1).map(({ name, count, data }) => {
                  let rank = 1
                  let prevItem = null
                  return (
                    <div key={name}>
                      <SubHeading>{name}</SubHeading>
                      <List>
                        {data.map((item, index) => {
                          if (rank >= count) return null
                          if (prevItem && item.count !== prevItem.count) rank++
                          prevItem = item
                          return (
                            <ListItem key={index}>
                              <ListItemLeft>{rank}</ListItemLeft>
                              <ListItemCenter>
                                <RouterLink to={`/user/${item.username}`}>{item.username}</RouterLink>
                              </ListItemCenter>
                              <ListItemRight>{item.count}</ListItemRight>
                            </ListItem>
                          )
                        })}
                      </List>
                    </div>
                  )
                })}
              </VerticalCards>
            </Cards>
            <br />
            <br />
            <p>
              <em>Note: Only counts Rune accounts.</em>
            </p>
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
            <br />
            <br />
            <br />
          </Flex>
        ) : null} */}
              {tab === 2 ? (
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <MainHeading>Coming Soon</MainHeading>
                </Flex>
              ) : null}
              {tab === 1 ? (
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <MainHeading>Coming Soon</MainHeading>
                </Flex>
              ) : null}
              {tab === 5 ? (
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <ButtonMenu activeIndex={subtab} scale="md" onItemClick={(index) => updateSubTab(index)}>
                    <ButtonMenuItem>{t('Europe')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('Asia')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('North America')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('South America')}</ButtonMenuItem>
                    <ButtonMenuItem>{t('Oceanic')}</ButtonMenuItem>
                  </ButtonMenu>
                  <br />
                  <br />
                  {!playerLeaderboard ? <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" /> : null}
                </Flex>
              ) : null}
            </CardBody>
          </Card>
        </Card2>
      </Container>
    </Page>
  );
};

export default Leaderboard;
