import BigNumber from 'bignumber.js'
import { getNativeAddress } from '~/utils/addressHelpers'
import useTokenBalance from './useTokenBalance'

/**
 * A hook to check if a wallet's RUNE balance is at least the amount passed in
 */
const useHasRuneBalance = (minimumBalance: BigNumber) => {
  const runeBalance = useTokenBalance(getNativeAddress())
  return runeBalance.gte(minimumBalance)
}

export default useHasRuneBalance
