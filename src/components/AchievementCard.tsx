import React from 'react'
import styled from 'styled-components'
import { Flex, PrizeIcon, Text } from '~/ui'
import { Achievement } from '~/state/types'
import AchievementAvatar from './AchievementAvatar'
import AchievementTitle from './AchievementTitle'
import AchievementDescription from './AchievementDescription'

interface AchievementCardProps {
  achievement: Achievement
  completed: boolean
}

const Container = styled(Flex)<{ completed: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #000;
  padding: 10px;

  ${({ completed }) => (!completed ? 'filter: saturate(0);' : '')}
`

const Details = styled(Flex)`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding-left: 8px;
  padding-right: 8px;
`

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, completed }) => {
  return (
    <Container completed={completed}>
      <AchievementAvatar badge={achievement.icon} />
      <Details>
        <AchievementTitle title={achievement.name} />
        <AchievementDescription description={achievement.branches[1].description} />
      </Details>
      <Flex alignItems="center">
        <PrizeIcon width="18px" color="textSubtle" mr="4px" />
        <Text color="textSubtle">{achievement.points.toLocaleString()}</Text>
      </Flex>
    </Container>
  )
}

export default AchievementCard
