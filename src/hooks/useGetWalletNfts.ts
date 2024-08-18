import { useEffect, useReducer } from 'react'
import { getArcaneCharacterContract } from '~/utils/contractHelpers'
import { makeBatchRequest } from '~/utils/web3'
import useWeb3 from '~/hooks/useWeb3'
import useInterval from './useInterval'

const arcaneCharactersContract = getArcaneCharacterContract()

export type NftMap = {
  [key: number]: {
    tokenUri: string
    tokenIds: number[]
  }
}

type Action = { type: 'set_nfts'; data: NftMap } | { type: 'reset' } | { type: 'refresh'; timestamp: number }

type State = {
  isLoading: boolean
  nfts: NftMap
  lastUpdated: number
}

const initialState: State = {
  isLoading: true,
  nfts: {},
  lastUpdated: 0,
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'set_nfts':
      return {
        ...initialState,
        isLoading: false,
        nfts: action.data,
      }
    case 'refresh':
      return {
        ...initialState,
        lastUpdated: action.timestamp,
      }
    case 'reset':
      return {
        ...initialState,
        isLoading: false,
      }
    default:
      return state
  }
}

const useGetWalletNfts = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { address: account } = useWeb3()
  const { lastUpdated } = state

  useEffect(() => {
    if (!account || Date.now() - lastUpdated < 10 * 1000) return

    // dispatch({ type: 'refresh', timestamp: Date.now() })

    const fetchNfts = async () => {
      console.log('Fetching characters')

      try {
        const balanceOf = await arcaneCharactersContract.methods.balanceOf(account).call()

        if (balanceOf > 0) {
          let nfts: NftMap = {}

          const getTokenIdAndCharacterId = async (index: number) => {
            try {
              const { tokenOfOwnerByIndex, getCharacterId, tokenURI } = arcaneCharactersContract.methods
              const tokenId = await tokenOfOwnerByIndex(account, index).call()
              const [characterId, tokenUri] = await makeBatchRequest([
                getCharacterId(tokenId).call,
                tokenURI(tokenId).call,
              ])

              return [Number(characterId), Number(tokenId), tokenUri]
            } catch (error) {
              return null
            }
          }

          const tokenIdPromises = []

          for (let i = 0; i < balanceOf; i++) {
            tokenIdPromises.push(getTokenIdAndCharacterId(i))
          }

          const tokenIdsOwnedByWallet = await Promise.all(tokenIdPromises)

          nfts = tokenIdsOwnedByWallet.reduce((accum, association) => {
            if (!association) {
              return accum
            }

            const [characterId, tokenId, tokenUri] = association

            return {
              ...accum,
              [characterId]: {
                tokenUri,
                tokenIds: accum[characterId] ? [...accum[characterId].tokenIds, tokenId] : [tokenId],
              },
            }
          }, {})

          dispatch({ type: 'set_nfts', data: nfts })
        } else {
          // Reset it in case of wallet change
          dispatch({ type: 'reset' })
        }
      } catch (error) {
        //dispatch({ type: 'reset' })
      }
    }

    if (account) {
      fetchNfts()
    }
  }, [account, lastUpdated, dispatch])

  const refresh = () => dispatch({ type: 'refresh', timestamp: Date.now() })

  // useInterval(() => {
  //   refresh()
  // }, 15 * 1000)

  return { ...state, refresh }
}

export default useGetWalletNfts
