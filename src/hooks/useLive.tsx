import { useContext } from 'react'
import { LiveContext } from '~/contexts/LiveContext'

const useLive = () => {
  const cont: any = useContext(LiveContext)
  return cont
}

export default useLive
