import React, { useState } from 'react'
import styled from 'styled-components'
import { useCharacterSpecialContract } from '~/hooks/useContract'
import { useToast } from '~/state/hooks'
import useWeb3 from '~/hooks/useWeb3'
import { Button, Text, Flex } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import { Nft } from '~/config/constants/types'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'

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

const ClaimNftModal: React.FC<ClaimNftModalProps> = ({ nft, onSuccess, onDismiss }) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const { t } = useTranslation()
  const { address: account } = useWeb3()
  const { toastError, toastSuccess } = useToast()
  const characterSpecialContract = useCharacterSpecialContract()

  const handleConfirm = async () => {
    characterSpecialContract.methods
      .mintNFT(nft.characterId)
      .send({ from: account })
      .on('sending', () => {
        setIsConfirming(true)
      })
      .on('receipt', () => {
        toastSuccess('Successfully claimed!')
        onDismiss()
        onSuccess()
      })
      .on('error', (error) => {
        console.error('Unable to claim NFT', error)
        toastError('Error', 'Unable to claim NFT, please try again.')
        setIsConfirming(false)
      })
  }

  return (
    <Modal title={t('Claim Collectible')} onDismiss={onDismiss}>
      <ModalContent>
        <Flex alignItems="center" mb="8px" justifyContent="space-between">
          <Text>{t('You will receive')}:</Text>
          <Text bold>{`1x "${nft.name}" Collectible`}</Text>
        </Flex>
      </ModalContent>
      <Actions>
        <Button width="100%" variant="secondary" onClick={onDismiss}>
          {t('Cancel')}
        </Button>
        <Button width="100%" onClick={handleConfirm} disabled={!account || isConfirming}>
          {t('Confirm')}
        </Button>
      </Actions>
    </Modal>
  )
}

export default ClaimNftModal
