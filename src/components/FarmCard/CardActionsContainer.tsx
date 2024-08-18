import React, { useMemo, useState, useCallback, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { provider } from 'web3-core'
import { getContract } from '~/utils/erc20'
// import { useERC20 } from './useContract'
import { Button, Flex, Text, HelpIcon } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import { Farm } from '~/state/types'
import { getBalanceNumber } from '~/utils/formatBalance'
import { useFarmFromPid, useFarmFromSymbol, useFarmUser } from '~/state/hooks'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import UnlockButton from '~/components/UnlockButton'
import { useFarmStatus } from '~/hooks/useFarmStatus'
import { useApprove } from '~/hooks/useApprove'

import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'
import TransferRaidModal from '../TransferRaidModal'

const Action = styled.div`
  padding-top: 16px;
`
export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  ethereum?: provider
  account?: string
  harvestFee?: number
  hasPreviousEarnings?: boolean
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, ethereum, account, harvestFee, hasPreviousEarnings }) => {
  const { t } = useTranslation()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses, tokenAddresses, isTokenOnly, depositFeeBP } = useFarmFromPid(farm.pid)
  const { allowance, tokenBalance, stakedBalance, earnings } = useFarmUser(pid)

  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const tokenAddress = tokenAddresses[process.env.REACT_APP_CHAIN_ID]
  const lpName = farm.lpSymbol.toUpperCase()
  const isApproved = account && allowance && allowance.isGreaterThan(0)
  const [feeAllowance, setFeeAllowance] = useState(new BigNumber(0))
  const { currentFarmSymbol, nextFarmSymbol, currentFarmPaused } = useFarmStatus()
  // const isFeeApproved = account && feeAllowance && feeAllowance.isGreaterThan(0)
  // const { address: account } = useWeb3()

  const lpContract = useMemo(() => {
    if (isTokenOnly) {
      return getContract(ethereum as provider, tokenAddress)
    }
    return getContract(ethereum as provider, lpAddress)
  }, [ethereum, lpAddress, tokenAddress, isTokenOnly])

  const { onApprove } = useApprove(lpContract)
  // console.log('mmmm', farm.pid, farm, { allowance, tokenBalance, stakedBalance, earnings })
  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={lpName}
        pid={pid}
        depositFeeBP={depositFeeBP}
        ethereum={ethereum}
        account={account}
        showDeposit={!farm.isHiddenPool}
        isRetired={farm.isRetired}
      />
    ) : (
      <Button mt="8px" disabled={requestedApproval} onClick={handleApprove}>
        Approve Contract
      </Button>
    )
  }

  const [onPresentTransfer] = useModal(
    <TransferRaidModal max={stakedBalance} farmPid={pid} ethereum={ethereum} account={account} />
  )

  return (
    <Action>
      <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="3px">
          {lpName}
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Staked')}
        </Text>
      </Flex>
      {!account ? <UnlockButton mt="8px" fullWidth /> : renderApprovalOrStakeButton()}
      <Flex mt="10px">
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="3px">
          {/* TODO: Is there a way to get a dynamic value here from useFarmFromSymbol? */}
          {currentFarmSymbol}
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Earned')}
        </Text>
      </Flex>
      {/* {!farm.isHiddenPool ? ( */}
      <HarvestAction
        earnings={earnings}
        pid={pid}
        harvestFee={harvestFee}
        ethereum={ethereum}
        account={account}
        hasPreviousEarnings={hasPreviousEarnings}
      />
      {/* ) : null} */}
      {/* 
      {account && farm.isFinished && getBalanceNumber(stakedBalance) > 0 ? (
        <>
          <Button onClick={onPresentTransfer}>{t(`Transfer To Latest`)}</Button>
        </>
      ) : null} */}
    </Action>
  )
}

export default CardActions
