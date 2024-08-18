import React, { useCallback, useEffect, useState } from 'react'
import orderBy from 'lodash/orderBy'
import nfts from '~/config/constants/nfts'
import { getCharacterSpecialContract, getCharacterFactoryContract } from '~/utils/contractHelpers'
import useGetWalletNfts from '~/hooks/useGetWalletNfts'
import useWeb3 from '~/hooks/useWeb3'
import { makeBatchRequest } from '~/utils/web3'
import { useToast } from '~/state/hooks'
import NftCard from './NftCard'
import NftGrid from './NftGrid'

type State = {
  [key: string]: boolean
}

const characterSpecialContract = getCharacterSpecialContract()
const characterFactoryContract = getCharacterFactoryContract()

const NftList = ({ autoShowDescription, showCard }) => {
  const [claimableNfts, setClaimableNfts] = useState<State>({})
  const [canMint, setCanMint] = useState<boolean>(false)
  const { nfts: nftTokenIds, refresh } = useGetWalletNfts()
  const { address: account } = useWeb3()
  const { toastError } = useToast()

  const fetchMintableStatuses = useCallback(
    async (walletAddress: string) => {
      try {
        setCanMint(await characterFactoryContract.methods.canMint(walletAddress).call())
      } catch (error) {
        console.error(error)
      }
    },
    [setCanMint]
  )

  const handleSuccess = () => {
    refresh()
    //fetchClaimableStatuses(account)
  }

  useEffect(() => {
    if (account) {
      // fetchClaimableStatuses(account)
      fetchMintableStatuses(account)
    }
  }, [account, fetchMintableStatuses])

  return (
    <>
      {orderBy(nfts, 'sortOrder').map((nft) => {
        const tokenIds = nftTokenIds[nft.characterId] ? nftTokenIds[nft.characterId].tokenIds : []

        return (
          <div key={nft.name}>
            <NftCard
              nft={nft}
              canClaim={claimableNfts[nft.characterId]}
              canMint
              tokenIds={tokenIds}
              onSuccess={handleSuccess}
              autoShowDescription={autoShowDescription}
              showCard={showCard}
            />
          </div>
        )
      })}
    </>
  )
}

export default NftList
