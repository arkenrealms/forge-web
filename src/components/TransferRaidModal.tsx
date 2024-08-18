import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Flex, LinkExternal } from '~/ui'
import { getBalanceNumber } from '~/utils/formatBalance'
import { useFarmUser } from '~/state/hooks'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import ethers from 'ethers'
import { Button } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import ModalActions from '~/components/ModalActions'
import useRuneBalance from '~/hooks/useRuneBalance'
import { CURRENT_FARM_SYMBOL, CURRENT_FARM_PAUSED } from '~/config'
import ModalInput from '~/components/ModalInput'
import { useMasterchef } from '~/hooks/useContract'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import useUnstake from '~/hooks/useUnstake'
import useStake from '~/hooks/useStake'
import useInventory from '~/hooks/useInventory'
import { useEmergencyWithdraw } from '~/hooks/useHarvest'
import { getNativeAddress, getRuneAddress } from '~/utils/addressHelpers'
import { getFullDisplayBalance } from '~/utils/formatBalance'
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Heading } from '~/ui'
import { provider } from 'web3-core'
import { useHarvest } from '~/hooks/useHarvest'
import { getContract } from '~/utils/erc20'
import { getMasterChefAddress } from '~/utils/addressHelpers'
import { useApprove } from '~/hooks/useApprove'

const StyledMaxText = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-size: 14px;
  font-weight: 700;
  line-height: 22px;
  justify-content: flex-end;
  font-style: italic;
`

interface TransferRaidModalProps {
  max: BigNumber
  farmPid: number
  onDismiss?: () => void
  ethereum?: provider
  account?: string
}

const TransferRaidModal: React.FC<TransferRaidModalProps> = ({ ethereum, account, farmPid, onDismiss, max }) => {
  const { onStake } = useStake(farmPid)
  const { onUnstake } = useUnstake(farmPid)
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const [pendingTx2, setPendingTx2] = useState(false)
  const [transferAmount, setTransferAmount] = useState('0')
  const { t } = useTranslation()
  const { earnings } = useFarmUser(farmPid)
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal]
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const { meta: buffs } = useInventory()
  const { onWithdraw } = useEmergencyWithdraw(farmPid)
  const harvestFeeTokenBalance = useRuneBalance(buffs.harvestFeeToken)
  const harvestFeeBalance = getBalanceNumber(harvestFeeTokenBalance)
  const [requestedApproval, setRequestedApproval] = useState(false)
  const harvestFee =
    getBalanceNumber(earnings) > 0 ? getBalanceNumber(earnings) * (buffs.harvestFeePercent / 100) * 1.05 : 0
  const [feeAllowance, setFeeAllowance] = useState(new BigNumber(0))
  const { contract: masterChefContract, setChefKey, chefKey } = useMasterchef()

  const rawEarningsBalance = getBalanceNumber(earnings)
  const isFeeApproved = account && feeAllowance && feeAllowance.isGreaterThan(0)

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
      handleSelectMax()
      fetchAllowance()
      // onDismiss()
    }
    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, onDismiss, handleSelectMax, feeTokenContract])

  let submitType
  let submitText

  if (pendingTx) {
    submitText = t('Pending')
    submitType = 'pending'
  } else if (chefKey !== CURRENT_FARM_SYMBOL && rawEarningsBalance === 0) {
    submitText = t('Unstake')
    submitType = 'confirm'
  } else if (chefKey !== CURRENT_FARM_SYMBOL && !isFeeApproved) {
    submitText = 'Approve'
    submitType = 'approve'
  } else if (chefKey !== CURRENT_FARM_SYMBOL && buffs.harvestFeePercent > 0 && harvestFeeBalance < harvestFee) {
    submitText = `${harvestFee.toFixed(10)} ${buffs.harvestFeeToken} REQUIRED`
    submitType = 'needfee'
  } else if (chefKey === CURRENT_FARM_SYMBOL) {
    submitText = t('Unstaked')
    submitType = 'unstaked'
  } else {
    submitText = t('Unstake')
    submitType = 'confirm'
  }

  let submitType2
  let submitText2

  if (pendingTx2) {
    submitText2 = t('Pending')
    submitType2 = 'pending'
  } else if (chefKey === CURRENT_FARM_SYMBOL && rawEarningsBalance === 0) {
    submitText2 = t('Restake')
    submitType2 = 'confirm'
  } else if (chefKey === CURRENT_FARM_SYMBOL && !isFeeApproved) {
    submitText2 = 'Approve'
    submitType2 = 'approve'
  } else if (chefKey === CURRENT_FARM_SYMBOL && buffs.harvestFeePercent > 0 && harvestFeeBalance < harvestFee) {
    submitText2 = `${harvestFee.toFixed(10)} ${buffs.harvestFeeToken} REQUIRED`
    submitType2 = 'needfee'
  } else {
    submitText2 = t('Restake')
    submitType2 = 'confirm'
  }

  return (
    <Modal title={t('Transfer tokens')} onDismiss={onDismiss}>
      {harvestFee > 0 ? (
        <StyledMaxText>
          Unstake will harvest your rewards. <br />
          You will pay {harvestFee.toFixed(10)} {buffs.harvestFeeToken} for the fee.
        </StyledMaxText>
      ) : null}
      {harvestFeeBalance < harvestFee ? (
        <Flex mt="10px" mb="20px" justifyContent="space-between" alignItems="center">
          <div></div>
          <RouterLink to="/swap">{t(`Buy ${harvestFee.toFixed(10)} ${buffs.harvestFeeToken}`)}</RouterLink>
          <div></div>
        </Flex>
      ) : null}
      <p>Moving {fullBalance} LPs/Tokens to newest farm</p>
      <ModalActions>
        <Button variant="secondary" onClick={() => {}} width="100%">
          {t('Cancel')}
        </Button>
        <div></div>
        <Button
          disabled={chefKey === CURRENT_FARM_SYMBOL || submitType === 'pending' || submitType === 'needfee'}
          onClick={async () => {
            setPendingTx(true)
            if (submitType === 'confirm') {
              setTransferAmount(val)
              await onUnstake(val)
              setPendingTx(false)
              setChefKey(CURRENT_FARM_SYMBOL)
              //   onDismiss()
            } else if (submitType === 'approve') {
              await onApproveFeeToken()
              setPendingTx(false)
            }
          }}
          width="100%"
        >
          {submitText}
        </Button>
        <Button
          disabled={submitType !== 'unstaked' || submitType2 === 'pending' || submitType2 === 'needfee'}
          onClick={async () => {
            setPendingTx2(true)
            if (submitType2 === 'confirm') {
              await onStake(transferAmount)
              setPendingTx2(false)
              onDismiss()
            } else if (submitType2 === 'approve') {
              await onApproveFeeToken()
              setPendingTx2(false)
            }
          }}
          width="100%"
        >
          {submitText2}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default TransferRaidModal
