import React, { useState } from 'react'
import { Button, Skeleton, Text } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import nftList from '~/config/constants/nfts'
import { useProfile, useToast } from '~/state/hooks'
import useI18n from '~/hooks/useI18n'
import useWeb3 from '~/hooks/useWeb3'
import { useTranslation } from 'react-i18next'
import { fetchProfile } from '~/state/profiles'
import useGetWalletNfts from '~/hooks/useGetWalletNfts'
import useApproveConfirmTransaction from '~/hooks/useApproveConfirmTransaction'
import { useCharacters, useProfile as useProfileContract } from '~/hooks/useContract'
import { getArcaneProfileAddress, getArcaneCharactersAddress } from '~/utils/addressHelpers'
import SelectionCard from '../SelectionCard'
import ApproveConfirmButtons from '../ApproveConfirmButtons'

type ChangeProfilePicPageProps = InjectedModalProps

const ChangeProfilePicPage: React.FC<ChangeProfilePicPageProps> = ({ onDismiss }) => {
  const [tokenId, setTokenId] = useState(null)
  const { t } = useTranslation()
  const { isLoading, nfts: nftsInWallet } = useGetWalletNfts()
  const dispatch = useDispatch()
  const { profile } = useProfile()
  const arcaneCharactersContract = useCharacters()
  const profileContract = useProfileContract()
  const { address: account } = useWeb3()
  const { toastSuccess } = useToast()
  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onApprove: () => {
        return arcaneCharactersContract.methods.approve(getArcaneProfileAddress(), tokenId).send({ from: account })
      },
      onConfirm: () => {
        if (!profile.isActive) {
          return profileContract.methods
            .reactivateProfile(getArcaneCharactersAddress(), tokenId)
            .send({ from: account })
        }

        return profileContract.methods.updateProfile(getArcaneCharactersAddress(), tokenId).send({ from: account })
      },
      onSuccess: async () => {
        // Re-fetch profile
        await dispatch(fetchProfile(account))
        toastSuccess('Profile Updated!')

        onDismiss()
      },
    })
  const characterIds = Object.keys(nftsInWallet).map((nftWalletItem) => Number(nftWalletItem))
  const walletNfts = nftList.filter((nft) => characterIds.includes(nft.characterId))

  return (
    <>
      {/* <Text as="p" color="textSubtle" mb="24px">
        {t('Choose a new character to use as your avatar.')}
      </Text> */}
      {isLoading ? (
        <Skeleton height="80px" mb="16px" />
      ) : (
        walletNfts.map((walletNft) => {
          const [firstTokenId] = nftsInWallet[walletNft.characterId].tokenIds

          return (
            <SelectionCard
              name="profilePicture"
              key={walletNft.characterId}
              value={firstTokenId}
              image={`/images/nfts/${walletNft.images.md}`}
              isChecked={firstTokenId === tokenId}
              onChange={(value: string) => setTokenId(parseInt(value, 10))}
              disabled={isApproving || isConfirming || isConfirmed}
            >
              <Text bold>{walletNft.name}</Text>
            </SelectionCard>
          )
        })
      )}
      {!isLoading && walletNfts.length === 0 && (
        <>
          <Text as="p" color="textSubtle" mb="16px">
            {t('Sorry! You don’t have any eligible characters in your wallet to use!')}
          </Text>
          <Text as="p" color="textSubtle" mb="24px">
            {t('Make sure you have a character in your wallet and try again!')}
          </Text>
          <Button
            onClick={() => {
              window.location.href = '/characters'
            }}
          >
            Create Character
          </Button>
          <br />
          <br />
        </>
      )}
      <ApproveConfirmButtons
        isApproveDisabled={isConfirmed || isConfirming || isApproved || tokenId === null}
        isApproving={isApproving}
        isConfirmDisabled={!isApproved || isConfirmed || tokenId === null}
        isConfirming={isConfirming}
        onApprove={handleApprove}
        onConfirm={handleConfirm}
      />
      <Button variant="text" width="100%" onClick={onDismiss} disabled={isApproving || isConfirming}>
        {t('Close Window')}
      </Button>
    </>
  )
}

export default ChangeProfilePicPage
