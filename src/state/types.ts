// import { Toast } from '~/components/Toast'
// import BigNumber from 'bignumber.js'
// import { CampaignType, FarmConfig, Nft, PoolConfig, Team } from '~/config/constants/types'

// export type TranslatableText =
//   | string
//   | {
//       id: number
//       fallback: string
//       data?: {
//         [key: string]: string | number
//       }
//     }

// export interface Farm extends FarmConfig {
//   tokenAmount?: BigNumber
//   // quoteTokenAmount?: BigNumber
//   lpTotalInQuoteToken?: BigNumber
//   tokenPriceVsQuote?: BigNumber
//   poolWeight?: number
//   runePerBlock?: number
//   inactive?: boolean
//   userData?: {
//     allowance: BigNumber
//     tokenBalance: BigNumber
//     stakedBalance: BigNumber
//     earnings: BigNumber
//     previousEarnings: {
//       [key: string]: string
//     }
//   }
// }

// export interface Pool extends PoolConfig {
//   totalStaked?: BigNumber
//   startBlock?: number
//   endBlock?: number
//   userData?: {
//     allowance: BigNumber
//     stakingTokenBalance: BigNumber
//     stakedBalance: BigNumber
//     pendingReward: BigNumber
//   }
// }

// export interface Profile {
//   characterId: number
//   userId: number
//   points: number
//   teamId: number
//   address: string
//   nftAddress: string
//   tokenId: number
//   isActive: boolean
//   username: string
//   nft?: Nft
//   team: Team
//   hasRegistered: boolean
// }

// // Slices states

// export interface ToastsState {
//   data: Toast[]
// }

// export interface FarmsState {
//   data: Farm[]
// }

// export interface PoolsState {
//   data: Pool[]
// }

// export interface ProfileState {
//   isInitialized: boolean
//   isLoading: boolean
//   hasRegistered: boolean
//   address: string
//   data: Profile
// }

// export interface ProfilesState {
//   defaultProfile: ProfileState
//   list: ProfileState[]
// }

// export type TeamResponse = {
//   0: string
//   1: string
//   2: string
//   3: string
//   4: boolean
// }

// export type TeamsById = {
//   [key: string]: Team
// }

// export interface TeamsState {
//   isInitialized: boolean
//   isLoading: boolean
//   data: TeamsById
// }

// export interface AchievementBranch {
//   description?: TranslatableText | TranslatableText[]
// }

// export interface Achievement {
//   id: number
//   key: string
//   category: string
//   type: string
//   icon: string
//   points: number
//   isEnabled: boolean
//   details: any
//   // address: string
//   name: TranslatableText
//   branches: {
//     1: AchievementBranch
//     2: AchievementBranch
//   }
//   // badge: string
// }

// export interface AchievementState {
//   data: Achievement[]
// }

// // API Price State
// export interface PriceList {
//   [key: string]: number
// }

// export interface PriceApiResponse {
//   /* eslint-disable camelcase */
//   update_at: string
//   prices: PriceList
// }

// export interface PriceState {
//   isLoading: boolean
//   lastUpdated: string
//   data: PriceList
// }

// // Global state

// export interface State {
//   farms: FarmsState
//   toasts: ToastsState
//   prices: PriceState
//   pools: PoolsState
//   profiles: ProfilesState
//   teams: TeamsState
//   achievements: AchievementState
// }
