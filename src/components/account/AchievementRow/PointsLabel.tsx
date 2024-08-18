import React from 'react'
import { Flex, FlexProps, PrizeIcon, Text } from '~/ui'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'

interface PointsLabelProps extends FlexProps {
  points: string
  px: any
  mb: any
}

const PointsLabel: React.FC<PointsLabelProps> = ({ points, ...props }) => {
  const { t } = useTranslation()
  const localePoints = points

  return (
    <Flex alignItems="center" {...props}>
      <PrizeIcon mr="4px" color="textSubtle" />
      <Text color="textSubtle">{t(`${localePoints} points`, { num: localePoints })}</Text>
    </Flex>
  )
}

export default PointsLabel
