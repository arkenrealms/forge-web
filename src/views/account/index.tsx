import { achievementData } from '@arken/node/legacy/data/achievements';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Collectibles from '~/components/account/Collectibles';
import { ConnectNetwork } from '~/components/ConnectNetwork';
import Page from '~/components/layout/Page';
import useCache from '~/hooks/useCache';
import useWeb3 from '~/hooks/useWeb3';
import { useFetchProfile, useProfile } from '~/state/hooks';
import { Button, Card, CardBody, CardHeader, Flex, Heading } from '~/ui';
import AchievementAvatar from '~/components/AchievementAvatar';
import Header from '~/components/account/Header';
import Menu from '~/components/account/Menu';
import WalletNotConnected from '~/components/account/WalletNotConnected';
import ProfileCreation from './ProfileCreation';

const Section = styled.div`
  margin-bottom: 40px;
`;

const TaskCenter = ({ match }) => {
  const { id }: { id: string } = match.params;
  const { address: _account, library } = useWeb3();
  const address = id ? id : _account;
  useFetchProfile(address);
  const { profile, hasProfile } = useProfile(address);
  const { t } = useTranslation();
  const cache = useCache();
  const achievements = cache?.achievements?.[address]?.map((a) => achievementData.find((b) => b.id === a)) || [];

  useEffect(() => {
    cache?.fetchAddress?.(address);
  }, [cache, address]);
  //   if (!address) {
  //     return <Page><WalletNotConnected /></Page>
  //   }

  // if (!user) {
  //   return (
  //     <Page>
  //       <AccountCreation />
  //     </Page>
  //   )
  // }

  if (address && !hasProfile) {
    return (
      <Page>
        <ProfileCreation />
      </Page>
    );
  }

  return (
    <Page>
      <ConnectNetwork />

      <Header address={address}>
        <Menu params={match.params} activeIndex={0} />
      </Header>
      <br />
      <Card>
        <CardHeader>
          <Flex alignItems="center" justifyContent="space-between">
            <Heading size="lg" mb="8px">
              {t('Overview')}
            </Heading>
            {/* <Text as="p">{t('Coming soon.')}</Text> */}
            {/* <Text as="p">{t('Collecting points for these quests makes them available again.')}</Text> */}
          </Flex>
        </CardHeader>
        <CardBody>
          {address ? (
            <>
              {/* <p>
                <strong>Total Achievements:</strong> {achievements?.length} /{' '}
                {achievementData.filter((a) => a.isEnabled).length}
              </p> */}
              <Section style={{ marginBottom: 0 }}>
                <Heading as="h4" size="md" mt="15px" mb="0px">
                  {t('Characters')}
                </Heading>
                <Collectibles />
                <Flex justifyContent="center">
                  <Button as={RouterLink} to="/characters" style={{ textAlign: 'center' }}>
                    Create Character
                  </Button>
                </Flex>
              </Section>
              <Section style={{ marginBottom: 0 }}>
                <Heading as="h4" size="md" mt="15px" mb="0px">
                  {t('Achievements')}
                </Heading>
                <br />
                <div
                  css={css`
                    display: grid;
                    grid-gap: 16px;
                    grid-template-columns: repeat(auto-fill, 64px);
                    padding: 16px 0;
                  `}>
                  {achievements
                    ? achievements.map((achievement) => <AchievementAvatar badge={achievement.icon} />)
                    : null}
                </div>
                <br />
                <Flex justifyContent="center">
                  <Button as={RouterLink} to="/account/achievements" style={{ textAlign: 'center' }}>
                    View All Achievements
                  </Button>
                </Flex>
              </Section>
            </>
          ) : (
            <WalletNotConnected />
          )}
        </CardBody>
      </Card>
    </Page>
  );
};

export default TaskCenter;
