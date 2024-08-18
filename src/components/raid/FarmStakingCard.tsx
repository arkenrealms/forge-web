import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button, AutoRenewIcon } from '~/ui'
import useWeb3 from '~/hooks/useWeb3'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import useInventory from '~/hooks/useInventory'
import { useAllHarvest } from '~/hooks/useHarvest'
import useFarmsWithBalance from '~/hooks/useFarmsWithBalance'
import UnlockButton from '~/components/UnlockButton'
import { Text } from '~/ui'
import useAllEarnings from '~/hooks/useAllEarnings'
import useRuneBalance from '~/hooks/useRuneBalance'
import { getBalanceNumber } from '~/utils/formatBalance'
import { useRunePrice } from '~/state/hooks'
import { Flex, LinkExternal } from '~/ui'
import { provider } from 'web3-core'
import { getRuneContract } from '~/utils/erc20'
import { getMasterChefAddress } from '~/utils/addressHelpers'
import { useFarmStatus } from '~/hooks/useFarmStatus'
import { useApprove } from '~/hooks/useApprove'
import { useMasterchef } from '~/hooks/useContract'
import CardValue from './CardValue'
import CardBusdValue from './CardBusdValue'
import RuneHarvestBalance from './RuneHarvestBalance'
import RuneWalletBalance from './RuneWalletBalance'

const StyledFarmStakingCard = styled(Card)``

const Block = styled.div`
  margin-bottom: 16px;
`

const CardImage = styled.img`
  margin-bottom: 16px;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`

const Actions = styled.div`
  margin-top: 24px;
`

const WalletBalance = ({ symbol }) => {
  const { t } = useTranslation()
  const balance = useRuneBalance(symbol)
  const busdBalance = new BigNumber(getBalanceNumber(balance)).multipliedBy(useRunePrice(symbol)).toNumber()
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
      <CardValue value={getBalanceNumber(balance)} decimals={4} fontSize="24px" lineHeight="36px" />
      <CardBusdValue value={busdBalance} />
    </>
  )
}

const StyledMaxText = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-size: 14px;
  font-weight: 700;
  line-height: 22px;
  justify-content: flex-end;
  font-style: italic;
`

const FarmedStakingCard = () => {
  const [pendingTx, setPendingTx] = useState(false)
  const { address: account } = useWeb3()
  const { web3 } = useWeb3()
  const { t } = useTranslation()
  const farmsWithBalance = useFarmsWithBalance()
  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)

  const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => farmWithBalance.pid))
  const { contract: masterChefContract } = useMasterchef()

  const { meta: buffs } = useInventory()
  const harvestFeeTokenBalance = useRuneBalance(buffs.harvestFeeToken)
  const harvestFeeBalance = getBalanceNumber(harvestFeeTokenBalance)
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { currentFarmSymbol, nextFarmSymbol, currentFarmPaused } = useFarmStatus()

  const allEarnings = useAllEarnings(currentFarmSymbol)
  const earnings = allEarnings.reduce((accum, earning) => {
    return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)
  const harvestFee = earnings > 0 ? earnings * (buffs.harvestFeePercent / 100) * 1.05 : 0
  const [feeAllowance, setFeeAllowance] = useState(new BigNumber(0))

  const rawEarningsBalance = earnings
  const isFeeApproved = buffs.harvestFeePercent === 0 || (account && feeAllowance && feeAllowance.isGreaterThan(0))

  const furyFeeTokenContract = useMemo(() => {
    return getRuneContract(web3 as provider, 'RAL')
  }, [web3])

  const { onApprove: onApproveFuryFeeToken } = useApprove(furyFeeTokenContract)

  const feeTokenContract = useMemo(() => {
    return getRuneContract(web3 as provider, buffs.harvestFeeToken)
  }, [web3, buffs.harvestFeeToken])

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

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    try {
      if (isFeeApproved) {
        await onReward()
      } else {
        await handleApprove()
      }
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [onReward, handleApprove, isFeeApproved])

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

  const harvestAllFarmsMagic = useCallback(async () => {
    setPendingTx(true)
    try {
      if (isFeeApproved) {
        await masterChefContract.methods
          .harvestAll()
          .send({ from: account })
          .on('transactionHash', (tx) => {
            return tx.transactionHash
          })
      } else {
        await handleApprove()
      }
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [account, handleApprove, isFeeApproved, masterChefContract])

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
    <StyledFarmStakingCard>
      <CardBody>
        <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <Heading size="xl" mb="24px" color="white">
            {t('Raid Staking')}
          </Heading>
        </Flex>
        <Block>
          <Label>{t(currentFarmSymbol + ' to Harvest')}:</Label>
          <RuneHarvestBalance symbol={currentFarmSymbol} />
        </Block>
        <Block>
          <Label>{t(currentFarmSymbol + ' in Wallet')}:</Label>
          <WalletBalance symbol={currentFarmSymbol} />
        </Block>
        {/* <Block>
          <Label>{t('HEL in Wallet')}:</Label>
          <WalletBalance symbol="HEL" />
        </Block>
        <Block>
          <Label>{t('DOL in Wallet')}:</Label>
          <WalletBalance symbol="DOL" />
        </Block>
        <Block>
          <Label>{t('SHAEL in Wallet')}:</Label>
          <WalletBalance symbol="SHAEL" />
        </Block>
        <Block>
          <Label>{t('SOL in Wallet')}:</Label>
          <WalletBalance symbol="SOL" />
        </Block>
        <Block>
          <Label>{t('AMN in Wallet')}:</Label>
          <WalletBalance symbol="AMN" />
        </Block>
        <Block>
          <Label>{t('THUL in Wallet')}:</Label>
          <WalletBalance symbol="THUL" />
        </Block>
        <Block>
          <Label>{t('ORT in Wallet')}:</Label>
          <WalletBalance symbol="ORT" />
        </Block>
        <Block>
          <Label>{t('RAL in Wallet')}:</Label>
          <WalletBalance symbol="RAL" />
        </Block>
        <Block>
          <Label>{t('TAL in Wallet')}:</Label>
          <WalletBalance symbol="TAL" />
        </Block>
        <Block>
          <Label>{t('ITH in Wallet')}:</Label>
          <WalletBalance symbol="ITH" />
        </Block>
        <Block>
          <Label>{t('NEF in Wallet')}:</Label>
          <WalletBalance symbol="NEF" />
        </Block>
        <Block>
          <Label>{t('TIR in Wallet')}:</Label>
          <WalletBalance symbol="TIR" />
        </Block>
        <Block>
          <Label>{t('ELD in Wallet')}:</Label>
          <WalletBalance symbol="ELD" />
        </Block>
        <Block>
          <Label>{t('EL in Wallet')}:</Label>
          <WalletBalance symbol="EL" />
        </Block> */}
        <Block>
          <Label>{t('RUNE in Wallet')}:</Label>
          <RuneWalletBalance symbol="RUNE" />
        </Block>
        <Block>
          <Label>{t('RXS in Wallet')}:</Label>
          <RuneWalletBalance symbol="RXS" />
        </Block>
        {harvestFeeBalance < harvestFee ? (
          <StyledMaxText>
            Harvesting requires {harvestFee.toFixed(10)} {buffs.harvestFeeToken} for the fee.
          </StyledMaxText>
        ) : null}
        {harvestFeeBalance < harvestFee ? (
          <Flex mt="10px" mb="20px" justifyContent="space-between" alignItems="center">
            <div></div>
            <RouterLink to="/swap">{t(`Buy ${harvestFee.toFixed(10)} ${buffs.harvestFeeToken}`)}</RouterLink>
            <div></div>
          </Flex>
        ) : null}

        <Actions>
          {account ? (
            <Button
              id="harvest-all"
              disabled={harvestFeeBalance < harvestFee || balancesWithValue.length <= 0 || pendingTx}
              onClick={harvestAllFarms}
              width="100%"
              endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : undefined}
            >
              {!isFeeApproved ? `Approve ${buffs.harvestFeeToken} Fee To Harvest` : null}
              {isFeeApproved
                ? t(pendingTx ? 'Collecting ' + currentFarmSymbol : `Harvest all (${balancesWithValue.length})`)
                : null}
            </Button>
          ) : (
            <UnlockButton width="100%" />
          )}
          {/* <br />
          <br />
          {account && isFeeApproved && !pendingTx ? (
            <Button
              id="harvest-all-magic"
              disabled={harvestFeeBalance < harvestFee || balancesWithValue.length <= 0 || pendingTx}
              onClick={harvestAllFarmsMagic}
              width="100%"
              endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : undefined}
            >
              {!isFeeApproved ? `Approve ${buffs.harvestFeeToken} Fee To Harvest` : null}
              {isFeeApproved
                ? TranslateString(
                    548,
                    pendingTx ? 'Collecting ' + currentFarmSymbol : `All (${balancesWithValue.length}) at once (expensive)`,
                  )
                : null}
            </Button>
          ) : null} */}
        </Actions>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default FarmedStakingCard
