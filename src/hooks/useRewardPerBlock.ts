import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '~/utils/formatBalance'
import useWeb3 from './useWeb3'
import useRefresh from './useRefresh'
import { useMasterchef } from './useContract'

export const useRewardPerBlock = () => {
  const { web3 } = useWeb3()
  const { slowRefresh } = useRefresh()
  const [rewardPerBlock, setRewardPerBlock] = useState<BigNumber>(new BigNumber(0))
  const [startBlock, setStartBlock] = useState(0)
  const [currentBlock, setCurrentBlock] = useState(0)
  const { contract: masterChefContract } = useMasterchef()

  useEffect(() => {
    async function fetchRewardPerBlock() {
      const res = await masterChefContract.methods
        .runePerBlock()
        .call()
        .catch(() => {})
      setRewardPerBlock(new BigNumber(getBalanceNumber(res)))
      const res2 = await masterChefContract.methods
        .startBlock()
        .call()
        .catch(() => {})
      setStartBlock(res2)
      const res3 = await web3.eth.getBlockNumber(() => {})
      setCurrentBlock(res3)
    }

    fetchRewardPerBlock()
  }, [slowRefresh, web3.eth, masterChefContract.methods])

  return { rewardPerBlock, startBlock, currentBlock }
}
