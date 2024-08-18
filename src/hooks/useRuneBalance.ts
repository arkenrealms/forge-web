import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { getBep20Contract } from '~/utils/contractHelpers'
import { getRuneAddress } from '~/utils/addressHelpers'
import useWeb3 from './useWeb3'
import useRefresh from './useRefresh'

const useRuneBalance = (token: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { web3, address: account } = useWeb3()
  const { slowRefresh } = useRefresh()

  const tokenAddress = getRuneAddress(token)

  useEffect(() => {
    if (!account) return
    if (!tokenAddress) return

    const fetchBalance = async () => {
      console.log(`Fetching balance of ${account} for ${tokenAddress}`)
      const contract = getBep20Contract(tokenAddress, web3)
      const res = await contract.methods.balanceOf(account).call()
      setBalance(new BigNumber(res))
    }

    fetchBalance()
  }, [account, tokenAddress, web3])

  return balance
}

export default useRuneBalance
