import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import ProfileAvatar from '~/components/account/ProfileAvatar';
import useCache from '~/hooks/useCache';
import useWeb3 from '~/hooks/useWeb3';
import getProfile, { getUserAddressByUsername } from '~/state/profiles/getProfile';
import {
  BlockIcon,
  Button,
  Card,
  CardBody,
  CheckmarkCircleIcon,
  Flex,
  Heading,
  Link,
  OpenNewIcon,
  PrizeIcon,
  Skeleton,
  Tag,
  Text,
} from '~/ui';
import AchievementsList from './AchievementsList';
import CardHeader from './account/CardHeader';
import StatBox from './account/StatBox';

const Content = styled.div`
  flex: 1;
  padding: 16px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 16px;
  }
`;

const Username = styled(Heading)`
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 40px;
    line-height: 44px;
  }
`;

const Status = styled.div`
  position: absolute;
  right: 24px;
  top: 24px;
`;

const ResponsiveText = styled(Text)`
  font-size: 12px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
  }
`;

const AddressLink = styled(Link)`
  display: inline-block;
  font-weight: 400;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 80px;
  white-space: nowrap;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
    width: auto;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr;

  // ${({ theme }) => theme.mediaQueries.sm} {
  //   grid-template-columns: repeat(2, 1fr);
  // }
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
const Section = styled.div`
  margin-bottom: 40px;
`;

const EquipmentContainer = styled.div`
  width: 100%;
  margin: -100px 0;
  text-align: left;

  & > br + br + div {
    zoom: 0.7;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 558px;

    & > br + br + div {
      zoom: 1;
    }
  }
`;

const StatRow = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
    grid-template-columns: repeat(4, 1fr);
    margin-bottom: 32px;
  }
`;

const initialized = {};

const PublicProfile = ({ match }) => {
  const { address: account } = useWeb3();
  const { id }: { id: string } = match.params;
  const [profile, setProfile] = useState(null);
  // const [evolution, setEvolution] = useState(null)
  const { t } = useTranslation();
  const [address, setAddress] = useState('');
  const cache = useCache();

  useEffect(() => {
    if (!!profile && initialized[address]) return;

    initialized[address] = true;

    async function init() {
      let realAddress;

      if (id.indexOf('0x') === 0) {
        realAddress = id;
      } else {
        realAddress = await getUserAddressByUsername(id);
      }

      setAddress(realAddress);

      const p = (await getProfile(address)).profile;

      setProfile(p);

      cache.fetchAddress(address);
    }

    init();
  }, [address, profile, id, cache]);

  // useEffect(
  //   function () {
  //     if (!address) return
  //     if (!window) return

  //     async function init() {
  //       const rand = Math.floor(Math.random() * Math.floor(999999))
  //       const response = await fetch(`https://envoy.arken.gg/users/${address}/evolution.json?${rand}`)
  //       const responseData = await response.json()

  //       setEvolution(responseData)
  //     }

  //     init()
  //   },
  //   [address],
  // )
  //   if (!profile) {
  //     return <PageLoader />
  //   }

  const showAddress = window?.location?.hostname === 'localhost';

  const evolution = cache.overview[address]?.evolution;

  return (
    <>
      {!profile ? <Skeleton height="80px" mb="16px" /> : null}
      {profile ? (
        <div>
          <Card>
            <CardHeader>
              <Flex alignItems={['start', null, 'center']} flexDirection={['column', null, 'row']}>
                <ProfileAvatar profile={profile} />
                <Content>
                  <Username>{`${profile.username}`}</Username>
                  {showAddress ? (
                    <Flex alignItems="center">
                      <AddressLink href={`https://bscscan.com/address/${address}`} color="text" external>
                        {address}
                      </AddressLink>
                      <OpenNewIcon ml="4px" />
                    </Flex>
                  ) : null}
                  <ResponsiveText bold>{profile.team.name}</ResponsiveText>
                </Content>
              </Flex>
              <Status>
                {cache.overview[account]?.isBanned ? (
                  <Tag variant="failure" startIcon={<BlockIcon width="18px" />} outline>
                    {t('Banned')}
                  </Tag>
                ) : profile.isActive ? (
                  <Tag startIcon={<CheckmarkCircleIcon width="18px" />} outline>
                    {t('Active')}
                  </Tag>
                ) : (
                  <Tag variant="failure" startIcon={<BlockIcon width="18px" />} outline>
                    {t('Paused')}
                  </Tag>
                )}
              </Status>
            </CardHeader>
            <CardBody>
              <Heading as="h4" size="md" mb="16px">
                {t('Overall Rune Stats')}
              </Heading>
              <StatBox icon={PrizeIcon} title={cache.overview[address]?.points || 0} subtitle={t('Points')} mb="24px" />
              <br />
              <br />
              <br />
              <Section>
                {evolution?.overall && evolution.overall.ranking ? (
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
                      {/* <Mod>
                        <strong>Winnings</strong>
                        <br />
                        {evolution.overall.monetary} ZOD
                      </Mod> */}
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
                      return server?.rounds > 0 && server.ranking?.rounds ? (
                        <>
                          <Heading as="h4" size="md" mb="16px">
                            {t(key.toUpperCase() + ' Evolution Stats')}
                          </Heading>
                          <StatRow>
                            {/* <StatBox
                              title={server.rounds || 0}
                              subtitle={`${t('Winnings')} (Rank ${server.ranking.monetary.position})`}
                            /> */}
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
                ) : !!cache.overview[address] && Object.keys(cache.overview[address].evolution).length === 0 ? (
                  <div>No game stats</div>
                ) : (
                  <>Loading...</>
                )}
              </Section>
              {/* <br />
              <Section>
                <Heading as="h4" size="md" mb="16px">
                  {t('Character')}
                </Heading>
              </Section> */}
              <br />
              <br />
              <br />
              <br />
              <br />
              {/* <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <EquipmentContainer>
                  {address ? <Equipment userAddress={address}></Equipment> : null}
                </EquipmentContainer>
              </Flex>
              <br />
              <br />
              <br /> */}
              <Section>
                <Heading as="h4" size="md" mb="16px">
                  {t('Achievements')}
                </Heading>
                <AchievementsList address={address} />
              </Section>
              <br />
              <div>
                {profile && profile.username && (
                  <Flex flexDirection="column" alignItems="center" justifyContent="center" mt="20px">
                    <Button as={NavLink} to={`/user/${profile.username}/inventory`} mt="10px">
                      {t('View Full Profile')}
                    </Button>
                    <Button as={NavLink} to={`/market?seller=${address}`} mt="10px">
                      {t('View Market Items')}
                    </Button>
                  </Flex>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      ) : null}
    </>
  );
};

export default PublicProfile;
