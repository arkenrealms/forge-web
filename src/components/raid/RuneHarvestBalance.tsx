import React from 'react'
import { Text } from '~/ui'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import useAllEarnings from '~/hooks/useAllEarnings'
import { useRunePrice } from '~/state/hooks'
import useWeb3 from '~/hooks/useWeb3'
import styled from 'styled-components'
import useInventory from '~/hooks/useInventory'
import CardValue from './CardValue'
import CardBusdValue from './CardBusdValue'

const Block = styled.div`
  margin-bottom: 24px;
}
`

const RuneHarvestBalance = ({ symbol }) => {
  const { t } = useTranslation()
  const { meta: buffs } = useInventory()
  const { address: account } = useWeb3()
  const allEarnings = useAllEarnings(symbol)
  const earningsSum = allEarnings.reduce((accum, earning) => {
    return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)
  const earningsBusd = new BigNumber(earningsSum).multipliedBy(useRunePrice(symbol)).toNumber()

  if (!account) {
    return (
      <Text color="textDisabled" style={{ lineHeight: '76px' }}>
        {t('Locked')}
      </Text>
    )
  }

  return (
    <Block>
      <CardValue value={earningsSum} lineHeight="1.5" />
      <CardBusdValue value={earningsBusd} />
    </Block>
  )
}

export default RuneHarvestBalance
