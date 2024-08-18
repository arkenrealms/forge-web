import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync } from '~/state/actions'
import { harvest, emergencyWithdraw } from '~/utils/callHelpers'
import useWeb3 from '~/hooks/useWeb3'
import { useMasterchef } from './useContract'

export const useEmergencyWithdraw = (farmPid: number) => {
  const dispatch = useDispatch()
  const { address: account } = useWeb3()
  const { contract: masterChefContract, chefKey } = useMasterchef()

  const handleWithdraw = useCallback(async () => {
    const txHash = await emergencyWithdraw(masterChefContract, farmPid, account)
    dispatch(fetchFarmUserDataAsync(account, chefKey))
    return txHash
  }, [account, dispatch, chefKey, farmPid, masterChefContract])

  return { onWithdraw: handleWithdraw }
}

export const useHarvest = (farmPid: number) => {
  const dispatch = useDispatch()
  const { address: account } = useWeb3()
  const { contract: masterChefContract, chefKey } = useMasterchef()

  const handleHarvest = useCallback(async () => {
    const txHash = await harvest(masterChefContract, farmPid, account)
    dispatch(fetchFarmUserDataAsync(account, chefKey))
    return txHash
  }, [account, dispatch, chefKey, farmPid, masterChefContract])

  return { onReward: handleHarvest }
}

export const useAllHarvest = (farmPids: number[]) => {
  const { address: account } = useWeb3()
  const { contract: masterChefContract } = useMasterchef()

  const handleHarvest = useCallback(async () => {
    const harvestPromises = farmPids.reduce((accum, pid) => {
      return [...accum, harvest(masterChefContract, pid, account)]
    }, [])

    return Promise.all(harvestPromises)
  }, [account, farmPids, masterChefContract])

  return { onReward: handleHarvest }
}
