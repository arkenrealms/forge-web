import React, { useState } from 'react';
import { Button, Text } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import useInventory from '~/hooks/useInventory';
import { decodeItem } from '@arken/node/util/decoder';
import { useToast } from '~/state/hooks';
import useWeb3 from '~/hooks/useWeb3';
import { useTranslation } from 'react-i18next';
import { useArcaneItems, useMasterchef, useBarracks } from '~/hooks/useContract';
import useGetWalletItems from '~/hooks/useGetWalletItems';
import styled from 'styled-components';

interface UnequipModalProps extends InjectedModalProps {
  tokenId: string;
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

const UnequipModal: React.FC<UnequipModalProps> = ({ tokenId, onSuccess, onDismiss }) => {
  const { t } = useTranslation();
  const { address: account } = useWeb3();
  const { toastError, toastSuccess } = useToast();
  const arcaneItem = decodeItem(tokenId);
  const [isLoading, setIsLoading] = useState(false);
  const { equipment, refreshEquipment, removeTokenId } = useInventory();
  const equipItem = decodeItem(tokenId);
  const barracks = useBarracks();
  const { refresh } = useGetWalletItems();

  let slotId = equipItem.slots[0]; //mapIdToSlot[equipItem.id]

  for (const slot of equipItem.slots) {
    if (equipment[slot]?.tokenId === tokenId) {
      slotId = slot;
      break;
    }
  }

  return (
    <Modal title={t('Unequip')} onDismiss={onDismiss}>
      <ModalContent>
        <Text as="p" color="textSubtle" mb="24px">
          {t(`Unequipping item: ${arcaneItem.name} (${arcaneItem.shorthand})`)}
        </Text>
      </ModalContent>
      <>
        {/* {equipment[slotId] ? ( */}
        <Button
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            console.log(equipment[slotId], slotId);
            await barracks.methods.unequip(slotId, equipment[slotId].tokenId).send({ from: account });
            equipment[slotId].isEquipped = false;
            equipment[slotId].isEquippable = true;
            removeTokenId(slotId, tokenId);
            refresh();
            refreshEquipment();
            onDismiss();
          }}>
          Unequip
        </Button>
        {/* ) : null} */}
      </>
    </Modal>
  );
};

export default UnequipModal;
