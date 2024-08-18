import { useContext } from 'react'
import { CacheContext } from '~/contexts/CacheContext'

const useCache = () => {
  const cont: any = useContext(CacheContext)
  return cont
}

export default useCache
