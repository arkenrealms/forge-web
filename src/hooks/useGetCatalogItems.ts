import { useContext } from 'react'
import { ItemCatalogContext } from '~/contexts/ItemCatalogContext'

const useGetCatalogItems = () => {
  const cont: any = useContext(ItemCatalogContext)

  return cont
}

export default useGetCatalogItems
