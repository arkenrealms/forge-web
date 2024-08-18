import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import history from '~/routerHistory';
import useInventory from '~/hooks/useInventory';
import { decodeItem } from 'rune-backend-sdk/build/util/item-decoder';
import { useToast } from '~/state/hooks';
import useWeb3 from '~/hooks/useWeb3';
import { useTranslation } from 'react-i18next';
import useApproveConfirmTransaction from '~/hooks/useApproveConfirmTransaction';
import { useArcaneItems, useMasterchef, useBarracks } from '~/hooks/useContract';
import { useProfile } from '~/state/hooks';
import { getContractAddress } from '~/utils/addressHelpers';
import useGetWalletItems from '~/hooks/useGetWalletItems';
import { ItemAttributesByName, ItemSlot, ItemType } from 'rune-backend-sdk/build/data/items';
import ApproveConfirmButtons from './account/ApproveConfirmButtons';

interface EquipModalProps extends InjectedModalProps {
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

const EquipModal: React.FC<EquipModalProps> = ({ tokenId, onSuccess, onDismiss }) => {
  const { t } = useTranslation();
  const { address: account } = useWeb3();
  const { toastError, toastSuccess } = useToast();
  const arcaneItem = decodeItem(tokenId);
  const { equipment, refreshEquipment } = useInventory();
  const equipItem = decodeItem(tokenId);
  const [isLoading, setIsLoading] = useState(false);
  const { contract: masterChefContract } = useMasterchef();
  const barracks = useBarracks();
  const arcaneItemsContract = useArcaneItems();
  const { refresh } = useGetWalletItems();
  const { profile } = useProfile();
  let slotId = equipItem.slots[0]; //mapIdToSlot[equipItem.id]

  for (const slot of equipItem.slots) {
    if (!equipment[slot]) {
      slotId = slot;
      break;
    }
  }

  console.log('EquipModal', slotId, equipment, equipItem.slots);

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        try {
          const response = await arcaneItemsContract.methods.getApproved(tokenId).call();
          if (response === getContractAddress('itemStorage')) return true;

          const response2 = await arcaneItemsContract.methods
            .isApprovedForAll(account, getContractAddress('itemStorage'))
            .call(); // setApprovalForAll/isApprovedForAll

          return response2;
        } catch (e) {
          return false;
        }
      },
      onApprove: () => {
        return arcaneItemsContract.methods
          .setApprovalForAll(getContractAddress('itemStorage'), true)
          .send({ from: account });
      },
      onConfirm: () => {
        if (
          (equipItem.type === ItemType.OneHandedWeapon &&
            equipment[ItemSlot.LeftHand]?.type === ItemType.TwoHandedWeapon) ||
          (equipItem.type === ItemType.Shield && equipment[ItemSlot.LeftHand]?.type === ItemType.TwoHandedWeapon)
        ) {
          toastError(`Cannot be equipped`);
          onDismiss();
          return {
            on: () => {
              return { on: () => ({ on: () => {} }) };
            },
          };
        }

        console.log(slotId, tokenId);
        return barracks.methods.equip(slotId, tokenId).send({ from: account });
      },
      onSuccess: () => {
        refresh();
        refreshEquipment();

        toastSuccess(`${arcaneItem.name} equipped!`);

        onDismiss();
      },
    });

  return (
    <Modal title={t('Disenchant')} onDismiss={onDismiss}>
      <ModalContent>
        {!profile?.nft ? (
          <div style={{ paddingLeft: 200 }}>
            <div
              css={css`
                z-index: 0;
                position: absolute;
                top: 10px;
                left: 10px;
                background: url('/images/team/jackson-anime.png') 0px 100% no-repeat;
                width: 200px;
                height: 200px;
                margin-bottom: 20px;
                background-size: contain;
                margin-right: 20px;
              `}></div>
            <ItemTitle>New?</ItemTitle>
            <br />
            <ItemDescription>Setup a profile and character to get higher farmbonuses.</ItemDescription>
            <br />
            <br />
            <Button
              onClick={() => {
                onDismiss();
                history.push('/account');
              }}
              style={{ paddingTop: 5, paddingBottom: 5 }}>
              Setup Profile
            </Button>
          </div>
        ) : null}
        {profile?.nft ? <></> : null}
      </ModalContent>
      {profile?.nft ? (
        <Actions>
          <ApproveConfirmButtons
            isApproveDisabled={isConfirmed || isConfirming || isApproved}
            isApproving={isApproving}
            isConfirmDisabled={!isApproved || isConfirmed}
            isConfirming={isConfirming}
            onApprove={handleApprove}
            onConfirm={handleConfirm}
          />
          <br />
          <br />
        </Actions>
      ) : null}
    </Modal>
  );
};

export default EquipModal;
