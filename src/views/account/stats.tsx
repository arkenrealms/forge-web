import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ConnectNetwork } from '~/components/ConnectNetwork';
import Page from '~/components/layout/Page';
import useCache from '~/hooks/useCache';
import useWeb3 from '~/hooks/useWeb3';
import { useFetchProfile, useProfile } from '~/state/hooks';
import { getUserAddressByUsername, getUsername } from '~/state/profiles/getProfile';
import { Card, CardBody, CardHeader, Flex, Heading, PrizeIcon, Text } from '~/ui';
import Header from '~/components/account/Header';
import Menu from '~/components/account/Menu';
import StatBox from '~/components/account/StatBox';
import ProfileCreation from './ProfileCreation';

const Grid = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr;

  // ${({ theme }) => theme.mediaQueries.sm} {
  //   grid-template-columns: repeat(2, 1fr);
  // }
`;

const Section = styled.div`
  margin-bottom: 40px;
`;
const Mod = styled.div`
  width: 100%;
  margin-bottom: 7px;
  text-align: center;
`;
const ModRow = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 2fr;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
    grid-template-columns: repeat(5, 1fr);
    margin-bottom: 32px;
  }
`;

const StatRow = styled.div`
  position: relative;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr;
  margin-bottom: 16px;

  & > div {
    position: relative !important;
    bottom: 0 !important;
    right: 0 !important;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
    grid-template-columns: repeat(4, 1fr);
    margin-bottom: 32px;
  }
`;

const PublicProfile = ({ match }) => {
  const { id }: { id: string } = match.params;
  const { address: _account, library } = useWeb3();
  const [account, setAccount] = useState(null);
  const { t } = useTranslation();
  const cache = useCache();
  const { profile, hasProfile } = useProfile(account);
  const [username, setUsername] = useState(null);
  const [evolution, setEvolution] = useState(null);
  useFetchProfile(account);

  useEffect(() => {
    async function init() {
      const acc = id || _account;

      if (!acc) return;

      if (acc.indexOf('0x') === 0) {
        setAccount(acc);
      } else {
        setAccount(await getUserAddressByUsername(acc));
      }
    }

    init();
  }, [id, _account]);

  useEffect(
    function () {
      if (!account) return;

      async function init() {
        try {
          const res = await getUsername(account);
          // @ts-ignore
          if (res) {
            setUsername(res);
          }
        } catch (e) {
          console.log(e);
        }
      }

      init();
    },
    [account, setUsername]
  );

  useEffect(
    function () {
      if (!account) return;
      if (!window) return;

      async function init() {
        const rand = Math.floor(Math.random() * Math.floor(999999));
        const response = await fetch(`https://s1.envoy.arken.asi.sh/users/${account}/evolution.json?${rand}`);
        const responseData = await response.json();

        setEvolution(responseData);
      }

      init();
    },
    [account]
  );

  // if (!account) {
  //   return <Page><WalletNotConnected /></Page>
  // }

  if (account && !hasProfile) {
    return (
      <Page>
        <ProfileCreation />
      </Page>
    );
  }

  const showAddress = window?.location?.hostname === 'localhost';

  return (
    <Page>
      <ConnectNetwork />
      <Header address={account}>
        <Menu params={match.params} activeIndex={5} />
      </Header>
      <br />
      <Card>
        <CardHeader>
          <Flex alignItems="center" justifyContent="space-between">
            <div>
              <Heading size="lg" mb="8px">
                {t('Stats')}
              </Heading>
              <Text as="p">{t('Take a deep look into gameplay stats here!')}</Text>
            </div>
          </Flex>
        </CardHeader>
        <CardBody>
          <Heading as="h4" size="md" mb="16px">
            {t('Overall Arken Stats')}
          </Heading>
          <StatRow>
            <StatBox icon={PrizeIcon} title={cache.overview[account]?.points || 0} subtitle={t('Points')} mb="24px" />
          </StatRow>
          <br />
          <br />
          <br />
          <Section>
            {evolution?.overall ? (
              <>
                <Heading as="h4" size="md" mb="16px">
                  {t('Overall Evolution Stats')}
                </Heading>
                <StatRow>
                  <StatBox
                    title={evolution.overall.rounds || 0}
                    subtitle={`${t('Rounds')} (Rank ${evolution.overall.ranking.rounds.position})`}
                  />
                  <StatBox
                    title={evolution.overall.wins || 0}
                    subtitle={`${t('Wins')} (Rank ${evolution.overall.ranking.wins.position})`}
                  />
                  <StatBox
                    title={evolution.overall.kills || 0}
                    subtitle={`${t('Kills')} (Rank ${evolution.overall.ranking.kills.position})`}
                  />
                  <StatBox
                    title={evolution.overall.points || 0}
                    subtitle={`${t('Points')} (Rank ${evolution.overall.ranking.points.position})`}
                  />
                </StatRow>
                <br />
                <ModRow>
                  <Mod>
                    <strong>Win Streak</strong>
                    <br />
                    {evolution.overall.winStreak}
                  </Mod>
                  <Mod>
                    <strong>Win Ratio</strong>
                    <br />
                    {evolution.overall.winRatio.toFixed(2)} (#{evolution.overall.ranking.winRatio.position})
                  </Mod>
                  <Mod>
                    <strong>Revenges</strong>
                    <br />
                    {evolution.overall.revenges} (#{evolution.overall.ranking.revenges.position})
                  </Mod>
                  <Mod>
                    <strong>Deaths</strong>
                    <br />
                    {evolution.overall.deaths} (#{evolution.overall.ranking.deaths.position})
                  </Mod>
                  <Mod>
                    <strong>Kill Death Ratio</strong>
                    <br />
                    {evolution.overall.killDeathRatio.toFixed(2)} (#
                    {evolution.overall.ranking.killDeathRatio.position})
                  </Mod>
                  <Mod>
                    <strong>Round Point Ratio</strong>
                    <br />
                    {evolution.overall.roundPointRatio.toFixed(0)} (#
                    {evolution.overall.ranking.roundPointRatio.position})
                  </Mod>
                  <Mod>
                    <strong>Average Latency</strong>
                    <br />
                    {evolution.overall.averageLatency?.toFixed(0) || '?'} (#
                    {evolution.overall.ranking.averageLatency.position})
                  </Mod>
                  <Mod>
                    <strong>Reward Count</strong>
                    <br />
                    {evolution.overall.rewards} (#{evolution.overall.ranking.rewards.position})
                  </Mod>
                  <Mod>
                    <strong>Orbs Count</strong>
                    <br />
                    {evolution.overall.orbs} (#{evolution.overall.ranking.orbs.position})
                  </Mod>
                  <Mod>
                    <strong>Evolve Count</strong>
                    <br />
                    {evolution.overall.evolves} (#{evolution.overall.ranking.evolves.position})
                  </Mod>
                  <Mod>
                    <strong>Sprite Count</strong>
                    <br />
                    {evolution.overall.powerups} (#{evolution.overall.ranking.powerups.position})
                  </Mod>
                  <Mod>
                    <strong>Rewards</strong>
                    <br />
                    {evolution.overall.earnings?.toFixed(0) || '?'}
                  </Mod>
                </ModRow>
                <br />
                <br />
                {Object.keys(evolution.servers).map((key) => {
                  const server = evolution.servers[key];
                  return server?.rounds > 0 ? (
                    <>
                      <Heading as="h4" size="md" mb="16px">
                        {t(key.toUpperCase() + ' Evolution Stats')}
                      </Heading>
                      <StatRow>
                        <StatBox
                          title={server.rounds || 0}
                          subtitle={`${t('Rounds')} (Rank ${server.ranking.rounds.position})`}
                        />
                        <StatBox
                          title={server.wins || 0}
                          subtitle={`${t('Wins')} (Rank ${server.ranking.wins.position})`}
                        />
                        <StatBox
                          title={server.kills || 0}
                          subtitle={`${t('Kills')} (Rank ${server.ranking.kills.position})`}
                        />
                        <StatBox
                          title={server.points || 0}
                          subtitle={`${t('Points')} (Rank ${server.ranking.points.position})`}
                        />
                      </StatRow>
                      <br />
                      <ModRow>
                        <Mod>
                          <strong>Win Streak</strong>
                          <br />
                          {server.winStreak}
                        </Mod>
                        <Mod>
                          <strong>Win Ratio</strong>
                          <br />
                          {server.winRatio.toFixed(2)} (#
                          {server.ranking.winRatio.position})
                        </Mod>
                        <Mod>
                          <strong>Revenges</strong>
                          <br />
                          {server.revenges} (#{server.ranking.revenges.position})
                        </Mod>
                        <Mod>
                          <strong>Deaths</strong>
                          <br />
                          {server.deaths} (#{server.ranking.deaths.position})
                        </Mod>
                        <Mod>
                          <strong>Kill Death Ratio</strong>
                          <br />
                          {server.killDeathRatio.toFixed(2)} (#
                          {server.ranking.killDeathRatio.position})
                        </Mod>
                        <Mod>
                          <strong>Round Point Ratio</strong>
                          <br />
                          {server.roundPointRatio.toFixed(0)} (#
                          {server.ranking.roundPointRatio.position})
                        </Mod>
                        <Mod>
                          <strong>Average Latency</strong>
                          <br />
                          {server.averageLatency?.toFixed(0) || '?'} (#
                          {server.ranking.averageLatency.position})
                        </Mod>
                        <Mod>
                          <strong>Reward Count</strong>
                          <br />
                          {server.rewards} (#{server.ranking.rewards.position})
                        </Mod>
                        <Mod>
                          <strong>Orbs Count</strong>
                          <br />
                          {server.orbs} (#{server.ranking.orbs.position})
                        </Mod>
                        <Mod>
                          <strong>Evolve Count</strong>
                          <br />
                          {server.evolves} (#{server.ranking.evolves.position})
                        </Mod>
                        <Mod>
                          <strong>Sprite Count</strong>
                          <br />
                          {server.powerups} (#{server.ranking.powerups.position})
                        </Mod>
                        <Mod>
                          <strong>Rewards</strong>
                          <br />
                          {server.earnings?.toFixed(0) || '?'}
                        </Mod>
                      </ModRow>
                      <br />
                      <br />
                    </>
                  ) : null;
                })}
              </>
            ) : (
              <>Loading...</>
            )}
          </Section>
        </CardBody>
      </Card>
    </Page>
  );
};

export default PublicProfile;
