import { useEffect, useState } from 'react'
import useWeb3 from '~/hooks/useWeb3'
import { getCharacterSpecialContract } from '~/utils/contractHelpers'
import { getCharacterSpecialAddress } from '~/utils/addressHelpers'

export const BULL_NFT = 11
export const HICCUP_NFT = 10

const characterSpecialContract = getCharacterSpecialContract()

const useGetBullHiccupClaimableStatus = () => {
  const [hasChecked, setHasChecked] = useState(false)
  const [claimables, setClaimables] = useState({
    [BULL_NFT]: false,
    [HICCUP_NFT]: false,
  })
  const { address: account } = useWeb3()

  useEffect(() => {
    const checkClaimableStatus = async () => {
      if (!getCharacterSpecialAddress()) return

      const [isBullClaimable, isHiccupClaimable] = (await characterSpecialContract.methods
        .canClaimMultiple(account, [BULL_NFT, HICCUP_NFT])
        .call()) as boolean[]

      setClaimables({
        [BULL_NFT]: isBullClaimable,
        [HICCUP_NFT]: isHiccupClaimable,
      })
      setHasChecked(true)
    }

    if (account) {
      checkClaimableStatus()
    }
  }, [account, setClaimables, setHasChecked])

  return {
    isSomeClaimable: Object.values(claimables).some((status) => status === true),
    isBullClaimable: claimables[BULL_NFT],
    isHiccupClaimable: claimables[HICCUP_NFT],
    hasChecked,
  }
}

export default useGetBullHiccupClaimableStatus
