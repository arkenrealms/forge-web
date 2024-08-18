import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync } from '~/state/actions'
import { unstake } from '~/utils/callHelpers'
import useWeb3 from '~/hooks/useWeb3'
import { useMasterchef } from './useContract'

const useUnstake = (pid: number) => {
  const dispatch = useDispatch()
  const { address: account } = useWeb3()
  const { contract: masterChefContract, chefKey } = useMasterchef()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account, chefKey))
      console.info(txHash)
    },
    [account, dispatch, chefKey, masterChefContract, pid]
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
