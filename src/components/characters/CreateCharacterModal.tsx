import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '~/utils/formatBalance'
import { useCharacterFactory, useRxs } from '~/hooks/useContract'
import useHasRuneBalance from '~/hooks/useHasRuneBalance'
import useWeb3 from '~/hooks/useWeb3'
import { useToast } from '~/state/hooks'
import { Button, Text, Flex, AutoRenewIcon } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import { Nft } from '~/config/constants/types'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import { getCharacterFactoryAddress } from '~/utils/addressHelpers'
import { PurchaseModal } from '~/components/PurchaseModal'
import { useConfig } from '~/hooks/useConfig'

interface ClaimNftModalProps extends InjectedModalProps {
  nft: Nft
  onSuccess: () => void
}

const ModalContent = styled.div`
  margin-bottom: 16px;
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`
// const maximumRuneBalanceToMint = new BigNumber(10).multipliedBy(new BigNumber(10).pow(18))

const ClaimNftModal: React.FC<ClaimNftModalProps> = ({ nft, onSuccess, onDismiss }) => {
  const { mintCost, registerCost } = useConfig()
  const [isConfirming, setIsConfirming] = useState(false)
  const [onPresentPurchaseModal] = useModal(
    <PurchaseModal defaultAmount={mintCost + registerCost + ''} onSuccess={() => {}} />
  )
  const { t } = useTranslation()
  const [isApproved, setIsApproved] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const { address: account } = useWeb3()
  const { toastError, toastSuccess } = useToast()
  const runeContract = useRxs()
  const characterFactoryContract = useCharacterFactory()
  const minimumRuneBalanceToMint = new BigNumber(mintCost + registerCost).multipliedBy(new BigNumber(10).pow(18))
  const hasMinimumRuneRequired = useHasRuneBalance(minimumRuneBalanceToMint)

  const handleConfirm = async () => {
    characterFactoryContract.methods
      .mintNFT(nft.characterId)
      .send({ from: account })
      .on('sending', () => {
        setIsConfirming(true)
      })
      .on('receipt', () => {
        toastSuccess('Successfully created!')
        onDismiss()
        onSuccess()
      })
      .on('error', (error) => {
        console.error('Unable to create NFT', error)
        toastError('Error', 'Unable to create NFT, please try again.')
        setIsConfirming(false)
      })
  }

  const handleApprove = () => {
    runeContract.methods
      .approve(getCharacterFactoryAddress(), ethers.constants.MaxUint256)
      .send({ from: account })
      .on('sending', () => {
        setIsApproving(true)
      })
      .on('receipt', () => {
        setIsApproving(false)
        setIsApproved(true)
      })
      .on('error', (error) => {
        toastError('Error', error?.message)
        setIsApproving(false)
      })
  }

  useEffect(() => {
    const fetchAllowance = async () => {
      if (!account) return

      const res = await runeContract.methods.allowance(account, getCharacterFactoryAddress()).call()

      if (res && getBalanceNumber(new BigNumber(res)) >= mintCost + registerCost) {
        setIsApproved(true)
      }
    }

    if (account) {
      fetchAllowance()
    }
    const refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, runeContract, mintCost, registerCost])

  return (
    <Modal title={t('Create Character')} onDismiss={onDismiss}>
      <ModalContent>
        <Flex alignItems="center" mb="8px" justifyContent="start">
          <Text>{t('You are creating the')}:</Text>
          <Text>&nbsp;</Text>
          <Text bold>{nft.name}</Text>
        </Flex>
        {hasMinimumRuneRequired && (
          <Text as="p" mb="16px" color="failure">
            {t(`Cost: ${mintCost + registerCost} RXS`, { num: mintCost + registerCost })}
          </Text>
        )}
        {!hasMinimumRuneRequired && (
          <Text color="failure" mb="16px">
            {t(`${mintCost + registerCost} RXS fee is required.`)}{' '}
            <Button scale="sm" onClick={onPresentPurchaseModal}>
              Buy RXS
            </Button>
          </Text>
        )}
      </ModalContent>
      <Actions>
        {/* <Button width="100%" variant="secondary" onClick={onDismiss}>
          {t('Cancel')}
        </Button> */}
        <Button
          isLoading={isApproving}
          disabled={isApproved || isApproving}
          onClick={handleApprove}
          endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : undefined}
        >
          {t('Approve')}
        </Button>
        <Button
          width="100%"
          onClick={handleConfirm}
          disabled={!account || !isApproved || isConfirming}
          endIcon={isConfirming ? <AutoRenewIcon spin color="currentColor" /> : undefined}
        >
          {t('Confirm')}
        </Button>
      </Actions>
    </Modal>
  )
}

export default ClaimNftModal
