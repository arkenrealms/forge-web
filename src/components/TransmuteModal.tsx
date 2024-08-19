import React, { useState, useRef } from 'react';
import styled, { css, createGlobalStyle } from 'styled-components';
import useSound from 'use-sound';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import useInventory from '~/hooks/useInventory';
import { decodeItem } from '@arken/node/util/decoder';
import { useToast } from '~/state/hooks';
import Item from '~/components/Item';
import { useTranslation } from 'react-i18next';
import useApproveConfirmTransaction from '~/hooks/useApproveConfirmTransaction';
import { useArcaneItems, useMasterchef, useBarracks, useBlacksmith } from '~/hooks/useContract';
import { useProfile } from '~/state/hooks';
import { motion } from 'framer-motion';
import { getContractAddress } from '~/utils/addressHelpers';
import useGetWalletItems from '~/hooks/useGetWalletItems';
import useWeb3 from '~/hooks/useWeb3';
import ApproveConfirmButtons from './account/ApproveConfirmButtons';

interface TransmuteModalProps extends InjectedModalProps {
  tokenId: string;
  onSuccess: () => void;
}

const ModalContent = styled.div`
  margin-bottom: 16px;
`;

const Actions = styled.div``;

const ItemTitle = styled.div`
  color: #fff;
  font-size: 2.5rem;
`;
const ItemDescription = styled.div`
  font-style: italic;
  font-size: 0.9em;
  color: #bbb;
  margin-bottom: 10px;
  line-height: 20px;
`;

const TransmuteModal: React.FC<TransmuteModalProps> = ({ tokenId, onSuccess, onDismiss }) => {
  const { t } = useTranslation();
  const { address: account } = useWeb3();
  const { toastError, toastSuccess } = useToast();
  const arcaneItem = decodeItem(tokenId);
  const { equipment, refreshEquipment } = useInventory();
  const equipItem = decodeItem(tokenId);
  const arcaneItemsContract = useArcaneItems();
  const blacksmithContract = useBlacksmith();
  const { refresh } = useGetWalletItems();
  const [transmutedItem, setTransmutedItem] = useState(null);
  const [opened, setOpened] = useState(false);
  const [transmuting, setTransmuting] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [playActionSound] = useSound('/assets/sounds/action.mp3');
  const [playFoundSound] = useSound('/assets/sounds/found.mp3', { volume: 0.1 });

  let slotId = equipItem.slots[0]; //mapIdToSlot[equipItem.id]

  for (const slot of equipItem.slots) {
    if (!equipment[slot]) {
      slotId = slot;
      break;
    }
  }

  console.log('TransmuteModal', slotId, equipment, equipItem.slots);

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        try {
          const response = await arcaneItemsContract.methods.getApproved(tokenId).call();
          if (response === getContractAddress('blacksmith')) return true;

          const response2 = await arcaneItemsContract.methods
            .isApprovedForAll(account, getContractAddress('blacksmith'))
            .call(); // setApprovalForAll/isApprovedForAll

          return response2;
        } catch (e) {
          return false;
        }
      },
      onApprove: () => {
        return arcaneItemsContract.methods
          .setApprovalForAll(getContractAddress('blacksmith'), true)
          .send({ from: account });
      },
      onConfirm: () => {
        playActionSound();

        setOpened(true);
        setTransmuting(true);

        setTimeout(() => {
          setOpened(false);

          setTimeout(() => {
            setShaking(true);
          }, 1500);
        }, 1000);

        if (arcaneItem.id === 1212) {
          return blacksmithContract.methods.craftFromTicket(tokenId).send({ from: account });
        }
        return blacksmithContract.methods.craftFromTicket(tokenId).send({ from: account });
      },
      onError: (error) => {
        setShaking(false);
        setOpened(true);

        setTimeout(() => {
          setTransmuting(false);
          setOpened(false);
        }, 1000);

        playFoundSound();
      },
      onSuccess: (state, payload) => {
        refresh();
        refreshEquipment();
        console.log(state, payload);
        if (payload?.events && (payload?.events as any).ItemMint.returnValues[1]) {
          const foundItem = decodeItem((payload?.events as any).ItemMint.returnValues[1]);

          // toastSuccess(`${foundItem.name} transmuted!`)

          setTransmutedItem(foundItem);
          setShaking(false);
          setOpened(true);

          setTimeout(() => {
            setTransmuting(false);
            setOpened(false);
          }, 1000);

          playFoundSound();

          // onDismiss()
        } else {
          toastError(`Transmute failure`);
        }
      },
    });

  return (
    <Modal
      title={t('Transmute')}
      onDismiss={onDismiss}
      css={css`
        position: relative;
        overflow: visible;
      `}>
      {/* style={{ 'overflow-y': 'visible', position: 'relative' }} */}
      <div
        css={css`
          position: absolute;
          width: 800px;
          height: 820px;
          top: 0;
          left: calc(-50%);
          z-index: 999;
          pointer-events: none;
        `}>
        {/* <Card 
        css={css`
          position: absolute;
          left: 0;
          bottom: 50px;
          width: 800px;
          height: 450px;
          z-index: 10;
          pointer-events: none;
          background: none;
        `}
      ></Card> */}
        <div
          css={css`
            width: 100%;
            height: 100%;
            position: relative;
            pointer-events: none;

            ${shaking ? 'animation: shake 0.5s;' : ''}
            animation-delay: 2s;
            animation-iteration-count: infinite;

            @keyframes shake {
              0% {
                transform: translate(1px, 1px) rotate(0deg);
              }
              10% {
                transform: translate(-1px, 2px) rotate(-1deg);
              }
              20% {
                transform: translate(-3px, 0px) rotate(1deg);
              }
              30% {
                transform: translate(3px, 2px) rotate(0deg);
              }
              40% {
                transform: translate(1px, 1px) rotate(1deg);
              }
              50% {
                transform: translate(-1px, 2px) rotate(-1deg);
              }
              60% {
                transform: translate(-3px, 1px) rotate(0deg);
              }
              70% {
                transform: translate(3px, 1px) rotate(-1deg);
              }
              80% {
                transform: translate(-1px, 1px) rotate(1deg);
              }
              90% {
                transform: translate(1px, 2px) rotate(0deg);
              }
              100% {
                transform: translate(1px, 2px) rotate(-1deg);
              }
            }
          `}>
          <div
            css={css`
              z-index: 1;
              position: absolute;
              left: calc(50% - 150px);
              top: 0px;
              width: 300px;
              height: 300px;
              // background: url(/images/spellbook.png) no-repeat 50% 50%;
              // background-size: 100%;
            `}
          />
          <motion.div
            animate={{ x: opened ? -300 : 0 }}
            transition={{
              loop: 0,
              ease: 'easeInOut',
              duration: 1.5,
            }}
            css={css`
              z-index: 3;
              position: absolute;
              left: 0;
              bottom: 50px;
              width: 400px;
              height: 450px;
              background: url(/images/lootbox-left.png) no-repeat 0 0;
              background-size: 100%;
              filter: contrast(1.05) brightness(1.8) saturate(1.5);
            `}
          />
          <div
            css={css`
              z-index: 1;
              position: absolute;
              left: 0;
              bottom: 50px;
              width: 100%;
              height: 450px;
              background: #000;
            `}>
            <div
              css={css`
                z-index: 1;
                position: absolute;
                left: 5%;
                bottom: 5%;
                width: 90%;
                height: 90%;
                background: url(/images/lootbox.png) no-repeat 50% 50%;
                background-size: 200%;
                filter: blur(0.5rem);
              `}
            />
            <div
              css={css`
                z-index: 1;
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
              `}
            />
          </div>
          <motion.div
            animate={{ x: opened ? 300 : 0 }}
            transition={{
              loop: 0,
              ease: 'easeInOut',
              duration: 1.5,
            }}
            css={css`
              z-index: 3;
              position: absolute;
              right: 0;
              bottom: 50px;
              width: 400px;
              height: 450px;
              background: url(/images/lootbox-right.png) no-repeat 0 0;
              background-size: 100%;
              filter: contrast(1.05) brightness(1.8) saturate(1.5);
            `}
          />
          <motion.div
            animate={{ y: transmuting ? 340 : 0 }}
            transition={{
              loop: 0,
              ease: 'easeInOut',
              duration: 1,
              delay: 0,
            }}
            css={css`
              position: absolute;
              left: calc(50% - 64px);
              top: 90px;
              z-index: ${transmuting ? 2 : 10};
              width: 128px;
              height: 128px;
              filter: drop-shadow(2px 4px 6px black);
              // background: url(${transmutedItem ? transmutedItem.icon : arcaneItem.icon}) repeat 0 0;
              // background-size: 100%;
              pointer-events: auto;

              & > div {
                width: 100%;
                height: 100%;
                background: none;
              }
            `}>
            <Item
              itemIndex="transmuteItem"
              item={transmutedItem ? transmutedItem : arcaneItem}
              isDisabled={false}
              showDropdown
              showName
              showQuantity={false}
              showActions={false}
              hideMetadata
            />
          </motion.div>
        </div>
      </div>
      <ModalContent
        css={css`
          height: 120px;
          position: relative;
          overflow-x: hidden;
          pointer-events: none;
        `}>
        <div
          css={css`
            position: absolute;
            left: calc(50% - 50px);
            top: 0px;
            width: 115px;
            height: 115px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px dashed rgba(255, 255, 255, 0.2);
          `}></div>
      </ModalContent>
      <Actions>
        <ApproveConfirmButtons
          isApproveDisabled={isConfirmed || isConfirming || isApproved}
          isApproving={isApproving}
          isConfirmDisabled={!isApproved || isConfirmed}
          isConfirming={isConfirming}
          onApprove={handleApprove}
          onConfirm={handleConfirm}
        />
        {/* <div style={{color: 'white'}} onClick={() => { setOpened(!opened) }}>{opened ? 'True' : 'False'}</div>
        <div style={{color: 'white'}} onClick={() => { setTransmuting(!transmuting) }}>{transmuting ? 'True' : 'False'}</div> */}
        {/* <br />
        <br /> */}
      </Actions>
    </Modal>
  );
};

export default TransmuteModal;
