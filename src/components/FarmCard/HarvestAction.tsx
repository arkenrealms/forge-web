import React, { useState, useCallback, useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, LinkExternal } from '~/ui'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { provider } from 'web3-core'
import useInventory from '~/hooks/useInventory'
import { useHarvest } from '~/hooks/useHarvest'
import useRuneBalance from '~/hooks/useRuneBalance'
import { getContract } from '~/utils/erc20'
import { getMasterChefAddress } from '~/utils/addressHelpers'
import { useApprove } from '~/hooks/useApprove'
import { getNativeAddress, getRuneAddress } from '~/utils/addressHelpers'
import { getBalanceNumber } from '~/utils/formatBalance'

interface FarmCardActionsProps {
  earnings?: BigNumber
  harvestFee?: number
  ethereum?: provider
  account?: string
  pid?: number
  hasPreviousEarnings?: boolean
}

const Mod = styled.div`
  width: 100%;
  margin-bottom: 2px;
`

const HarvestAction: React.FC<FarmCardActionsProps> = ({
  earnings,
  ethereum,
  account,
  harvestFee,
  hasPreviousEarnings,
  pid,
}) => {
  const { t } = useTranslation()
  const [pendingTx, setPendingTx] = useState(false)
  const { onReward } = useHarvest(pid)
  const { meta: buffs } = useInventory()
  const harvestFeeTokenBalance = useRuneBalance(buffs.harvestFeeToken)
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [feeAllowance, setFeeAllowance] = useState(new BigNumber(0))

  const harvestFeeBalance = getBalanceNumber(harvestFeeTokenBalance)

  const rawEarningsBalance = Number.isNaN(getBalanceNumber(earnings)) ? 0 : getBalanceNumber(earnings)
  const displayBalance = (rawEarningsBalance - rawEarningsBalance * (buffs.harvestBurn / 100)).toLocaleString()
  const isFeeApproved = buffs.harvestFeePercent === 0 || (account && feeAllowance && feeAllowance.isGreaterThan(0))

  const feeTokenContract = useMemo(() => {
    return getContract(ethereum as provider, getRuneAddress(buffs.harvestFeeToken))
  }, [ethereum, buffs.harvestFeeToken])

  const { onApprove: onApproveFeeToken } = useApprove(feeTokenContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApproveFeeToken()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApproveFeeToken])

  useEffect(() => {
    const fetchAllowance = async () => {
      if (!account) return

      const res = await feeTokenContract.methods.allowance(account, getMasterChefAddress()).call()
      setFeeAllowance(new BigNumber(res))
    }

    if (account) {
      fetchAllowance()
    }
    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, feeTokenContract])

  return (
    <>
      <Flex mb="8px" justifyContent="space-between" alignItems="center">
        <Heading color={rawEarningsBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
        <Button
          disabled={harvestFeeBalance < harvestFee || rawEarningsBalance === 0 || pendingTx || requestedApproval}
          onClick={async () => {
            if (isFeeApproved) {
              setPendingTx(true)
              await onReward()
              setPendingTx(false)
            } else {
              await handleApprove()
            }
          }}
        >
          {t(rawEarningsBalance === 0 || isFeeApproved ? 'Harvest' : `Approve ${buffs.harvestFeeToken} Fee`)}
        </Button>
      </Flex>
      {harvestFeeBalance < harvestFee ? (
        <Flex mt="20px" justifyContent="space-between" alignItems="center">
          <div></div>
          <RouterLink to="/swap">{t(`Buy ${harvestFee.toFixed(10)} ${buffs.harvestFeeToken}`)}</RouterLink>
          <div></div>
        </Flex>
      ) : null}
      {/* <br />
      <div style={{ textAlign: 'left', fontSize: '0.8rem' }}>
        {buffs.harvestYield > 0 ? (
          <Mod>
            <strong>Yield:</strong> +{buffs.harvestYield}%
          </Mod>
        ) : null}
        {buffs.harvestBurn > 0 ? (
          <Mod>
            <strong>Burn:</strong> {buffs.harvestBurn}%
          </Mod>
        ) : null}
        {buffs.harvestFees
          ? Object.keys(buffs.harvestFees).map((key) => (
              <Mod key={key}>
                <strong>Fee:</strong> {buffs.harvestFees[key]}% {key}
              </Mod>
            ))
          : null}
        {buffs.feeReduction > 0 ? (
          <Mod>
            <strong>Reduced Fees:</strong> {buffs.feeReduction}%
          </Mod>
        ) : null}
        {buffs.chanceToSendHarvestToHiddenPool > 0 ? (
          <Mod>
            <strong>Chance To Send To Hidden Pool:</strong> {buffs.chanceToSendHarvestToHiddenPool}%
          </Mod>
        ) : null}
        {buffs.chanceToLoseHarvest > 0 ? (
          <Mod>
            <strong>Chance To Lose Harvest:</strong> {buffs.chanceToLoseHarvest}%
          </Mod>
        ) : null}
      </div> */}
    </>
  )
}

export default HarvestAction
