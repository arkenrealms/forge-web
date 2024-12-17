import React, { useState } from 'react';
import styled from 'styled-components';
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { useArcaneItems, useMarketContract, useCharacterFactory } from '~/hooks/useContract';
import { useToast } from '~/state/hooks';
import { Button, Text, Flex, Input } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import { Nft } from '~/config/constants/types';
import useApproveConfirmTransaction from '~/hooks/useApproveConfirmTransaction';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import { ItemCategoriesType, ItemType } from '@arken/node/legacy/data/items.type';
import useGetWalletItems from '~/hooks/useGetWalletItems';
import useWeb3 from '~/hooks/useWeb3';
import { getContractAddress } from '~/utils/addressHelpers';
import ApproveConfirmButtons from '~/components/account/ApproveConfirmButtons';
import NumericalInput from './NumericalInput';

interface TradeModalProps extends InjectedModalProps {
  item: ItemType;
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

const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 1;
  width: 100%;
`;
const InputContainer = styled.div`
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme }) => theme.shadows.inset};
`;

const InputRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0.75rem 0.75rem 0.75rem 1rem;
`;

const TradeModal: React.FC<TradeModalProps> = ({ item, onSuccess, onDismiss }) => {
  const { t } = useTranslation();
  const { address: account } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const { toastError, toastSuccess } = useToast();
  const [error, setError] = useState(null);
  const [buyableAt, setBuyableAt] = useState(new Date());
  const [price, setPrice] = useState('');
  const [buyer, setBuyer] = useState('');
  // const characterFactoryContract = useCharacterFactory()
  const marketContract = useMarketContract();
  const arcaneItemsContract = useArcaneItems();
  const { refresh } = useGetWalletItems();
  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        try {
          const response = await arcaneItemsContract.methods.getApproved(item.tokenId).call();
          if (response === getContractAddress('market')) return true;

          const response2 = await arcaneItemsContract.methods
            .isApprovedForAll(account, getContractAddress('market'))
            .call(); // setApprovalForAll/isApprovedForAll

          return response2;
        } catch (e) {
          return false;
        }
      },
      onApprove: () => {
        return arcaneItemsContract.methods
          .setApprovalForAll(getContractAddress('market'), true)
          .send({ from: account });
      },
      onConfirm: () => {
        console.log(
          buyer,
          ethers.utils.hexlify(ethers.BigNumber.from(item.tokenId)),
          ethers.utils.parseEther(price),
          buyableAt.getTime() / 1000 + ''
        );

        const now = new Date();
        // console.log('vvvv', buyableAt.getTime() > now.getTime())
        if (buyableAt.getTime() > now.getTime()) {
          console.log('listTimelocked');
          return marketContract.methods
            .listTimelocked(
              buyer || '0x0000000000000000000000000000000000000000',
              item.tokenId,
              ethers.utils.parseEther(price),
              buyableAt.getTime() / 1000
            )
            .send({ from: account });
        }
        return marketContract.methods
          .list(buyer || '0x0000000000000000000000000000000000000000', item.tokenId, ethers.utils.parseEther(price))
          .send({ from: account });
      },
      onSuccess: () => {
        refresh();

        toastSuccess(`Item listed. Check back in a few minutes.`);

        onDismiss();
      },
    });

  const handleChangeBuyer = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target;
    const isValidAddress = Web3.utils.isAddress(inputValue);

    if (!isValidAddress) {
      setError(t('Please enter a valid wallet address'));
      return;
    }

    setError(null);
    setBuyer(inputValue);
  };

  return (
    <Modal title={t('Trade')} onDismiss={onDismiss}>
      {item.category === ItemCategoriesType.RUNE ? (
        <>
          <ModalContent>
            <Text color="failure" mb="16px">
              <a href="/swap">Click here to swap.</a>
            </Text>
          </ModalContent>
        </>
      ) : (
        <>
          <ModalContent>
            <Text>{t('Price (RXS)')}</Text>

            <Flex flexDirection="column" alignItems="center" justifyContent="center" mb="10px">
              <InputPanel>
                <InputContainer>
                  <InputRow style={{}}>
                    <>
                      <NumericalInput
                        value={price}
                        onUserInput={(val) => {
                          setPrice(val);
                        }}
                      />
                    </>
                  </InputRow>
                </InputContainer>
              </InputPanel>
            </Flex>
            <br />
            <Text>{t('Buyer Address (Optional)')}</Text>

            <Flex flexDirection="column" alignItems="center" justifyContent="center" mb="10px">
              <InputPanel>
                <InputContainer>
                  <InputRow style={{}}>
                    <>
                      <Input
                        id="transferAddress"
                        name="address"
                        type="text"
                        placeholder={t('Paste address')}
                        value={buyer}
                        onChange={handleChangeBuyer}
                        isWarning={error}
                        disabled={isLoading}
                        style={{ textTransform: 'none', background: '0 none', padding: 0, height: 'auto' }}
                      />
                    </>
                  </InputRow>
                </InputContainer>
              </InputPanel>
            </Flex>
            <br />
            <Text>{t('Start Date (Optional)')}</Text>

            <Flex flexDirection="column" alignItems="center" justifyContent="center" mb="10px">
              <InputPanel>
                <InputContainer>
                  <InputRow style={{}}>
                    <>
                      <DateTimePicker
                        onChange={setBuyableAt}
                        value={buyableAt}
                        disableClock
                        clearIcon={null}
                        calendarIcon={null}
                      />
                    </>
                  </InputRow>
                </InputContainer>
              </InputPanel>
            </Flex>
            <br />

            <Text>
              <em>Fee: 5% (after sale)</em>
            </Text>
            <br />
          </ModalContent>
          <Actions>
            <ApproveConfirmButtons
              isApproveDisabled={error || !price || isConfirmed || isConfirming || isApproved}
              isApproving={isApproving}
              isConfirmDisabled={error || !price || !isApproved || isConfirmed}
              isConfirming={isConfirming}
              onApprove={handleApprove}
              onConfirm={handleConfirm}
            />
          </Actions>
        </>
      )}
    </Modal>
  );
};

export default TradeModal;
