import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync } from '~/state/actions'
import { stake } from '~/utils/callHelpers'
import useWeb3 from '~/hooks/useWeb3'
import { useMasterchef } from './useContract'

const useStake = (pid: number) => {
  const dispatch = useDispatch()
  const { address: account } = useWeb3()
  const { contract: masterChefContract, chefKey } = useMasterchef()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account, chefKey))
      console.info(txHash)
    },
    [account, dispatch, chefKey, masterChefContract, pid]
  )

  return { onStake: handleStake }
}

export default useStake
