import Cookies from 'js-cookie'
import { getProfileContract, getArcaneCharacterContract } from '~/utils/contractHelpers'
import { Nft } from '~/config/constants/types'
import { Profile } from '~/state/types'
import { getTeam } from '~/state/teams/helpers'
import nfts from '~/config/constants/nfts'
import { transformProfileResponse } from './helpers'

const profileContract = getProfileContract()
const characterContract = getArcaneCharacterContract()
const profileApi = process.env.REACT_APP_API_PROFILE

export interface GetProfileResponse {
  address: string
  hasRegistered: boolean
  profile?: Profile
}

const cache = {
  getUserAddressByUsername: {},
  getUsername: {},
}

export const getUserAddressByUsername = async (name: string): Promise<string> => {
  try {
    if (cache.getUserAddressByUsername[name]) return cache.getUserAddressByUsername[name]

    const response = await fetch(`${profileApi}/users/${name}`).catch(() => {})

    if (!response || !response.ok) {
      return ''
    }

    // @ts-ignore
    const username = await response.text()

    cache.getUserAddressByUsername[name] = username

    return username
  } catch (error) {
    return ''
  }
}

export const getUsername = async (address: string): Promise<string> => {
  try {
    if (cache.getUsername[address]) return cache.getUsername[address]

    const response = await fetch(`${profileApi}/users/${address}`)

    if (!response.ok) {
      return ''
    }

    const { username = '' } = await response.json()

    cache.getUsername[address] = username

    return username
  } catch (error) {
    return ''
  }
}

const getProfile = async (address: string): Promise<GetProfileResponse> => {
  if (!address) {
    return { hasRegistered: false, address, profile: null }
  }

  let hasRegistered = false
  try {
    hasRegistered = (await profileContract.methods.hasRegistered(address).call()) as boolean

    if (!hasRegistered) {
      return { hasRegistered, address, profile: null }
    }

    const profileResponse = await profileContract.methods.getUserProfile(address).call()
    const { userId, points, teamId, tokenId, nftAddress, isActive } = transformProfileResponse(profileResponse)
    const team = await getTeam(teamId)
    const username = await getUsername(address)
    // console.log('bbbbbb3', profileResponse, address, { userId, points, teamId, tokenId, nftAddress, isActive })
    // If the profile is not active the tokenId returns 0, which is still a valid token id
    // so only fetch the nft data if active
    let nft: Nft
    let characterId
    if (isActive) {
      characterId = Number(await characterContract.methods.getCharacterId(tokenId).call())
      nft = nfts.find((nftItem) => nftItem.characterId === characterId)

      // Save the preview image in a cookie so it can be used on the exchange
      Cookies.set(
        `profile_${address}`,
        {
          username,
          avatar: `https://arken.gg/images/nfts/${nft.images.sm}`,
        },
        { domain: window.location.hostname, secure: true, expires: 30 }
      )
    }

    const profile = {
      characterId,
      userId,
      points,
      teamId,
      tokenId,
      username,
      nftAddress: '0x4596E527eBA13A27cd02576d023695eAB0A6b210',
      isActive,
      address,
      nft,
      team,
    } as Profile

    return { hasRegistered, address, profile }
  } catch (error) {
    console.log('Profile fetch error', address, error)
    return { hasRegistered, address, profile: null }
  }
}

export default getProfile
