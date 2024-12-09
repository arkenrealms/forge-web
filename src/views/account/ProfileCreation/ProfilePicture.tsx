import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AutoRenewIcon, Button, Card, CardBody, Heading, Skeleton, Text } from '~/ui';
import { Link as RouterLink } from 'react-router-dom';
import nftList from '~/config/constants/nfts';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import { useToast } from '~/state/hooks';
import { getArcaneProfileAddress } from '~/utils/addressHelpers';
import { useCharacters } from '~/hooks/useContract';
import useGetWalletNfts from '~/hooks/useGetWalletNfts';
import useWeb3 from '~/hooks/useWeb3';
import SelectionCard from '~/components/account/SelectionCard';
import NextStepButton from '~/components/account/NextStepButton';
import { ProfileCreationContext } from './contexts/ProfileCreationProvider';

const Link = styled(RouterLink)`
  color: ${({ theme }) => theme.colors.primary};
`;

const NftWrapper = styled.div`
  margin-bottom: 24px;
`;

const ProfilePicture: React.FC<any> = () => {
  const [isApproved, setIsApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const { tokenId, actions } = useContext(ProfileCreationContext);
  const { t } = useTranslation();
  const { isLoading, nfts: nftsInWallet } = useGetWalletNfts();
  const arcaneCharactersContract = useCharacters();
  const { address: account } = useWeb3();
  const { toastError } = useToast();
  const characterIds = Object.keys(nftsInWallet).map((nftWalletItem) => Number(nftWalletItem));
  const walletNfts = nftList.filter((nft) => characterIds.includes(nft.characterId));

  const handleApprove = () => {
    arcaneCharactersContract.methods
      .approve(getArcaneProfileAddress(), tokenId)
      .send({ from: account })
      .on('sending', () => {
        setIsApproving(true);
      })
      .on('receipt', () => {
        setIsApproving(false);
        setIsApproved(true);
      })
      .on('error', (error) => {
        toastError('Error', error?.message);
        setIsApproving(false);
      });
  };

  useEffect(() => {
    if (tokenId !== null) {
      // @ts-ignore
      arcaneCharactersContract.methods.getApproved(tokenId).call({ from: account }, function (error, res) {
        if (error) return;
        if (res.toLowerCase() === getArcaneProfileAddress().toLowerCase()) {
          setIsApproved(true);
        }
      });
    }
  }, [account, arcaneCharactersContract.methods, tokenId, nftsInWallet, walletNfts]);

  if (!isLoading && walletNfts.length === 0) {
    return (
      <>
        <Heading size="xl" mb="24px">
          {t('No characters')}
        </Heading>
        <Text bold fontSize="20px" mb="24px">
          {t('We couldn’t find any characters in your wallet.')}
        </Text>
        <Text as="p">
          {t(
            'You need a character to finish setting up your profile. If you sold or transferred your starter character to another wallet, you’ll need to get it back or acquire a new one somehow. You can’t make a new starter with this wallet address.'
          )}
        </Text>
      </>
    );
  }

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t(`Step ${2}`)}
      </Text>
      <Heading as="h3" size="xl" mb="24px">
        {t('Set Avatar')}
      </Heading>
      {/* <Card mb="24px">
        <CardBody>
          <Heading as="h4" size="lg" mb="8px">
            {t('Choose collectible')}
          </Heading>
          <Text as="p" color="textSubtle">
            {t(
              'Choose a profile picture from the eligible collectibles (NFT) in your wallet, shown below.',
            )}
          </Text>
          <Text as="p" color="textSubtle" mb="24px">
            {t('Only approved Collectibles can be used.')}
            <Link to="/characters" style={{ marginLeft: '4px' }}>
              {t('See the list >')}
            </Link>
          </Text> */}
      <NftWrapper>
        {isLoading ? (
          <Skeleton height="80px" mb="16px" />
        ) : (
          walletNfts.map((walletNft) => {
            const [firstTokenId] = nftsInWallet[walletNft.characterId].tokenIds;

            return (
              <SelectionCard
                name="profilePicture"
                key={walletNft.characterId}
                value={firstTokenId}
                image={`/images/character-classes/${walletNft.images.md}`}
                isChecked={firstTokenId === tokenId}
                onChange={(value: string) => actions.setTokenId(parseInt(value, 10))}>
                <Text bold>{walletNft.name}</Text>
              </SelectionCard>
            );
          })
        )}
      </NftWrapper>
      {/* <Heading as="h4" size="lg" mb="8px">
            {t('Allow collectible to be locked')}
          </Heading>
          <Text as="p" color="textSubtle" mb="16px">
            {t(
              "The collectible you've chosen will be locked in a smart contract while it’s being used as your profile picture. Don't worry - you'll be able to get it back at any time.",
            )}
          </Text> */}
      <Button
        isLoading={isApproving}
        disabled={isApproved || isApproving || tokenId === null}
        onClick={handleApprove}
        endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : undefined}>
        {t('Approve')}
      </Button>
      <br />
      <br />
      {/* </CardBody>
      </Card> */}
      <NextStepButton onClick={actions.nextStep} disabled={tokenId === null || !isApproved || isApproving}>
        {t('Next Step')}
      </NextStepButton>
    </>
  );
};

export default ProfilePicture;
