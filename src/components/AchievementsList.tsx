import React from 'react';
import { achievementData } from '@arken/node/data/achievements';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useCache from '~/hooks/useCache';
import { Flex, Heading } from '~/ui';
import AchievementCard from './AchievementCard';

const Grid = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr;

  // ${({ theme }) => theme.mediaQueries.sm} {
  //   grid-template-columns: repeat(2, 1fr);
  // }
`;

const AchievementsList = ({ address }) => {
  const { t } = useTranslation();
  // const achievements = useAchievements()
  const cache = useCache();
  const achievements = cache.achievements[address]?.map((a) => achievementData.find((b) => b.id === a)) || [];

  return (
    <>
      <Grid>
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} completed />
        ))}
      </Grid>
      {achievements.length === 0 && (
        <Flex alignItems="center" justifyContent="center" style={{ height: '64px' }}>
          <Heading as="h5" size="md" color="textDisabled">
            {t('No achievements yet')}
          </Heading>
        </Flex>
      )}
    </>
  );
};

export default AchievementsList;
