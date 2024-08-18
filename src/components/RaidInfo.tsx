import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Equipment from '~/components/Equipment';
import { Modal, useModal } from '~/components/Modal';
import { useBarracks, useMasterchef, useWorldstoneMinter } from '~/hooks/useContract';
import { useFarmStatus } from '~/hooks/useFarmStatus';
import useGetWalletItems from '~/hooks/useGetWalletItems';
import useInventory from '~/hooks/useInventory';
import useWeb3 from '~/hooks/useWeb3';
import history from '~/routerHistory';
import { useProfile } from '~/state/hooks';
import { Button, Card, Image } from '~/ui';

const Container = styled.div``;

const ItemTitle = styled.div`
  font-size: 1.5rem;
  line-height: 3rem;
`;
const ItemDescription = styled.div`
  font-style: italic;
  font-size: 0.9em;
  color: #bbb;
  margin-bottom: 10px;
  line-height: 20px;
`;

const EquipmentContainer = styled.div`
  width: 100%;
`;
const ModalContent = styled.div`
  margin-bottom: 16px;
`;

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`;
const EquipmentModal = ({ onDismiss }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const { t } = useTranslation();
  const { address: account } = useWeb3();

  return (
    <Modal title={t('Equipment')} onDismiss={onDismiss}>
      <ModalContent>
        <EquipmentContainer>
          {/* <Heading size="xl">Notice: Items Temporarily Disabled.</Heading> */}
          <Equipment hidePreview={false} />
        </EquipmentContainer>
      </ModalContent>
      <Actions>
        <Button width="100%" variant="secondary" onClick={onDismiss}>
          {t('Back')}
        </Button>
      </Actions>
    </Modal>
  );
};

export const RaidInfo: React.FC = () => {
  const { contract: masterChefContract, setChefKey, chefKey } = useMasterchef();
  const { account, library } = useWeb3();
  const { profile } = useProfile(account);
  const { items } = useInventory();
  const { t } = useTranslation();
  const { refresh } = useGetWalletItems();
  const WorldstoneMinter = useWorldstoneMinter();
  const [shardClaimed, setShardClaimed] = useState(true);
  const { currentFarmSymbol, nextFarmSymbol, currentFarmPaused } = useFarmStatus();
  const Barracks = useBarracks();
  const [onPresentEquipmentModal] = useModal(<EquipmentModal onDismiss={() => {}} />);

  const claimShard = async () => {
    const rand = Math.floor(Math.random() * Math.floor(10000));
    const worldstoneMinter = await WorldstoneMinter;

    await worldstoneMinter.methods['mint(uint16)'](rand).send({ from: account });

    setShardClaimed(true);
  };

  useEffect(() => {
    if (!account) return;
    async function init() {
      const worldstoneMinter = await WorldstoneMinter;

      const res = await worldstoneMinter.methods.hasClaimedShard(account).call({ from: account });
      setShardClaimed(res);
    }

    init();
  }, [account, WorldstoneMinter]);

  return (
    <Container>
      {profile?.nft && items.length ? (
        <>
          <br />
          <br />
          <br />
          <Button style={{ marginRight: 10 }} onClick={onPresentEquipmentModal}>
            View Equipment
          </Button>
          <br />
          <br />
          <br />
          <br />
        </>
      ) : (
        <>
          {chefKey !== currentFarmSymbol && profile?.nft ? (
            <>
              <ItemTitle>Farm Ended</ItemTitle>
              <ItemDescription>This farm has ended. The token supply was locked. Try the next farm!</ItemDescription>
              <br />
            </>
          ) : null}
          {chefKey === currentFarmSymbol && profile?.nft ? (
            <>
              <ItemTitle>No Item Equipped</ItemTitle>
              <ItemDescription>If you want farming bonuses, you can craft and equip an item.</ItemDescription>
              <br />
            </>
          ) : null}
          {profile?.nft ? (
            <>
              <Button
                onClick={() => {
                  history.push('/transmute');
                }}
                mr="20px">
                Craft Item
              </Button>
              <Button
                onClick={() => {
                  history.push('/account/inventory');
                }}>
                Equip Item
              </Button>
            </>
          ) : null}
          {!profile?.nft ? (
            <>
              <br />
              <ItemTitle>New?</ItemTitle>
              <p>Create a character to get higher farmbonuses.</p>
              <br />
              <Button
                onClick={() => {
                  history.push('/account');
                }}
                style={{ paddingTop: 5, paddingBottom: 5 }}>
                Create Character
              </Button>
            </>
          ) : null}
        </>
      )}
    </Container>
  );
};

export default RaidInfo;
