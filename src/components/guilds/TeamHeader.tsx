import React from 'react'
import { Heading, Text } from '~/ui'
import { useProfile } from '~/state/hooks'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import HeaderWrapper from '~/components/account/HeaderWrapper'
import NoProfileCard from './NoProfileCard'

const TeamHeader = () => {
  const { t } = useTranslation()
  const { isInitialized, profile } = useProfile()
  const showProfileCallout = isInitialized && !profile

  return <>{showProfileCallout && <NoProfileCard />}</>
}

export default TeamHeader
