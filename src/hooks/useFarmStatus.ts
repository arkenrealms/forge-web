import { useEffect, useState } from 'react'
import { CURRENT_FARM_SYMBOL, NEXT_FARM_SYMBOL, PREV_FARM_SYMBOL, CURRENT_FARM_PAUSED } from '~/config'
import { useRewardPerBlock } from '~/hooks/useRewardPerBlock'
import useRefresh from './useRefresh'
import { useMasterchef } from './useContract'

export const useFarmStatus = () => {
  const { slowRefresh } = useRefresh()
  const [currentFarmSymbol, setCurrentFarmSymbol] = useState(CURRENT_FARM_SYMBOL)
  const [nextFarmSymbol, setNextFarmSymbol] = useState(NEXT_FARM_SYMBOL)
  const [prevFarmSymbol, setPrevFarmSymbol] = useState(PREV_FARM_SYMBOL)
  const [currentFarmPaused, setCurrentFarmPaused] = useState(CURRENT_FARM_PAUSED)
  const [currentFarmPending, setCurrentFarmPending] = useState(false)
  const { rewardPerBlock, currentBlock, startBlock } = useRewardPerBlock()

  useEffect(() => {
    if (startBlock > currentBlock) {
      setCurrentFarmPaused(false)
      setCurrentFarmPending(true)
    } else {
      setCurrentFarmPaused(rewardPerBlock.eq(0))
      setCurrentFarmPending(false)
    }
  }, [slowRefresh, startBlock, currentBlock, rewardPerBlock])

  return {
    prevFarmSymbol,
    currentFarmSymbol,
    nextFarmSymbol,
    currentFarmPaused,
    currentFarmPending,
    rewardPerBlock,
    startBlock,
    currentBlock,
  }
}
