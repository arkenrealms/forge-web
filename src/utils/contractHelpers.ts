import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import web3NoAccount from '~/utils/web3'

// Addresses
import {
  getAddress,
  getArcaneProfileAddress,
  getArcaneCharactersAddress,
  getCharacterFactoryAddress,
  getCharacterSpecialAddress,
  getNativeAddress,
  getRuneAddress,
  getRouterAddress,
  getMasterChefAddress,
  getArcaneItemsAddress,
  getBlacksmithAddress,
} from '~/utils/addressHelpers'

// ABI

import profileABI from '~/config/abi/arcaneProfile.json'
import arcaneItemsAbi from '~/config/abi/arcaneItems.json'
import arcaneCharactersAbi from '~/config/abi/arcaneCharacters.json'
import characterFactoryAbi from '~/config/abi/characterFactory.json'
import characterSpecialAbi from '~/config/abi/characterSpecial.json'
import bep20Abi from '~/config/abi/erc20.json'
import runeAbi from '~/config/abi/rune.json'
import masterChef from '~/config/abi/masterchef.json'
import pancakeRouterAbi from '~/config/abi/pancakeRouter.json'

export const getContract = (abi: any, address: string, web3?: Web3) => {
  const _web3 = web3 ?? web3NoAccount
  return new _web3.eth.Contract(abi as unknown as AbiItem, address)
}

export const getBep20Contract = (address: string, web3?: Web3) => {
  return getContract(bep20Abi, address, web3)
}
export const getNativeContract = (web3?: Web3) => {
  return getContract(runeAbi, getNativeAddress(), web3)
}
export const getRuneContract = (rune: string, web3?: Web3) => {
  return getContract(runeAbi, getRuneAddress(rune), web3)
}
export const getRouterContract = (web3?: Web3) => {
  return getContract(pancakeRouterAbi, getRouterAddress(), web3)
}
export const getProfileContract = (web3?: Web3) => {
  return getContract(profileABI, getArcaneProfileAddress(), web3)
}
export const getArcaneItemContract = (web3?: Web3) => {
  return getContract(arcaneItemsAbi, getArcaneItemsAddress(), web3)
}
export const getArcaneCharacterContract = (web3?: Web3) => {
  return getContract(arcaneCharactersAbi, getArcaneCharactersAddress(), web3)
}
export const getCharacterFactoryContract = (web3?: Web3) => {
  return getContract(characterFactoryAbi, getCharacterFactoryAddress(), web3)
}
export const getCharacterSpecialContract = (web3?: Web3) => {
  return getContract(characterSpecialAbi, getCharacterSpecialAddress(), web3)
}
export const getMasterchefContract = (web3?: Web3) => {
  return getContract(masterChef, getMasterChefAddress(), web3)
}
