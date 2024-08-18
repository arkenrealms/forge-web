import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { getProfileContract } from '~/utils/contractHelpers'
import { makeBatchRequest } from '~/utils/web3'
import { useToast } from '~/state/hooks'

const useGetProfileCosts = () => {
  const [costs, setCosts] = useState({
    numberRuneToReactivate: new BigNumber(0),
    numberRuneToRegister: new BigNumber(0),
    numberRuneToUpdate: new BigNumber(0),
  })
  const { toastError } = useToast()

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const profileContract = getProfileContract()
        const [numberRuneToReactivate, numberRuneToRegister, numberRuneToUpdate] = await makeBatchRequest([
          profileContract.methods.numberRuneToReactivate().call,
          profileContract.methods.numberRuneToRegister().call,
          profileContract.methods.numberRuneToUpdate().call,
        ])

        setCosts({
          numberRuneToReactivate: new BigNumber(numberRuneToReactivate as string),
          numberRuneToRegister: new BigNumber(numberRuneToRegister as string),
          numberRuneToUpdate: new BigNumber(numberRuneToUpdate as string),
        })
      } catch (error) {
        toastError('Error', 'Could not retrieve RXS costs for profile')
      }
    }

    fetchCosts()
  }, [setCosts, toastError])

  return costs
}

export default useGetProfileCosts
