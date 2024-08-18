import { useCallback } from 'react'
import { Contract } from 'web3-eth-contract'
import { ethers } from 'ethers'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync } from '~/state/actions'
import { approve } from '~/utils/callHelpers'
import useWeb3 from '~/hooks/useWeb3'
import { useMasterchef } from './useContract'

// Approve a Farm
export const useApprove = (contract: Contract) => {
  const dispatch = useDispatch()
  const { address: account } = useWeb3()
  const { contract: masterChefContract, chefKey } = useMasterchef()

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(contract, masterChefContract, account)

      dispatch(fetchFarmUserDataAsync(account, chefKey))
      return tx
    } catch (e) {
      return false
    }
  }, [account, dispatch, contract, chefKey, masterChefContract])

  return { onApprove: handleApprove }
}
