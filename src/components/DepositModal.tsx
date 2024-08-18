import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import { getBalanceNumber } from '~/utils/formatBalance'
import { Button } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import { Flex, LinkExternal } from '~/ui'
import useRuneBalance from '~/hooks/useRuneBalance'
import ModalActions from '~/components/ModalActions'
import { useFarmUser } from '~/state/hooks'
import { useProfile } from '~/state/hooks'
import TokenInput from '~/components/TokenInput'
import { useTranslation } from 'react-i18next'
import { getFullDisplayBalance } from '~/utils/formatBalance'
import { getNativeAddress, getRuneAddress } from '~/utils/addressHelpers'
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { provider } from 'web3-core'
import useInventory from '~/hooks/useInventory'
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

interface DepositModalProps {
  max: BigNumber
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  farmPid?: number
  ethereum?: provider
  account?: string
  depositFeeBP?: number
}

const DepositModal: React.FC<DepositModalProps> = ({
  max,
  onConfirm,
  onDismiss,
  ethereum,
  account,
  farmPid,
  tokenName = '',
  depositFeeBP = 0,
}) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const { earnings } = useFarmUser(farmPid)
  const { t } = useTranslation()
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
  const harvestFeeTokenBalance = useRuneBalance(buffs.harvestFeeToken)
  const harvestFeeBalance = getBalanceNumber(harvestFeeTokenBalance)
  const harvestFee =
    getBalanceNumber(earnings) > 0 ? getBalanceNumber(earnings) * (buffs.harvestFeePercent / 100) * 1.05 : 0
  const [feeAllowance, setFeeAllowance] = useState(new BigNumber(0))
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { profile } = useProfile()

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
    submitType = 'harvest'
  } else if (!isFeeApproved) {
    submitText = 'Approve'
    submitType = 'approve'
  } else if (buffs.harvestFeePercent > 0 && harvestFeeBalance < harvestFee) {
    submitText = `${harvestFee.toFixed(10)} ${buffs.harvestFeeToken} REQUIRED`
    submitType = 'needfee'
  } else {
    submitText = 'Confirm'
    submitType = 'harvest'
  }

  return (
    <Modal title={`${t('Deposit')} ${tokenName} Tokens`} onDismiss={onDismiss}>
      {harvestFee > 0 ? (
        <StyledMaxText>
          Deposit will harvest your rewards. <br />
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
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
        depositFeeBP={depositFeeBP}
      />
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss}>
          {t('Cancel')}
        </Button>
        <Button
          disabled={submitType === 'pending' || submitType === 'needfee'}
          onClick={async () => {
            setPendingTx(true)
            if (submitType === 'harvest') {
              await onConfirm(val)
              setPendingTx(false)
              onDismiss()
            } else if (submitType === 'approve') {
              await onApproveFeeToken()
              setPendingTx(false)
            }
          }}
        >
          {submitText}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default DepositModal
