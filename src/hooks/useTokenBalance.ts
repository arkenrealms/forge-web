import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { getBep20Contract, getRuneContract } from '~/utils/contractHelpers'
import useWeb3 from './useWeb3'
import useRefresh from './useRefresh'

export const useTokenBalanceOf = (tokenAddress: string, user: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { address: account } = useWeb3()
  const { web3 } = useWeb3()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3)
      const res = await contract.methods.balanceOf(user).call()
      setBalance(new BigNumber(res))
    }

    if (account) {
      fetchBalance()
    }
  }, [account, tokenAddress, web3, user, fastRefresh])

  return balance
}

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { address: account } = useWeb3()
  const { web3 } = useWeb3()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    if (!account) return
    if (!tokenAddress) return

    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3)
      const res = await contract.methods.balanceOf(account).call()
      setBalance(new BigNumber(res))
    }

    if (account) {
      fetchBalance()
    }
  }, [account, tokenAddress, web3, fastRefresh])

  return balance
}

export const useTotalSupply = (token: string) => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  useEffect(() => {
    async function fetchTotalSupply() {
      const runeContract = getRuneContract(token)
      const supply = await runeContract.methods.totalSupply().call()
      setTotalSupply(new BigNumber(supply))
    }

    fetchTotalSupply()
  }, [slowRefresh, token])

  return totalSupply
}

export const useBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { slowRefresh } = useRefresh()
  const { web3 } = useWeb3()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3)
      const res = await contract.methods.balanceOf('0x000000000000000000000000000000000000dEaD').call()
      setBalance(new BigNumber(res))
    }

    fetchBalance()
  }, [web3, tokenAddress, slowRefresh])

  return balance
}

export default useTokenBalance
