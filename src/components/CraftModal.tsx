import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { InjectedModalProps, Modal } from '~/components/Modal'
import useWeb3 from '~/hooks/useWeb3'
import { useToast } from '~/state/hooks'
import { Button, Flex, Text } from '~/ui'

interface CraftModalProps extends InjectedModalProps {
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

const CraftModal: React.FC<CraftModalProps> = ({ onSuccess, onDismiss }) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const { t } = useTranslation()
  const { address: account } = useWeb3()
  const { toastError, toastSuccess } = useToast()

  const handleConfirm = async () => {
    // characterFactoryContract.methods
    //   .mintNFT(nft.characterId)
    //   .send({ from: account })
    //   .on('sending', () => {
    //     setIsConfirming(true)
    //   })
    //   .on('receipt', () => {
    //     toastSuccess('Successfully created!')
    //     onDismiss()
    //     onSuccess()
    //   })
    //   .on('error', (error) => {
    //     console.error('Unable to create NFT', error)
    //     toastError('Error', 'Unable to create NFT, please try again.')
    //     setIsConfirming(false)
    //   })
  }

  return (
    <Modal title={t('Craft')} onDismiss={onDismiss}>
      <ModalContent>
        <Flex alignItems="center" mb="8px" justifyContent="start">
          <Text>{t('Coming soon')}</Text>
        </Flex>
      </ModalContent>
      <Actions>
        <Button width="100%" variant="secondary" onClick={onDismiss}>
          {t('Cancel')}
        </Button>
        <Button width="100%" onClick={handleConfirm} disabled={true || !account || isConfirming}>
          {t('Confirm')}
        </Button>
      </Actions>
    </Modal>
  )
}

export default CraftModal
