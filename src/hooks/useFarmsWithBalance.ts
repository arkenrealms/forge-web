import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import multicall from '~/utils/multicall'
import { getMasterChefAddress } from '~/utils/addressHelpers'
import masterChefABI from '~/config/abi/masterchef.json'
import { farmsConfig } from '~/config/constants'
import { FarmConfig } from '~/config/constants/types'
import { useMasterchef } from '~/hooks/useContract'
import useWeb3 from '~/hooks/useWeb3'
import useRefresh from './useRefresh'

export interface FarmWithBalance extends FarmConfig {
  balance: BigNumber
}

const useFarmsWithBalance = () => {
  const [farmsWithBalances, setFarmsWithBalances] = useState<FarmWithBalance[]>([])
  const { address: account } = useWeb3()
  const { fastRefresh } = useRefresh()
  const { contract: masterChefContract, setChefKey, chefKey } = useMasterchef()

  useEffect(() => {
    const fetchBalances = async () => {
      const calls = farmsConfig
        .filter((f) => f.chefKey === chefKey)
        .map((farm) => ({
          address: getMasterChefAddress(),
          name: 'pendingRune(uint256,address)',
          params: [farm.pid, account],
        }))

      const rawResults = await multicall(masterChefABI, calls)
      const results = farmsConfig
        .filter((f) => f.chefKey === chefKey)
        .map((farm, index) => ({ ...farm, balance: new BigNumber(rawResults[index]) }))

      setFarmsWithBalances(results)
    }

    if (account) {
      fetchBalances()
    }
  }, [account, chefKey, fastRefresh])

  return farmsWithBalances
}

export default useFarmsWithBalance
