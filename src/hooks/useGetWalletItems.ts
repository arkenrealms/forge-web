import { useContext } from 'react'
import { WalletItemsContext } from '~/contexts/WalletItemsContext'

const useGetWalletNfts = () => {
  const cont: any = useContext(WalletItemsContext)

  return cont
}

export default useGetWalletNfts
