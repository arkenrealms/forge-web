import React, { useState, useRef, useEffect } from 'react'
import { Button } from '~/ui'
import BigNumber from 'bignumber.js'
import { FarmWithStakedValue } from '~/components/FarmCard/FarmCard'
import { getBalanceNumber } from '~/utils/formatBalance'
import { useHarvest } from '~/hooks/useHarvest'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import { useRunePrice } from '~/state/hooks'
import { useCountUp } from 'react-countup'
import useWeb3 from '~/hooks/useWeb3'
import { useFarmStatus } from '~/hooks/useFarmStatus'

import { ActionContainer, ActionTitles, Title, Subtle, ActionContent, Earned, Staked } from './styles'

const HarvestAction: React.FunctionComponent<FarmWithStakedValue> = ({ pid, userData }) => {
  const earningsBigNumber = userData ? new BigNumber(userData.earnings) : null
  const runePrice = useRunePrice('RUNE')
  let earnings = null
  let earningsBusd = 0
  let displayBalance = '?'

  if (earningsBigNumber) {
    earnings = getBalanceNumber(earningsBigNumber)
    earningsBusd = new BigNumber(earnings).multipliedBy(runePrice).toNumber()
    displayBalance = earnings.toLocaleString()
  }

  const [pendingTx, setPendingTx] = useState(false)
  const { address: account } = useWeb3()
  const { onReward } = useHarvest(pid)
  const { t } = useTranslation()
  const { currentFarmSymbol, nextFarmSymbol, currentFarmPaused } = useFarmStatus()

  const { countUp, update } = useCountUp({
    start: 0,
    end: earningsBusd,
    duration: 1,
    separator: ',',
    decimals: 3,
  })
  const updateValue = useRef(update)

  useEffect(() => {
    updateValue.current(earningsBusd)
  }, [earningsBusd, updateValue])

  return (
    <ActionContainer>
      <ActionTitles>
        <Title>{currentFarmSymbol} </Title>
        <Subtle>EARNED</Subtle>
      </ActionTitles>
      <ActionContent>
        <div>
          <Earned>{displayBalance}</Earned>
          <Staked>~{countUp}USD</Staked>
        </div>
        <Button
          disabled={!earnings || pendingTx || !account}
          onClick={async () => {
            setPendingTx(true)
            await onReward()
            setPendingTx(false)
          }}
          ml="4px"
        >
          {t('Harvest')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
