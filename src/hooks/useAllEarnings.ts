import { useEffect, useState } from 'react'
import multicall from '~/utils/multicall'
import { getMasterChefAddress, getRuneAddress } from '~/utils/addressHelpers'
import masterChefABI from '~/config/abi/masterchef.json'
import { farmsConfig } from '~/config/constants'
import { useMasterchef } from '~/hooks/useContract'
import useWeb3 from '~/hooks/useWeb3'
import useRefresh from './useRefresh'

const useAllEarnings = (symbol) => {
  const [balances, setBalance] = useState([])
  const { address: account } = useWeb3()
  const { fastRefresh } = useRefresh()
  const runeAddress = getRuneAddress(symbol)
  const { contract: masterChefContract, setChefKey, chefKey } = useMasterchef()

  useEffect(() => {
    const fetchAllBalances = async () => {
      const calls = farmsConfig
        .filter((f) => f.chefKey === chefKey)
        .map((farm) => ({
          address: getMasterChefAddress(),
          name: 'pendingRune(address,uint256,address)',
          params: [runeAddress, farm.pid, account],
        }))

      const res = await multicall(masterChefABI, calls)

      setBalance(res)
    }

    if (account) {
      fetchAllBalances()
    }
  }, [account, runeAddress, chefKey, fastRefresh])

  return balances
}

export default useAllEarnings
