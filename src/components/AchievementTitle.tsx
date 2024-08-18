import React from 'react'
import { Text, TextProps } from '~/ui'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import { TranslatableText as AchievementTitleType } from '~/state/types'

interface AchievementTitleProps extends TextProps {
  title: AchievementTitleType
}

const AchievementTitle: React.FC<AchievementTitleProps> = ({ title, ...props }) => {
  const TranslateString = useI18n()
  const { t } = useTranslation()

  if (typeof title === 'string') {
    return (
      <Text bold {...props}>
        {title}
      </Text>
    )
  }

  const { id, fallback, data = {} } = title

  return (
    <Text bold {...props}>
      {TranslateString(id, fallback, data)}
    </Text>
  )
}

export default AchievementTitle
