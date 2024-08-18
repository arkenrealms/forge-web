import React from 'react'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'

export interface TranslatedTextProps {
  translationId: number
  children: string
}

const TranslatedText = ({ translationId, children }: TranslatedTextProps) => {
  const { t } = useTranslation()
  return <>{t(children)}</>
}

export default TranslatedText
