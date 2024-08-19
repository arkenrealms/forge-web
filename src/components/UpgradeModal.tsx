import React, { useState } from 'react';
import styled from 'styled-components';
import { ethers, BigNumber } from 'ethers';
import Web3 from 'web3';
import { decodeItem } from '@arken/node/util/decoder';
import { Button, Input, Text } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import { useToast } from '~/state/hooks';
import { Nft } from '~/config/constants/types';
import useI18n from '~/hooks/useI18n';
import useWeb3 from '~/hooks/useWeb3';
import { useTranslation } from 'react-i18next';
import { useArcaneItems } from '~/hooks/useContract';
import useGetWalletNfts from '~/hooks/useGetWalletItems';

interface UpgradeModalProps {
  tokenId: string;
  onSuccess: () => any;
  onDismiss?: () => void;
}

const Value = styled(Text)`
  font-weight: 600;
`;

const ModalContent = styled.div`
  margin-bottom: 16px;
`;

const InfoRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text};
  display: block;
  margin-bottom: 8px;
  margin-top: 24px;
`;

const UpgradeModal: React.FC<UpgradeModalProps> = ({ tokenId, onSuccess, onDismiss }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const { address: account } = useWeb3();
  const arcaneItemsContract = useArcaneItems();
  const { toastSuccess } = useToast();
  const { refresh } = useGetWalletNfts();

  const item = decodeItem(tokenId);

  const handleConfirm = async () => {
    try {
      const isValidAddress = Web3.utils.isAddress(value);

      if (!isValidAddress) {
        setError(t('Please enter a valid wallet address'));
      } else {
        await arcaneItemsContract.methods
          .transferFrom(account, value, ethers.utils.hexlify(BigNumber.from(tokenId)))
          .send({ from: account })
          .on('sending', () => {
            setIsLoading(true);
          })
          .on('receipt', () => {
            refresh();
            onDismiss();
            onSuccess();
            toastSuccess('Item successfully transferred!');
          })
          .on('error', () => {
            console.error(error);
            setError('Unable to transfer item');
            setIsLoading(false);
          });
      }
    } catch (err) {
      console.error('Unable to transfer item:', err);
    }
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target;
    setValue(inputValue);
  };

  return (
    <Modal title={t('Upgrade Item')} onDismiss={onDismiss}>
      <ModalContent>
        {error && (
          <Text color="failure" mb="8px">
            {error}
          </Text>
        )}
        {/* <InfoRow>
          <Text>{t('Transferring')}: </Text>
          <Value>{item.name}</Value>
        </InfoRow> */}
        {/* <Label htmlFor="transferAddress">{t('Receiving address')}:</Label> */}
        {/* <Input
          id="transferAddress"
          name="address"
          type="text"
          placeholder={t('Paste address')}
          value={value}
          onChange={handleChange}
          isWarning={error}
          disabled={isLoading}
        /> */}
        <Button width="100%" onClick={handleConfirm} disabled={!account || isLoading}>
          {t('Convert To Latest Item Format')}
        </Button>
        <br />
        <br />
        <Button disabled width="100%">
          {t('Transmute (Coming Soon)')}
        </Button>
      </ModalContent>
      <Actions>
        <Button width="100%" variant="secondary" onClick={onDismiss}>
          {t('Cancel')}
        </Button>
      </Actions>
    </Modal>
  );
};

export default UpgradeModal;
