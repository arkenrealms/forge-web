import React from 'react'
import { Heading, Text, Card, CardBody } from '~/ui'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import UnlockButton from '~/components/UnlockButton'

const WalletNotConnected = () => {
  const { t } = useTranslation()

  return (
    <>
      <Heading size="xl" mb="8px">
        {t('Disconnected')}
      </Heading>
      <Text as="p" mb="16px">
        {t('Connect your wallet to continue (Binance Smart Chain)')}
      </Text>
      <UnlockButton />
    </>
  )
}

export default WalletNotConnected
