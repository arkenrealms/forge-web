import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Button, Card, CardBody, Heading, Text } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import useApproveConfirmTransaction from '~/hooks/useApproveConfirmTransaction';
import { useRxs, useCharacterFactory } from '~/hooks/useContract';
import useHasShardBalance from '~/hooks/useHasShardBalance';
import nftList from '~/config/constants/nfts';
import { PurchaseModal } from '~/components/PurchaseModal';
import useGetWalletNfts from '~/hooks/useGetWalletNfts';
import { useConfig } from '~/hooks/useConfig';
import useWeb3 from '~/hooks/useWeb3';
import SelectionCard from '~/components/account/SelectionCard';
import NextStepButton from '~/components/account/NextStepButton';
import ApproveConfirmButtons from '~/components/account/ApproveConfirmButtons';
import useProfileCreation from './contexts/hook';
import { STARTER_CHARACTER_IDS } from './config';

const nfts = nftList.filter((nft) => STARTER_CHARACTER_IDS.includes(nft.characterId));

const Mint: React.FC<any> = () => {
  const { mintCost, registerCost } = useConfig();
  const [characterId, setCharacterId] = useState(null);
  const { actions, minimumRuneRequired, allowance, tokenId } = useProfileCreation();
  const minimumRuneBalanceToMint = new BigNumber(mintCost + registerCost).multipliedBy(new BigNumber(10).pow(18));
  const [onPresentPurchaseModal] = useModal(
    <PurchaseModal defaultAmount={mintCost + registerCost + ''} onSuccess={() => {}} />
  );

  const { address: account } = useWeb3();
  const runeContract = useRxs();
  const characterFactoryContract = useCharacterFactory();
  const { t } = useTranslation();
  const hasMinimumRuneRequired = useHasShardBalance(minimumRuneBalanceToMint);

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        // TODO: Move this to a helper, this check will be probably be used many times
        try {
          const response = await runeContract.methods
            .allowance(account, characterFactoryContract.options.address)
            .call();
          const currentAllowance = new BigNumber(response as any);
          return currentAllowance.gte(minimumRuneRequired);
        } catch (error) {
          return false;
        }
      },
      onApprove: () => {
        return runeContract.methods
          .approve(characterFactoryContract.options.address, allowance.toJSON())
          .send({ from: account });
      },
      onConfirm: () => {
        return characterFactoryContract.methods.mintNFT(characterId).send({ from: account });
      },
      onSuccess: () => actions.nextStep(),
    });

  // useEffect(() => {
  //   if (walletNfts.length) {

  //   }
  // }, [walletNfts])

  const { isLoading, nfts: nftsInWallet } = useGetWalletNfts();
  const characterIds = Object.keys(nftsInWallet).map((nftWalletItem) => Number(nftWalletItem));
  const walletNfts = nftList.filter((nft) => characterIds.includes(nft.characterId));

  return (
    <>
      <Text as="h4" fontSize="20px" color="textSubtle" bold>
        {t(`Step ${1}`)}
      </Text>
      <Heading as="h3" size="xl" mb="24px">
        {t(walletNfts.length ? 'Choose Character' : 'Create Character')}
      </Heading>
      {/* <Text as="p">{t('Every character starts by choosing a class.')}</Text>
      <Text as="p">{t('This class will also become your avatar.')}</Text>
      <Text as="p" mb="24px">
        {t('You can change your avatar later.')}
      </Text>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" size="lg" mb="8px">
            {t('Choose Your Class!')}
          </Heading> */}
      {/* <Text as="p" mb="24px" color="textSubtle">
        {t('Choose wisely: one character per wallet!')}
      </Text> */}
      {walletNfts.length
        ? walletNfts.map((walletNft) => {
            const [firstTokenId] = nftsInWallet[walletNft.characterId].tokenIds;

            return (
              <SelectionCard
                name="profilePicture"
                key={walletNft.characterId}
                value={firstTokenId}
                image={`/images/character-classes/${walletNft.images.md}`}
                isChecked={firstTokenId === tokenId}
                onChange={(value: string) => actions.setTokenId(parseInt(value, 10))}
                disabled={isApproving || isConfirming || isConfirmed}>
                <Text bold>{walletNft.name}</Text>
              </SelectionCard>
            );
          })
        : null}
      {!walletNfts.length ? (
        <>
          {nfts.map((nft) => {
            const handleChange = (value: string) => setCharacterId(parseInt(value, 10));

            return (
              <SelectionCard
                key={nft.characterId}
                name="mintStarter"
                value={nft.characterId}
                image={`/images/character-classes/${nft.images.md}`}
                isChecked={characterId === nft.characterId}
                onChange={handleChange}
                disabled={isApproving || isConfirming || isConfirmed || !hasMinimumRuneRequired}>
                <Text bold>{nft.name}</Text>
              </SelectionCard>
            );
          })}
          {hasMinimumRuneRequired && (
            <Text as="p" mb="16px" color="failure">
              {t(`Cost: ${mintCost + registerCost} RXS`, { num: mintCost + registerCost })}
            </Text>
          )}
          {!hasMinimumRuneRequired && (
            <Text color="failure" mb="16px">
              {t(`${mintCost + registerCost} RXS fee is required.`)}{' '}
              <Button scale="sm" onClick={onPresentPurchaseModal}>
                Buy RXS
              </Button>
            </Text>
          )}
          <ApproveConfirmButtons
            isApproveDisabled={characterId === null || isConfirmed || isConfirming || isApproved}
            isApproving={isApproving}
            isConfirmDisabled={!isApproved || isConfirmed || !hasMinimumRuneRequired}
            isConfirming={isConfirming}
            onApprove={handleApprove}
            onConfirm={handleConfirm}
          />
        </>
      ) : null}
      <br />
      <br />
      {/* </CardBody>
      </Card> */}
      <NextStepButton onClick={actions.nextStep} disabled={!isConfirmed && !walletNfts.length}>
        {t('Next Step')}
      </NextStepButton>
    </>
  );
};

export default Mint;
