// import addresses from 'rune-backend-sdk/build/contractInfo'
// import { Address } from '~/config/constants/types'

// export const getAddress = (address: Address): string => {
//   const mainNetChainId = 56
//   const chainId = window?.location?.hostname === 'testnet.arken.gg' ? 97 : process.env.REACT_APP_CHAIN_ID
//   return address[chainId] ? address[chainId] : address[mainNetChainId]
// }

// export const getContractAddress = (key: string): string => {
//   const mainNetChainId = 56
//   const chainId = window?.location?.hostname === 'testnet.arken.gg' ? 97 : process.env.REACT_APP_CHAIN_ID
//   return addresses[key][chainId] ? addresses[key][chainId] : addresses[key][mainNetChainId]
// }

// export const getRuneAddress = (name: string) => {
//   //console.log('Getting', name)
//   return getAddress(addresses[(name ? name : 'RUNE').toLowerCase()] || addresses.rune)
// }
// export const getRxsAddress = () => {
//   return getAddress(addresses.rxs)
// }
// export const getNativeAddress = () => {
//   return getAddress(addresses.rune)
// }
// export const getRouterAddress = () => {
//   return getAddress(addresses.pancakeRouter)
// }
// export const getMasterChefAddress = () => {
//   return getAddress(addresses.masterChef)
// }
// export const getMulticallAddress = () => {
//   return getAddress(addresses.mulltiCall)
// }
// export const getWbnbAddress = () => {
//   return getAddress(addresses.wbnb)
// }
// export const getArcaneProfileAddress = () => {
//   return getAddress(addresses.profile)
// }
// export const getArcaneCharactersAddress = () => {
//   return getAddress(addresses.characters)
// }
// export const getCharacterFactoryAddress = () => {
//   return getAddress(addresses.characterFactory)
// }
// export const getArcaneItemsAddress = () => {
//   return getAddress(addresses.items)
// }
// export const getBlacksmithAddress = () => {
//   return getAddress(addresses.blacksmith)
// }
// export const getBarracksAddress = () => {
//   return getAddress(addresses.barracks)
// }
// export const getCharacterSpecialAddress = () => {
//   return getAddress(addresses.characterSpecial)
// }
