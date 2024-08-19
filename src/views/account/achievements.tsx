import { achievementData } from '@arken/node/data/achievements';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { ConnectNetwork } from '~/components/ConnectNetwork';
import Page from '~/components/layout/Page';
import useCache from '~/hooks/useCache';
import useWeb3 from '~/hooks/useWeb3';
import { useFetchAchievements, useFetchProfile, useProfile } from '~/state/hooks';
import { getUsername } from '~/state/profiles/getProfile';
import { Button, Card, CardBody, CardHeader, Flex, Heading, Text } from '~/ui';
import AchievementCard from '~/components/AchievementCard';
import AchievementsList from '~/components/AchievementsList';
import Header from '~/components/account/Header';
import Menu from '~/components/account/Menu';
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

const PublicProfile = ({ match }) => {
  const { id }: { id: string } = match.params;
  const { address: _account, library } = useWeb3();
  const account = id ? id : _account;
  useFetchProfile(account);
  const { profile, hasProfile } = useProfile(account);
  const { t } = useTranslation();
  const cache = useCache();
  const achievements = cache.achievements[account]?.map((a) => achievementData.find((b) => b.id === a)) || [];
  const otherAchievements = achievementData.filter(
    (a) => !cache.achievements[account]?.find((b) => b === a.id) && a.isEnabled
  );

  const [username, setUsername] = useState(null);

  useFetchAchievements();

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

  return (
    <Page>
      <ConnectNetwork />
      <Header address={account}>
        <Menu params={match.params} activeIndex={2} />
      </Header>
      <br />
      <Card>
        <CardHeader>
          <Flex alignItems="center" justifyContent="space-between">
            <div>
              <Heading size="lg" mb="8px">
                {t('Achievements')}
              </Heading>
              <Text as="p">{t('Earn more points for completing larger objectives!')}</Text>
            </div>
          </Flex>
        </CardHeader>
        <CardBody>
          <Section>
            <Heading as="h4" size="md" mb="16px">
              {t('Complete')}
            </Heading>
            <AchievementsList address={account} />
            <br />
            <br />
            <Heading as="h4" size="md" mb="16px">
              {t('Incomplete')}
            </Heading>
            <Grid>
              {otherAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  completed={achievements.find((a) => a.id === achievement.id)}
                />
              ))}
            </Grid>
          </Section>
        </CardBody>
      </Card>
      {profile && username && (
        <Flex flexDirection="column" alignItems="center" justifyContent="center" mt="20px">
          <Button as={NavLink} to={`/user/${username}`} mt="10px">
            {t('View Public Profile')}
          </Button>
        </Flex>
      )}
    </Page>
  );
};

export default PublicProfile;
