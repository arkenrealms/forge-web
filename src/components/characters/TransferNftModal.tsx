import React, { useState } from 'react'
import styled from 'styled-components'
import Web3 from 'web3'
import { Button, Text } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import Input from '~/components/Input/Input'
import { useToast } from '~/state/hooks'
import { Nft } from '~/config/constants/types'
import useI18n from '~/hooks/useI18n'
import useWeb3 from '~/hooks/useWeb3'
import { useTranslation } from 'react-i18next'
import { useCharacters } from '~/hooks/useContract'
import useGetWalletNfts from '~/hooks/useGetWalletItems'
import InfoRow from './InfoRow'

interface TransferNftModalProps {
  nft: Nft
  tokenIds: number[]
  onSuccess: () => any
  onDismiss?: () => void
}

const Value = styled(Text)`
  font-weight: 600;
`

const ModalContent = styled.div`
  margin-bottom: 16px;
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text};
  display: block;
  margin-bottom: 8px;
  margin-top: 24px;
`

const TransferNftModal: React.FC<TransferNftModalProps> = ({ nft, tokenIds, onSuccess, onDismiss }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState(null)
  const { t } = useTranslation()
  const { address: account } = useWeb3()
  const arcaneCharactersContract = useCharacters()
  const { toastSuccess } = useToast()
  const { refresh } = useGetWalletNfts()

  const handleConfirm = async () => {
    try {
      const isValidAddress = Web3.utils.isAddress(value)

      if (!isValidAddress) {
        setError(t('Please enter a valid wallet address'))
      } else {
        await arcaneCharactersContract.methods
          .transferFrom(account, value, tokenIds[0])
          .send({ from: account })
          .on('sending', () => {
            setIsLoading(true)
          })
          .on('receipt', () => {
            refresh()
            onDismiss()
            onSuccess()
            toastSuccess('Character successfully transferred!')
          })
          .on('error', () => {
            console.error(error)
            setError('Unable to transfer character')
            setIsLoading(false)
          })
      }
    } catch (err) {
      console.error('Unable to transfer character:', err)
    }
  }

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target
    setValue(inputValue)
  }

  return (
    <Modal title={t('Transfer Character (NFT)')} onDismiss={onDismiss}>
      <ModalContent>
        {error && (
          <Text color="failure" mb="8px">
            {error}
          </Text>
        )}
        <InfoRow>
          <Text>{t('Transferring')}: </Text>
          <Value>{nft.name}</Value>
        </InfoRow>
        <Label htmlFor="transferAddress">{t('Receiving address')}:</Label>
        <Input
          id="transferAddress"
          name="address"
          type="text"
          placeholder={t('Paste address')}
          value={value}
          onChange={handleChange}
          isWarning={error}
          disabled={isLoading}
        />
      </ModalContent>
      <Actions>
        <Button width="100%" variant="secondary" onClick={onDismiss}>
          {t('Cancel')}
        </Button>
        <Button width="100%" onClick={handleConfirm} disabled={!account || isLoading || !value}>
          {t('Confirm')}
        </Button>
      </Actions>
    </Modal>
  )
}

export default TransferNftModal
