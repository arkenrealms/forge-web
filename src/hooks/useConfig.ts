import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '~/utils/formatBalance'
import { MINT_COST, REGISTER_COST } from '~/views/account/ProfileCreation/config'
import useWeb3 from './useWeb3'
import useRefresh from './useRefresh'
import { useCharacterFactory, useProfile } from './useContract'

export const useConfig = () => {
  const { web3 } = useWeb3()
  const { slowRefresh } = useRefresh()
  const [mintCost, setMintCost] = useState(MINT_COST)
  const [registerCost, setRegisterCost] = useState(REGISTER_COST)
  const characterFactoryContract = useCharacterFactory()
  const profileContract = useProfile()

  useEffect(() => {
    async function fetchRewardPerBlock() {
      const res = await characterFactoryContract.methods
        .tokenPrice()
        .call()
        .catch(() => {})
      setRegisterCost(getBalanceNumber(res))

      const res2 = await profileContract.methods
        .numberRuneToRegister()
        .call()
        .catch(() => {})
      setMintCost(getBalanceNumber(res2))
    }

    fetchRewardPerBlock()
  }, [slowRefresh, web3.eth, characterFactoryContract.methods, profileContract.methods])

  return { mintCost, registerCost }
}
