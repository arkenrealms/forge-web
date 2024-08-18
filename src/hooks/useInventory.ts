import { useContext, useEffect } from 'react'
import { InventoryContext } from '~/contexts/InventoryContext'
import useWeb3 from '~/hooks/useWeb3'

const useInventory = (userAddress = null) => {
  const { address: account } = useWeb3()
  const cont: any = useContext(InventoryContext)

  // useEffect(() => {
  //   if (!userAddress && !account) return

  //   cont.setUserAddress(userAddress || account)
  // }, [account, cont, userAddress])

  return cont
}

export default useInventory
