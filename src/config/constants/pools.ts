import contracts, { MAINNET, TESTNET } from 'rune-backend-sdk/build/contractInfo'
import { PoolConfig, QuoteToken, PoolCategory } from './types'

const pools: PoolConfig[] = [
  // {
  //   sousId: 0,
  //   tokenName: 'RUNE',
  //   stakingTokenName: QuoteToken.RUNE,
  //   stakingTokenAddress: contracts.rune[MAINNET],
  //   contractAddress: contracts.rune,
  //   poolCategory: PoolCategory.CORE,
  //   projectLink: 'https://arken.gg/',
  //   harvest: true,
  //   tokenPerBlock: '10',
  //   sortOrder: 1,
  //   isFinished: false,
  //   tokenDecimals: 18,
  // },
  // {
  //   sousId: 0,
  //   tokenName: 'EL',
  //   stakingTokenName: QuoteToken.EL,
  //   stakingTokenAddress: contracts.el[MAINNET],
  //   contractAddress: contracts.el,
  //   poolCategory: PoolCategory.CORE,
  //   projectLink: 'https://arken.gg/',
  //   harvest: true,
  //   tokenPerBlock: '10',
  //   sortOrder: 1,
  //   isFinished: false,
  //   tokenDecimals: 18,
  // },
]

export default pools
