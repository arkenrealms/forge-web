import React, { useState, useCallback, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { useFarms, useTeams } from '~/state/hooks'
import { getBalanceNumber } from '~/utils/formatBalance'
import useRuneBalance from '~/hooks/useRuneBalance'
import { useToast } from '~/state/hooks'

const useAccount = () => {
  const { toastError } = useToast()
  const [error, setError] = useState(null)
  const [account, setAccount] = useState(null)
  const runeBalance = useRuneBalance('RXS')
  const farmsLP = useFarms()

  const login = useCallback(() => {}, [])

  const logout = useCallback(() => {}, [])

  // const hasStakedTokens = useCallback((requiredAmount) => {
  //   const hasRuneStaked = !!farmsLP.filter(
  //     (farm) =>
  //       farm.lpSymbol.indexOf('RXS') !== -1 &&
  //       farm.userData &&
  //       new BigNumber(farm.userData.stakedBalance).isGreaterThan(requiredAmount),
  //   ).length
  //   const hasRuneWallet = getBalanceNumber(runeBalance) >= requiredAmount

  //   return hasRuneStaked || hasRuneWallet
  // }, [farmsLP, runeBalance])

  const walletTokens = getBalanceNumber(runeBalance) > 0.005 ? getBalanceNumber(runeBalance) : 0

  let stakedTokens = 0

  for (const farm of farmsLP) {
    if (!farm.lpSymbol.indexOf('RXS')) continue

    if (farm.userData?.stakedBalance) {
      stakedTokens += getBalanceNumber(farm.userData.stakedBalance)
    }
  }

  return { login, logout, error, account, walletTokens, stakedTokens }
}

export default useAccount
