import React from 'react'
import { Text } from '~/ui'
import useRuneBalance from '~/hooks/useRuneBalance'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import { getBalanceNumber } from '~/utils/formatBalance'
import { useRunePrice } from '~/state/hooks'
import { BigNumber } from 'bignumber.js'
import useWeb3 from '~/hooks/useWeb3'
import CardValue from './CardValue'
import CardBusdValue from './CardBusdValue'

const RuneWalletBalance = ({ symbol }) => {
  const { t } = useTranslation()
  const runeBalance = useRuneBalance(symbol)
  const busdBalance = new BigNumber(getBalanceNumber(runeBalance)).multipliedBy(useRunePrice(symbol)).toNumber()
  const { address: account } = useWeb3()

  if (!account) {
    return (
      <Text color="textDisabled" style={{ lineHeight: '54px' }}>
        {t('Locked')}
      </Text>
    )
  }

  return (
    <>
      <CardValue value={getBalanceNumber(runeBalance)} decimals={4} fontSize="24px" lineHeight="36px" />
      <CardBusdValue value={busdBalance} />
    </>
  )
}

export default RuneWalletBalance
