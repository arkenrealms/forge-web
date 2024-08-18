import BigNumber from 'bignumber.js'
import { getRxsAddress } from '~/utils/addressHelpers'
import useTokenBalance from './useTokenBalance'

/**
 * A hook to check if a wallet's RUNE balance is at least the amount passed in
 */
const useHasRuneBalance = (minimumBalance: BigNumber) => {
  const runeBalance = useTokenBalance(getRxsAddress())
  return runeBalance.gte(minimumBalance)
}

export default useHasRuneBalance
