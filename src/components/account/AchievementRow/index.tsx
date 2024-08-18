import React, { useState } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, Button, Flex } from '~/ui'
import { Achievement } from '~/state/types'
import { useToast } from '~/state/hooks'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import useWeb3 from '~/hooks/useWeb3'
import ActionColumn from '../ActionColumn'
import PointsLabel from './PointsLabel'
import AchievementTitle from '../../AchievementTitle'
import AchievementAvatar from '../../AchievementAvatar'
import AchievementDescription from '../../AchievementDescription'

interface AchievementRowProps {
  achievement: Achievement
  onCollectSuccess?: (achievement: Achievement) => void
}

const StyledAchievementRow = styled(Flex)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  padding-bottom: 16px;
  padding-top: 16px;
`

const Details = styled.div`
  flex: 1;
`

const Body = styled(Flex)`
  flex-direction: column;
  flex: 1;
  margin-left: 8px;

  ${({ theme }) => theme.mediaQueries.md} {
    align-items: center;
    flex-direction: row;
  }
`

const AchievementRow: React.FC<AchievementRowProps> = ({ achievement, onCollectSuccess }) => {
  const [isCollecting, setIsCollecting] = useState(false)
  const { t } = useTranslation()
  // const pointCenterContract = usePointCenterIfoContract()
  const { address: account } = useWeb3()
  const { toastError, toastSuccess } = useToast()

  const handleCollectPoints = () => {
    // pointCenterContract.methods
    //   .getPoints(achievement.address)
    //   .send({ from: account })
    //   .on('sending', () => {
    //     setIsCollecting(true)
    //   })
    //   .on('receipt', () => {
    //     setIsCollecting(false)
    //     onCollectSuccess(achievement)
    //     toastSuccess('Points Collected!')
    //   })
    //   .on('error', (error) => {
    //     toastError('Error', error?.message)
    //     setIsCollecting(false)
    //   })
  }

  return (
    <StyledAchievementRow>
      <AchievementAvatar badge={achievement.icon} />
      <Body>
        <Details>
          <AchievementTitle title={achievement.name} />
          <AchievementDescription description={achievement.branches[1].description} />
        </Details>
        <PointsLabel
          points={achievement.points.toLocaleString()}
          px={[0, null, null, '32px']}
          mb={['16px', null, null, 0]}
        />
        <ActionColumn>
          <Button
            onClick={handleCollectPoints}
            isLoading={isCollecting}
            endIcon={isCollecting ? <AutoRenewIcon spin color="currentColor" /> : null}
            disabled={isCollecting}
            variant="secondary"
          >
            {t('Collect')}
          </Button>
        </ActionColumn>
      </Body>
    </StyledAchievementRow>
  )
}

export default AchievementRow
