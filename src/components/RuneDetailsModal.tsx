import React, { useState } from 'react';
import styled from 'styled-components';
import { useToast } from '~/state/hooks';
import { Button, Text, Flex, LinkExternal } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import useWeb3 from '~/hooks/useWeb3';
import { useTranslation } from 'react-i18next';
import { ItemCategoriesType, ItemDetails, ItemType } from '@arken/node/data/items.type';

interface RuneDetailsModalProps extends InjectedModalProps {
  tokenAddress: string;
  item: ItemType;
  details?: ItemDetails;
  onSuccess: () => void;
}

const ModalContent = styled.div`
  margin-bottom: 16px;
`;

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`;

const RuneDetailsModal: React.FC<RuneDetailsModalProps> = ({ tokenAddress, details, item, onSuccess, onDismiss }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const { t } = useTranslation();
  const { address: account } = useWeb3();
  const { toastError, toastSuccess } = useToast();

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
  };

  return (
    <Modal title={t('Details')} onDismiss={onDismiss}>
      <ModalContent>
        {details
          ? Object.keys(details).map((key) => (
              <div key={key}>
                <Text mr="10px" bold>
                  {t(key)}:
                </Text>{' '}
                <Text>{details[key]}</Text>
                <br />
              </div>
            ))
          : null}
        <br />
        <br />
        {item.category === ItemCategoriesType.RUNE ? (
          <>
            {tokenAddress ? (
              <div>
                <Text mr="10px">{t('Contract: ')}</Text>
                <LinkExternal href={`https://bscscan.com/address/${tokenAddress}`}>{tokenAddress}</LinkExternal>
                <br />
                <Text mr="10px">{t('Chart: ')}</Text>
                <LinkExternal href={`https://dex.guru/token/${tokenAddress}-bsc`}>Dex.Guru</LinkExternal>
              </div>
            ) : (
              <Text mr="10px">{t('Not released yet.')}</Text>
            )}
          </>
        ) : null}
        <br />
        <br />
      </ModalContent>
      <Actions>
        <Button width="100%" variant="secondary" onClick={onDismiss}>
          {t('Back')}
        </Button>
        {/* <Button width="100%" onClick={handleConfirm} disabled={true || !account || isConfirming}>
          {t('Confirm')}
        </Button> */}
      </Actions>
    </Modal>
  );
};

export default RuneDetailsModal;
