import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import history from '~/routerHistory';
import useWeb3 from '~/hooks/useWeb3';
import useInventory from '~/hooks/useInventory';
import { decodeItem } from '@arken/node/util/decoder';
import { useToast } from '~/state/hooks';
import { useTranslation } from 'react-i18next';
import useApproveConfirmTransaction from '~/hooks/useApproveConfirmTransaction';
import { useArcaneItems, useMasterchef, useBarracks } from '~/hooks/useContract';
import { useProfile } from '~/state/hooks';
import { getContractAddress } from '~/utils/addressHelpers';
import useGetWalletItems from '~/hooks/useGetWalletItems';
import { ItemAttributesByName, ItemSlot, ItemType } from '@arken/node/legacy/data/items';
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
  const { equipment, refreshEquipment, addTokenId } = useInventory();
  const equipItem = decodeItem(tokenId);
  const [isLoading, setIsLoading] = useState(false);
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
        setTimeout(function () {
          addTokenId(slotId, tokenId);
          refresh();
          refreshEquipment();

          toastSuccess(`${arcaneItem.name} equipped!`);

          onDismiss();
        }, 3000);
      },
    });
  console.log(7777, equipItem.meta.classRequired, profile.characterId);
  return (
    <Modal title={t('Equip')} onDismiss={onDismiss}>
      <ModalContent>
        {arcaneItem.attributes.find((a) => a.id === ItemAttributesByName[1].UnstakeLocked.id) ? (
          <>
            <ItemTitle style={{ fontSize: '2rem' }}>Warning</ItemTitle>
            <br />
            <p style={{ color: '#fff' }}>
              Equipping an item with the attribute <strong>"Unstake Locked Until Completion"</strong>
              <br />
              means you will not be able to unstake until the next rune is farmed. <br />
            </p>
            <br />
            <br />
          </>
        ) : null}
        {!equipment[slotId] ? (
          <>
            {/* <ItemTitle style={{ fontSize: '2rem' }}>Warning</ItemTitle>
            <br />
            <p style={{ color: '#fff' }}>
              Equipping an item will increase the gas fee <strong>$0.50 USD per item</strong>.<br />
              <br />
              This will be fixed as soon as possible. <br />
              <br />
              In the meantime, the best option is 1) don't harvest often, or 2) use only 1 weapon.{' '}
            </p>
            <br /> */}
            <ItemTitle style={{ fontSize: '1.4rem', margin: '30px 0' }}>
              {t(`Equipping item: ${arcaneItem.name}${arcaneItem.shorthand ? ' (' + arcaneItem.shorthand + ')' : ''}`)}
            </ItemTitle>
          </>
        ) : null}
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
        {/* <br />
        <Text as="p" color="textSubtle" mb="24px">
            {t('This will send your equipment to the raid, so it won\'t be in your inventory.')}
        </Text>
        <br />
        <Text as="p" color="textSubtle" mb="24px">
            {t('You can unequip it on the farm page to get it back.')}
        </Text> */}
        {/* {parseInt(buffs.tokenId) > 0 ? (
          <Button onClick={() => {
            history.push('/farms')
          }} mr="10px">Go to Farms</Button>
        ) : null} */}
      </ModalContent>
      {profile?.nft ? (
        <>
          {equipItem.meta.classRequired && equipItem.meta.classRequired !== profile.characterId ? (
            <div style={{ color: 'red', fontSize: '1.3rem', textAlign: 'center' }}>Invalid class</div>
          ) : equipment[slotId] ||
            (equipItem.type === ItemType.OneHandedWeapon &&
              equipment[ItemSlot.LeftHand]?.type === ItemType.TwoHandedWeapon) ||
            (equipItem.type === ItemType.Shield && equipment[ItemSlot.LeftHand]?.type === ItemType.TwoHandedWeapon) ? (
            <Button
              disabled={isLoading}
              onClick={async () => {
                setIsLoading(true);
                await barracks.methods.unequip(slotId, equipment[slotId].tokenId).send({ from: account });
                refresh();
                refreshEquipment();
                toastSuccess(`Un-equipped!`);
                setIsLoading(false);
              }}>
              Unequip Current Item First
            </Button>
          ) : (
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
          )}
        </>
      ) : null}
    </Modal>
  );
};

export default EquipModal;
