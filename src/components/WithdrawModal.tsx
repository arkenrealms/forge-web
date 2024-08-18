import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Flex, LinkExternal } from '~/ui'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import { getBalanceNumber } from '~/utils/formatBalance'
import { useFarmUser } from '~/state/hooks'
import { Button } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import ModalActions from '~/components/ModalActions'
import useRuneBalance from '~/hooks/useRuneBalance'
import ModalInput from '~/components/ModalInput'
import { useTranslation } from 'react-i18next'
import useInventory from '~/hooks/useInventory'
import { useEmergencyWithdraw } from '~/hooks/useHarvest'
import { getNativeAddress, getRuneAddress } from '~/utils/addressHelpers'
import { getFullDisplayBalance } from '~/utils/formatBalance'
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { provider } from 'web3-core'
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

interface WithdrawModalProps {
  max: BigNumber
  farmPid: number
  ethereum?: provider
  account?: string
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  ethereum,
  account,
  onConfirm,
  onDismiss,
  farmPid,
  max,
  tokenName = '',
}) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
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
      fetchAllowance()
    }
    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, feeTokenContract])

  let submitType
  let submitText

  if (pendingTx) {
    submitText = t('Pending')
    submitType = 'pending'
  } else if (rawEarningsBalance === 0) {
    submitText = t('Confirm')
    submitType = 'confirm'
  } else if (!isFeeApproved) {
    submitText = 'Approve'
    submitType = 'approve'
  } else if (buffs.harvestFeePercent > 0 && harvestFeeBalance < harvestFee) {
    submitText = `${harvestFee.toFixed(10)} ${buffs.harvestFeeToken} REQUIRED`
    submitType = 'needfee'
  } else {
    submitText = t('Confirm')
    submitType = 'confirm'
  }

  return (
    <Modal title={t('Unstake tokens')} onDismiss={onDismiss}>
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
      <ModalInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
        inputTitle={t('Unstake')}
      />
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%">
          {t('Cancel')}
        </Button>
        <Button
          variant="secondary"
          style={{ border: 'none' }}
          disabled={pendingTx}
          onClick={async () => {
            if (window.confirm('Warning: Your rewards will be lost. Continue?')) {
              setPendingTx(true)
              await onWithdraw()
              setPendingTx(false)
              onDismiss()
            }
          }}
          width="100%"
        >
          Emergency Withdraw
        </Button>
        <div></div>
        <Button
          disabled={submitType === 'pending' || submitType === 'needfee'}
          onClick={async () => {
            setPendingTx(true)
            if (submitType === 'confirm') {
              await onConfirm(val)
              setPendingTx(false)
              onDismiss()
            } else if (submitType === 'approve') {
              await onApproveFeeToken()
              setPendingTx(false)
            }
          }}
          width="100%"
        >
          {submitText}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default WithdrawModal
