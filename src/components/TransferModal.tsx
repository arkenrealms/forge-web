import React, { useState } from 'react'
import styled from 'styled-components'
import { ethers, BigNumber } from 'ethers'
import Web3 from 'web3'
import { decodeItem } from 'rune-backend-sdk/build/util/item-decoder'
import { Button, Input, Text } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import { useToast } from '~/state/hooks'
import { Nft } from '~/config/constants/types'
import { getBep20Contract, getRuneContract } from '~/utils/contractHelpers'
import useI18n from '~/hooks/useI18n'
import useWeb3 from '~/hooks/useWeb3'
import { useTranslation } from 'react-i18next'
import { useArcaneItems } from '~/hooks/useContract'
import useGetWalletNfts from '~/hooks/useGetWalletItems'

interface TransferNftModalProps {
  tokenAddress: string
  tokenId: string
  symbol: string
  maxAmount: number
  onSuccess: () => any
  onDismiss?: () => void
}

const Value = styled(Text)`
  font-weight: 600;
`

const ModalContent = styled.div`
  margin-bottom: 16px;
`

const InfoRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
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

const TransferNftModal: React.FC<TransferNftModalProps> = ({
  tokenAddress,
  symbol,
  maxAmount,
  tokenId,
  onSuccess,
  onDismiss,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recipient, setRecipient] = useState(null)
  const [amount, setAmount] = useState(maxAmount + '')
  const { t } = useTranslation()
  const { address: account, web3 } = useWeb3()
  const arcaneItemsContract = useArcaneItems()
  const { toastSuccess } = useToast()
  const { refresh } = useGetWalletNfts()

  const item = decodeItem(tokenId)

  const handleConfirm = async () => {
    try {
      const isValidAddress = Web3.utils.isAddress(recipient)

      if (!isValidAddress) {
        setError(t('Please enter a valid wallet address'))
      } else if (tokenAddress) {
        console.log(tokenAddress, recipient, amount)
        const contract = getBep20Contract(tokenAddress, web3)
        const res = await contract.methods
          .transfer(recipient, ethers.utils.parseEther(amount + ''))
          .send({ from: account })

        if (res) {
          // onDismiss()
          onSuccess()
          toastSuccess('Rune successfully transferred!')
        } else {
          console.error(error)
          setError('Unable to transfer rune')
          setIsLoading(false)
        }
      } else {
        await arcaneItemsContract.methods
          .transferFrom(account, recipient, ethers.utils.hexlify(BigNumber.from(tokenId)))
          .send({ from: account })
          .on('sending', () => {
            setIsLoading(true)
          })
          .on('receipt', () => {
            refresh()
            // onDismiss()
            onSuccess()
            toastSuccess('Item successfully transferred!')
          })
          .on('error', () => {
            console.error(error)
            setError('Unable to transfer item')
            setIsLoading(false)
          })
      }
    } catch (err) {
      console.error('Unable to transfer item:', err)
    }
  }

  const handleChangeRecipient = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target
    setRecipient(inputValue)
  }

  const handleChangeAmount = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target
    setAmount(inputValue)
  }

  return (
    <Modal title={t('Transfer')} onDismiss={onDismiss}>
      <ModalContent>
        {error && (
          <Text color="failure" mb="8px">
            {error}
          </Text>
        )}
        <InfoRow>
          <Text>{t('Transferring')}: </Text>
          <Value>{item ? item.name : `${amount} ${symbol}`}</Value>
        </InfoRow>
        <Label htmlFor="transferAddress">{t('Receiving address')}:</Label>
        <Input
          id="transferAddress"
          name="address"
          type="text"
          placeholder={t('Paste address')}
          value={recipient}
          onChange={handleChangeRecipient}
          isWarning={error}
          disabled={isLoading}
        />
        {tokenAddress ? (
          <>
            <Label htmlFor="transferAmount">{t('Amount')}:</Label>
            <Input
              id="transferAmount"
              name="amount"
              type="text"
              placeholder={t('Amount to send')}
              value={amount}
              onChange={handleChangeAmount}
              isWarning={error}
              disabled={isLoading}
            />
          </>
        ) : null}
      </ModalContent>
      <Actions>
        <Button width="100%" variant="secondary" onClick={onDismiss}>
          {t('Cancel')}
        </Button>
        <Button width="100%" onClick={handleConfirm} disabled={!account || isLoading || !recipient}>
          {t('Confirm')}
        </Button>
      </Actions>
    </Modal>
  )
}

export default TransferNftModal
