import { TranslatableText } from '~/state/types'

export type IfoStatus = 'idle' | 'coming_soon' | 'live' | 'finished'

export interface Ifo {
  id: string
  isActive: boolean
  address: string
  name: string
  subTitle?: string
  description?: string
  launchDate: string
  launchTime: string
  saleAmount: string
  raiseAmount: string
  runeToBurn: string
  projectSiteUrl: string
  currency: string
  currencyAddress: string
  tokenDecimals: number
  tokenSymbol: string
  releaseBlockNumber: number
  campaignId?: string
}

export enum QuoteToken {
  'BNB' = 'BNB',
  'RUNE' = 'RUNE',
  'EL' = 'EL',
  'ELD' = 'ELD',
  'TIR' = 'TIR',
  'NEF' = 'NEF',
  'ITH' = 'ITH',
  'TAL' = 'TAL',
  'RAL' = 'RAL',
  'ORT' = 'ORT',
  'THUL' = 'THUL',
  'AMN' = 'AMN',
  'SOL' = 'SOL',
  'SHAEL' = 'SHAEL',
  'DOL' = 'DOL',
  'HEL' = 'HEL',
  'IO' = 'IO',
  'LUM' = 'LUM',
  'KO' = 'KO',
  'FAL' = 'FAL',
  'LEM' = 'LEM',
  'UM' = 'UM',
  'PUL' = 'PUL',
  'MAL' = 'MAL',
  'IST' = 'IST',
  'GUL' = 'GUL',
  'VEX' = 'VEX',
  'OHM' = 'OHM',
  'LO' = 'LO',
  'SUR' = 'SUR',
  'BER' = 'BER',
  'JAH' = 'JAH',
  'CHAM' = 'CHAM',
  'ZOD' = 'ZOD',
  'BUSD' = 'BUSD',
  'USDC' = 'USDC',
  'BTCB' = 'BTCB',
  'ETH' = 'ETH',
}

export enum PoolCategory {
  'COMMUNITY' = 'Community',
  'CORE' = 'Core',
  'BINANCE' = 'Binance', // Pools using native BNB behave differently than pools using a token
}

export interface Address {
  97?: string
  56: string
}

export interface FarmConfig {
  pid: number
  fid: number
  risk?: number
  chefKey?: string
  inactive?: boolean
  isTokenOnly?: boolean
  isFinished?: boolean
  isStarting?: boolean
  poolWeight?: number
  depositFeeBP?: number
  lpSymbol: string
  isHiddenPool?: boolean
  tokenLpAddresses?: Address
  lpAddresses: Address
  tokenSymbol: string
  tokenAddresses: Address
  quoteTokenSymbol: QuoteToken
  quoteTokenAdresses: Address
  multiplier?: string
  isCommunity?: boolean
  isRetired?: boolean
  dual?: {
    rewardPerBlock: number
    earnLabel: string
    endBlock: number
  }
}

export interface PoolConfig {
  sousId: number
  image?: string
  tokenName: string
  stakingTokenName: QuoteToken
  stakingLimit?: number
  stakingTokenAddress?: string
  stakingTokenDecimals?: number
  contractAddress: Address
  poolCategory: PoolCategory
  projectLink: string
  tokenPerBlock: string
  sortOrder?: number
  harvest?: boolean
  isFinished?: boolean
  tokenDecimals: number
}

export type Images = {
  lg: string
  md: string
  sm: string
  ipfs?: string
}

export type NftImages = {
  blur?: string
} & Images

export type NftVideo = {
  webm: string
  mp4: string
}

export type Nft = {
  name: string
  description: string
  images: NftImages
  sortOrder: number
  characterId: number
  video?: NftVideo
}

export type TeamImages = {
  alt: string
} & Images

export type Team = {
  id: number
  name: string
  description: string
  isJoinable?: boolean
  users?: number
  points?: number
  memberCount?: number
  activeMemberCount?: number
  images: TeamImages
  background: string
  textColor: string
}

export type CampaignType = 'ifo'

export type Campaign = {
  id: string
  type: CampaignType
  title?: TranslatableText
  description?: TranslatableText
  badge?: string
}
