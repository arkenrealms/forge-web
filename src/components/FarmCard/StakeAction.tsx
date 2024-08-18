import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, IconButton, AddIcon, MinusIcon } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import useStake from '~/hooks/useStake'
import { provider } from 'web3-core'
import useUnstake from '~/hooks/useUnstake'
import { getBalanceNumber } from '~/utils/formatBalance'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'

interface FarmCardActionsProps {
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string
  pid?: number
  ethereum?: provider
  account?: string
  depositFeeBP?: number
  showDeposit?: boolean
  isRetired?: boolean
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<FarmCardActionsProps> = ({
  ethereum,
  account,
  stakedBalance,
  tokenBalance,
  tokenName,
  pid,
  depositFeeBP,
  showDeposit = true,
  isRetired = false,
}) => {
  const { t } = useTranslation()
  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayBalance = rawStakedBalance.toLocaleString()

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={onStake}
      tokenName={tokenName}
      depositFeeBP={depositFeeBP}
      farmPid={pid}
      ethereum={ethereum}
      account={account}
    />
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={onUnstake}
      tokenName={tokenName}
      farmPid={pid}
      ethereum={ethereum}
      account={account}
    />
  )

  const renderStakingButtons = () => {
    if (!showDeposit) {
      return (
        <IconButtonWrapper>
          <IconButton variant="tertiary" onClick={onPresentWithdraw} mr="6px">
            <MinusIcon color="primary" />
          </IconButton>
        </IconButtonWrapper>
      )
    }

    return rawStakedBalance === 0 ? (
      <Button onClick={onPresentDeposit}>{t('Stake')}</Button>
    ) : (
      <IconButtonWrapper>
        <IconButton variant="tertiary" onClick={onPresentWithdraw} mr="6px">
          <MinusIcon color="primary" />
        </IconButton>
        {!isRetired ? (
          <IconButton variant="tertiary" onClick={onPresentDeposit}>
            <AddIcon color="primary" />
          </IconButton>
        ) : null}
      </IconButtonWrapper>
    )
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Heading color={rawStakedBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
      {renderStakingButtons()}
    </Flex>
  )
}

export default StakeAction
