import { useContext } from 'react'
import { MarketContext } from '~/contexts/MarketContext'

const useMarket = () => {
  const cont: any = useContext(MarketContext)

  return cont
}

export default useMarket
