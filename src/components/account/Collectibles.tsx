import React from 'react'
import { Heading, Text, Flex, ChevronRightIcon, Button } from '~/ui'
import { Link } from 'react-router-dom'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import nfts from '~/config/constants/nfts'
import useGetWalletNfts from '~/hooks/useGetWalletNfts'
import styled from 'styled-components'
import { useProfile } from '~/state/hooks'
import CollectibleCard from './CollectibleCard'

const CollectibleList = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(2, 1fr);
  padding: 16px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 24px;
    grid-template-columns: repeat(auto-fill, 100px);
    padding: 24px 0;
  }

  & > div {
    width: 90px;
    cursor: url('/images/cursor3.png'), pointer;

    &:hover {
      zoom: 1.3;

      img {
        transform: scale(1.2);
        filter: drop-shadow(0 0 1px #000) drop-shadow(0 0 50px rgb(255 255 255 / 70%));
      }
    }
  }
`

const Collectibles = () => {
  const { t } = useTranslation()
  const { profile } = useProfile()
  const { nfts: tokenIdsInWallet } = useGetWalletNfts()
  const characterIds = Object.keys(tokenIdsInWallet).map((nftWalletItem) => Number(nftWalletItem))
  const nftsInWallet = nfts.filter((nft) => characterIds.includes(nft.characterId))

  return (
    <>
      {nftsInWallet.length > 0 || profile?.nft ? (
        <CollectibleList>
          {profile?.nft ? <CollectibleCard key={profile?.nft.characterId} nft={profile?.nft} hideDescription /> : null}
          {nftsInWallet.map((nftInWallet) => (
            <CollectibleCard key={nftInWallet.characterId} nft={nftInWallet} hideDescription />
          ))}
        </CollectibleList>
      ) : null}
      {!profile?.nft && nftsInWallet.length === 0 && (
        <Flex justifyContent="center" p="15px">
          No characters yet
        </Flex>
      )}
      {/* <Flex alignItems="center" justifyContent="flex-end">
        <Link to="/characters">{t('See all approved characters')}</Link>
        <ChevronRightIcon />
      </Flex> */}
    </>
  )
}

export default Collectibles
